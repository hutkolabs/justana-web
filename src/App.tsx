import { Balance } from "./components/tests/balance"
import { ConnectWallet } from "./components/tests/connect-wallet"
import { SendTransaction } from "./components/tests/send-transaction"

function App() {
  return (
    <>
      <Balance/>
      <ConnectWallet/>
      <SendTransaction/>
    </>
  )
}

export default App
