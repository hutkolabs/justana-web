import { v4 as uuidv4 } from 'uuid'
import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk'
import { AppID, User, ChallengeId, Wallets, TokenBalances, InitTransactionParams, Transactions, Transaction, CircleApiResponse, Blockchains } from './circle.types'

type TransferParams = {
  recipient: string
  amount: number
  symbol: string

}

export class CircleApi {
  authHeaders: Headers = new Headers()
  baseUrl: URL
  sdk = new W3SSdk()

  userAddress: string | null = null

  userId: string | null = null;

  #appId: string | null = localStorage.getItem('appId');

  #userToken: string | null = localStorage.getItem('userToken');
  #encryptionKey: string | null = localStorage.getItem('encryptionKey');

  //#region Setters
  set appId(appId: string) {
    localStorage.setItem('appId', appId);
    this.#appId = appId
  }

  set userToken(userToken: string) {
    localStorage.setItem('userToken', userToken);
    this.#userToken = userToken
  }

  set encryptionKey(encryptionKey: string) {
    localStorage.setItem('encryptionKey', encryptionKey);
    this.#encryptionKey = encryptionKey
  }
  //#endregion Setters

  constructor(private apiKey: string, baseUrl: string) {
    this.apiKey = apiKey
    this.baseUrl = new URL(baseUrl)

    this.authHeaders.set('Content-Type', 'application/json')
    this.authHeaders.set('Authorization', `Bearer ${this.apiKey}`)
  }

