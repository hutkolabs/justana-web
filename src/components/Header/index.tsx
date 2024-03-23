import { Link } from "react-router-dom";
import { ConnectWallet } from "../tests/connect-wallet";

export const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="header-logo">
        Justana
      </Link>
      <ul className="header-list">
        <li className="header-item">
          <ConnectWallet />
        </li>
        <Link to="/balance" className="header-item">
          Account
        </Link>
      </ul>
    </header>
  );
};
