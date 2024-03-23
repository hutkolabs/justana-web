import { useState } from "react";
import { TokenBalance } from "../../libs";
import { useCircle } from "../../providers";

export const Balance = () => {
  const { circle } = useCircle();
  const [balances, setBalances] = useState<Array<TokenBalance>>([]);

  const fetchBalances = async () => {
    const balances = await circle.getBalances();
    setBalances(balances);
  };

  return (
    <div className="bal-wrapper">
      <h1 className="bal-header">Balances</h1>
      <ul className="bal">
        {balances.map((balance) => (
          <li className="bal-item" key={balance.token.tokenAddress}>
            <p>{balance.amount}</p>
            <p>{balance.token.symbol}</p>
          </li>
        ))}
      </ul>
      <div className="table-btn">
        <button className="btn" onClick={fetchBalances}>
          Fetch Balances
        </button>
      </div>
    </div>
  );
};
