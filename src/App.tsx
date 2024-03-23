import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Steps } from "./components/Steps";
import { Table } from "./components/Table";
import { Balance } from "./components/tests/balance";

import "./assets/main.scss";

export const App = () => {
  return (
    <BrowserRouter>
      <div className="main">
        <div className="main-content">
          <Header />
          <h1 className="main-title">
            What ideas interest you?
            <span className="main-line" />
          </h1>
          <Routes>
            <Route path="/balance" element={<Balance />} />
            <Route path="/steps" element={<Steps />} />
            <Route path="/" element={<Table />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};