  async connectWallet({ userId }: { userId: string } ) {
    this.userId = userId

    await this.initAppId()
    await this.createUser()
    await this.initUserSession()
    this.setupAppSettings()
    this.setupUserSession()

    const challenge = await this.initializeUser({ userToken: this.#userToken! })
    if (challenge) {
      await this.runChallenge(challenge)
    }

    const { wallets } = await this.checkWalletStatus()

    const address = wallets[0].address

    console.log({ address });

    this.userAddress = address
  }

  async getBalances() {
    const { wallets } = await this.checkWalletStatus();

    const walletId = wallets[0].id

    const balances = await this.walletBalance({ walletId });
    if (!balances) {
      return []
    }

    return balances.tokenBalances
  }

  async transfer({
    recipient,
    amount,
    symbol
  }: TransferParams) {
    const walletId = await this.getWalletId();


    const balances = await this.getBalances();
    const token = balances.find(({ token }) => token.symbol === symbol)
    if (!token) {
      throw new Error('Token not found')
    }
    if (parseFloat(token.amount) < amount) {
      throw new Error('Insufficient balance')
    }
    const tokenId = token.token.id

    return await this.waitNewTransaction(async () => {
      const challenge = await this.initiateTransaction({
        userToken: this.#userToken!,
        walletId,
        destinationAddress: recipient,
        amount,
        tokenId,
      })
      if (challenge) {
        await this.runChallenge(challenge)
      }
    })

  }

  #walletId: string | null = null;
  async getWalletId() {
    if (!this.#walletId) {
      const { wallets } = await this.checkWalletStatus()
      this.#walletId = wallets[0].id
    }
    return this.#walletId
  }

  //#region AppId
  private async initAppId() {
    if (!this.#appId) {
      this.appId = await this.getAppId()
    }
  }

  private setupAppSettings() {
    this.sdk.setAppSettings({ appId: this.#appId! });
  }

  private async getAppId() {
    const pathUrl = '/v1/w3s/config/entity'

    const url = new URL(pathUrl, this.baseUrl)
    const options = {
      method: 'GET',
      headers: this.authHeaders
    };

    const response = await this.request<AppID>(url, options);

    console.log(response);


    const { data } = response

    return data.appId
  }
  //#endregion AppId

  //#region UserSession
  async initUserSession() {
    if (!this.#userToken || !this.#encryptionKey) {
      await this.updateUserSession()
    }
  }

  async updateUserSession() {
    const userSession = await this.acquireSessionToken();
    this.userToken = userSession.userToken;
    this.encryptionKey = userSession.encryptionKey;
  }

  private async acquireSessionToken() {
    const pathUrl = '/v1/w3s/users/token'
    const url = new URL(pathUrl, this.baseUrl)

    const options = {
      method: 'POST',
      headers: this.authHeaders,
      body: JSON.stringify({ userId: this.getUserId() })
    };

    const { data } = await this.request<User>(url, options);

    return data
  }

  setupUserSession() {
    this.sdk.setAuthentication({ userToken: this.#userToken!, encryptionKey: this.#encryptionKey! });
  }
  //#endregion UserSession

  runChallenge({ challengeId }: ChallengeId) {
    return new Promise((resolve, reject) => {
      this.sdk.execute(challengeId, (error, result) => {
        if (error) {
          reject(error)
          return
        }
        resolve(result)
      })
    })
  }

  private async createUser() {
    const pathUrl = '/v1/w3s/users'
    const url = new URL(pathUrl, this.baseUrl)

    const options = {
      method: 'POST',
      headers: this.authHeaders,
      body: JSON.stringify({
        userId: this.getUserId()
      })
    }

    const result = await this.request<Record<string, never>>(url, options);
    console.log({ createUser: result });
  }

  private async initializeUser({ userToken }: Pick<User, 'userToken'>): Promise<ChallengeId | null> {
    const pathUrl = '/v1/w3s/user/initialize'
    const url = new URL(pathUrl, this.baseUrl)
    const headers = new Headers(this.authHeaders)
    headers.set('X-User-Token', userToken)

    const body = {
      idempotencyKey: this.getIdempotencyKey(),
      blockchains: [Blockchains.MATIC_MUMBAI],
    }

    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    }

    const { data } = await this.request<ChallengeId>(url, options);

    console.log({ initializeUser: data });

    return data ?? null;
  }

  private async checkWalletStatus() {
    const userId = this.getUserId()
    const pathUrl = '/v1/w3s/wallets'

    const url = new URL(pathUrl, this.baseUrl)

    const query = new URLSearchParams({
      userId
    })

    url.search = query.toString()

    const options = {
      method: 'GET',
      headers: this.authHeaders,

    };

    const { data } = await this.request<Wallets>(url, options);
    console.log({ checkWalletStatus: data });
    return data
  }

  private async walletBalance({ walletId }: { walletId: string }) {
    const pathUrl = `/v1/w3s/wallets/${walletId}/balances`

    const url = new URL(pathUrl, this.baseUrl)

    const options = {
      method: 'GET',
      headers: this.authHeaders,
    };

    try {
      const { data } = await this.request<TokenBalances>(url, options);
      console.log({ data });
      return data
    } catch (error) {
      console.error('Error:', error);
    }
  }

  private async initiateTransaction({ userToken, destinationAddress, amount, tokenId, walletId }: InitTransactionParams): Promise<ChallengeId> {
    const pathUrl = '/v1/w3s/user/transactions/transfer'
    const url = new URL(pathUrl, this.baseUrl)
    const headers = new Headers(this.authHeaders)
    headers.set('X-User-Token', userToken)
    const body = {
      idempotencyKey: this.getIdempotencyKey(),
      userId: this.getUserId(),
      destinationAddress,
      refId: 'reference',
      amounts: [`${amount}`],
      feeLevel: 'HIGH',
      tokenId,
      walletId
    }

    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    }

    const response = await this.request<ChallengeId>(url, options);

    if ('code' in response && response.code === 155104) {
      await this.updateUserSession()
      this.setupUserSession()

      return await this.initiateTransaction({ userToken: this.#userToken!, destinationAddress, amount, tokenId, walletId })
    }
    const { data } = response

    console.log({ data });

    return data
  }

  //#region Transactions
  async getTransactions() {
    const pathUrl = '/v1/w3s/transactions'
    const url = new URL(pathUrl, this.baseUrl)
    const headers = new Headers(this.authHeaders)
    // const userToken = localStorage.getItem('userToken')
    // headers.set('X-User-Token', userToken!)

    const query = new URLSearchParams({
      userId: this.getUserId()
    })

    url.search = query.toString()

    const options = {
      method: 'GET',
      headers,
    }

    try {
      const { data } = await this.request<Transactions>(url, options)
      console.log({ data })
      return data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  private async getLastTransaction() {
    const data = await this.getTransactions()
    const { transactions } = data!;
    return transactions[0]
  }
  //#endregion Transactions

  async waitNewTransaction(runTransaction: () => Promise<void>) {
    const { txHash: previousHash } = await this.getLastTransaction();
    await runTransaction();
    return new Promise<Transaction>((resolve) => {
      const interval = setInterval(async () => {
        const transaction = await this.getLastTransaction();
        const { txHash } = transaction;
        if (txHash !== previousHash) {
          clearInterval(interval);
          resolve(transaction);
        }
      }, 1000)
    })
  }

  private async request<T extends object>(url: string | URL, options: RequestInit): Promise<CircleApiResponse<T>> {
    const response = await fetch(url, options)
    const json = await response.json()
    return json as CircleApiResponse<T>
  }

  private getUserId() {
    return this.userId!
  }

  private getIdempotencyKey() {
    return uuidv4()
  }
}