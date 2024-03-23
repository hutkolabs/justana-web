export type CircleApiResponse<T extends object> = {
  data: T
}

export type AppID = {
  appId: string
}

export type User = {
  encryptionKey: string,
  userToken: string
}

export type ChallengeId = {
  challengeId: string
}

export type Wallets = {
  wallets: Array<Wallet>
}

export type Wallet = {
  id: string
  state: string
  walletSetId: string
  custodyType: string
  userId: string
  address: string
  blockchain: string
  accountType: string
  updateDate: string
  createDate: string
}

export interface TokenBalance {
  token: Token
  amount: string
  updateDate: string
}

export interface Token {
  id: string
  blockchain: string
  tokenAddress: string
  standard: string
  name: string
  symbol: string
  decimals: number
  isNative: boolean
  updateDate: string
  createDate: string
}


export type TokenBalances = {
  tokenBalances: Array<TokenBalance>
}

export type Transaction = {
  id: string
  blockchain: string
  tokenId: string
  walletId: string
  sourceAddress: string
  destinationAddress: string
  transactionType: string
  custodyType: string
  state: string
  amounts: string[]
  nfts: unknown
  txHash: string
  blockHash: string
  blockHeight: number
  networkFee: string
  firstConfirmDate: string
  operation: string
  userId: string
  abiParameters: unknown
  createDate: string
  updateDate: string
}

export type Transactions = {
  transactions: Array<Transaction>
}

export enum Blockchains {
  MATIC_MUMBAI = 'MATIC-MUMBAI',
  ETH_SEPOLIA = 'ETH-SEPOLIA',
}

export type InitTransactionParams = {
  userToken: string
  destinationAddress: string
  amount: number
  tokenId: string
  walletId: string
}