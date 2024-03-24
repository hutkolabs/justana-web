import { CircleApi, ExecuteParams } from "../circle";

import { Contract, JsonRpcProvider, Interface, AbiCoder, parseEther } from 'ethers'

import { INFURA_API_KEY } from "../../config/environment";
import { IntentArtifact } from "./intent.abi";

enum Operator {
  StrictlyLessBy,
  LessBy,
  Equal,
  BiggerBy,
  StrictlyBiggerBy
}

const partialIntentProcessorInterface = new Interface(IntentArtifact.abi)

const provider = new JsonRpcProvider(`https://polygon-mumbai.infura.io/v3/${INFURA_API_KEY}`, {
  name: 'mumbai',
  chainId: 80001
})

const abiCoder = new AbiCoder()

const intentComponents = [
  {
    "internalType": "bytes",
    "name": "prompt",
    "type": "bytes"
  },
  {
    "internalType": "bytes",
    "name": "intentType",
    "type": "bytes"
  },
  {
    "internalType": "address",
    "name": "owner",
    "type": "address"
  },
  {
    "internalType": "address",
    "name": "validator",
    "type": "address"
  },
  {
    "internalType": "uint32[]",
    "name": "permissions",
    "type": "uint32[]"
  },
  {
    "internalType": "bytes[]",
    "name": "permissionsPayload",
    "type": "bytes[]"
  },
  {
    "internalType": "bytes[]",
    "name": "targetFields",
    "type": "bytes[]"
  },
  {
    "internalType": "bytes[]",
    "name": "targetFieldsState",
    "type": "bytes[]"
  },
  {
    "internalType": "uint256",
    "name": "premium",
    "type": "uint256"
  },
  {
    "internalType": "uint256",
    "name": "expiration",
    "type": "uint256"
  }
]

type ExecuteIntentParams = {
  intentId: string;
  amountIn: number;
  assetIn: string;
  assetTo: string;
  minAmountOut: number;
};

export class Intent {
  validatorAddress = '0x46D93062350Fdb1Cc859413618Cc959296124f7c'

  intentProcessorAddress = '0x07470b813dE1662d53C6dc146656c222422A8901'
  intentProcessorContract = new Contract(this.intentProcessorAddress, partialIntentProcessorInterface, provider)

  swapIntentSolver = "0xC90a92Ae845D82Ff3b00A2D18e56DCE6AF834Cf5"

