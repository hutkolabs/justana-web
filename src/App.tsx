import { Header } from "./components/Header";
import { Steps } from "./components/Steps";

import "./assets/main.scss";

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
    </div>
  );
};
