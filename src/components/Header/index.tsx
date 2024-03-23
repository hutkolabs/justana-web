import { ConnectWallet } from "../tests/connect-wallet";

export const Header = () => {
  return (
    <header className="header">
      <a href="#" className="header-logo">
        Indigo
      </a>
      <ul className="header-list">
        <li className="header-item">
          <ConnectWallet />
        </li>
        <li className="header-item">User</li>
      </ul>
    </header>
  );
};
