import { useState } from "react"
import { TokenBalance } from "../../libs"
import { useCircle } from "../../providers"

export const Balance = () => {
  const { circle } = useCircle()
  const [balances, setBalances] = useState<Array<TokenBalance>>([])

  const fetchBalances = async () => {
    const balances = await circle.getBalances()
    setBalances(balances)
  }

  return (
    <div>
      <h1>Balances</h1>
      {
        balances.map((balance) => (
          <div key={balance.token.tokenAddress}>
            <p>{balance.amount}</p>
            <p>{balance.token.symbol}</p>
          </div>)
        )
      }
      <button onClick={fetchBalances}>Fetch Balances</button>
    </div>
  )
}