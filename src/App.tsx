import { Balance } from "./components/tests/balance";
// import { ConnectWallet } from "./components/tests/connect-wallet"
// import { SendTransaction } from "./components/tests/send-transaction";
import { Header } from "./components/Header";
import { Steps } from "./components/Steps";
import "./assets/main.scss";

function Test() {
  return (
    <>
      <Balance />
      {/* <ConnectWallet/> */}
      {/* <SendTransaction /> */}
    </>
  );
}

export const App = () => {
  return (
    <div className="main">
      <Header />
      <h1 className="main-title">
        What ideas interest you?
        <span className="main-line" />
      </h1>
      <Steps />
      {/* <Table /> */}
      <Test />
    </div>
  );
};