  constructor(private readonly circle: CircleApi) { }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  decodeIntent(data: Array<any>) {
    const fixed =  data.reduce((acc: object, value, index) => {
      const { name } = intentComponents[index]

      return Object.assign(acc, { [name]: value })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {}) as any

    return {
      ...fixed,
      permissionsPayload: fixed.permissionsPayload.map((payload: string) => {
        return Array.from(abiCoder.decode(['address', 'address', 'uint256'], payload))
      }),
      targetFields: fixed.targetFields.map((targetField: string) => {
        return Array.from(abiCoder.decode(['address'], targetField))
      }),
      targetFieldsState: fixed.targetFieldsState.map((targetFieldState: string) => {
        return Array.from(abiCoder.decode(['uint8', 'uint256'], targetFieldState))
      })
    }
  }

  async getIntent() {
    console.log(this.circle.userAddress)
    const address = "0x5ab3e8b9ff3711560a8d8626d6c510c06be40216"

    const count = await this.intentProcessorContract.userIntentCounts(address) as bigint
    console.log(count)
    const intentId = await this.intentProcessorContract.getUserIntentByIndex(address, count - 1n)

    const intent = await this.intentProcessorContract.getIntent(intentId)

    console.log(intent)

    return {
      intent: this.decodeIntent(Array.from(intent)),
      intentId
    }
  }

  async placeIntent({
    assetIn,
    assetTo,
    amountIn,
    minAmountOut
  }: Omit<ExecuteIntentParams, 'intentId'>) {
    const walletId = await this.circle.getWalletId()
    const walletAddress = this.circle.userAddress
    const blockNumber = await provider.getBlockNumber()

    const spender = this.validatorAddress;

    const tokenInAddress = assetIn;
    const tokenOutAddress = assetTo;

    const swapAmount = amountIn;
    const amount = 0;

    const inValue = amountIn;
    const outValue = minAmountOut;

    const prompt = '';
    const bytesBalance = new TextEncoder().encode('balance')

    //bytes[] permissionsPayload; [ abi.encode(address tokenAddress, address spender, uint256 amount) ]
    const permissionsPayload = [
      // abiCoder.encode(
      //   ['address', 'address', 'uint256'],
      //   [tokenInAddress, spender, swapAmount]
      // )
    ]

    //bytes[] targetFields; [abi.encode(address tokenInAddress), abi.encode(address tokenOutAddress)]]
    const targetFields = [
      abiCoder.encode(['address'], [tokenInAddress]),
      abiCoder.encode(['address'], [tokenOutAddress])
    ]

    //bytes[] targetFieldsState; [abi.encode(Operator operator, uint256 value), abi.encode(Operator operator, uint256 value)]
    const targetFieldsState = [
      abiCoder.encode(['uint8', 'uint256'], [Operator.LessBy, inValue]),
      abiCoder.encode(['uint8', 'uint256'], [Operator.BiggerBy, outValue])
    ]

    const intent = {
      prompt: new TextEncoder().encode(prompt),
      intentType: bytesBalance,
      owner: walletAddress,
      validator: this.validatorAddress,
      permissions: [],
      permissionsPayload: [],
      targetFields,
      targetFieldsState,
      premium: parseEther(`${amount}`),
      expiration: blockNumber + 1000
    }

    const intentData = partialIntentProcessorInterface.encodeFunctionData('placeIntent', [intent])

    const params: ExecuteParams = {
      callData: intentData,
      amount: `${amount}`,
      contractAddress: this.intentProcessorAddress,
      walletId
    }

    return await this.circle.waitNewTransaction(async () => {
      const { data: challenge } = await this.circle.executeTransaction(params)

      await this.circle.runChallenge(challenge)
    })
  }

  async executeIntent({ intentId, amountIn, assetIn, assetTo, minAmountOut }: ExecuteIntentParams) {
    const walletId = await this.circle.getWalletId()
    const solver = this.swapIntentSolver;
    const receiver = this.circle.userAddress;

    const payload = abiCoder.encode(
      ['uint256', 'address', 'address', 'uint256', 'address',],
      [amountIn, assetIn, assetTo, minAmountOut, receiver]
    )

    const intentData = partialIntentProcessorInterface.encodeFunctionData('executeIntent', [solver, intentId, payload])

    const params: ExecuteParams = {
      callData: intentData,
      amount: `0`,
      contractAddress: this.intentProcessorAddress,
      walletId
    }
    
    return await this.circle.waitNewTransaction(async () => {
      const { data: challenge } = await this.circle.executeTransaction(params)

      await this.circle.runChallenge(challenge)
    })
  }

  async estimateExecuteIntentGas({ intentId, amountIn, assetIn, assetTo, minAmountOut }: ExecuteIntentParams) {
    // const walletId = await this.circle.getWalletId()
    const solver = this.swapIntentSolver;
    const receiver = "0x5ab3e8b9ff3711560a8d8626d6c510c06be40216";//this.circle.userAddress;

    const payload = abiCoder.encode(
      ['uint256', 'address', 'address', 'uint256', 'address',],
      [amountIn, assetIn, assetTo, minAmountOut, receiver]
    )

    console.log(solver, intentId, payload)

    // const intentData = partialIntentProcessorInterface.encodeFunctionData('executeIntent', [solver, intentId, payload])

    // const params: ExecuteParams = {
    //   callData: intentData,
    //   amount: `0`,
    //   contractAddress: this.intentProcessorAddress,
    //   walletId
    // }
    
    return await this.intentProcessorContract.executeIntent.estimateGas(solver, intentId, payload)
  }
}