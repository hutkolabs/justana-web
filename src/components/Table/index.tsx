import { Link } from "react-router-dom";

export const Table = () => {
  return (
    <ul className="table">
      <li className="table-item">
        <label>
          <input type="radio" name="tableGroup" />
          <span>BTC</span>
        </label>
      </li>
      <li className="table-item">
        <label>
          <input type="radio" name="tableGroup" />
          <span>ETH</span>
        </label>
      </li>
      <li className="table-item">
        <label>
          <input type="radio" name="tableGroup" />
          <span>USDT</span>
        </label>
      </li>
      <li className="table-item">
        <label>
          <input type="radio" name="tableGroup" />
          <span>BNB</span>
        </label>
      </li>
      <li className="table-item">
        <label>
          <input type="radio" name="tableGroup" />
          <span>OP</span>
        </label>
      </li>
      <li className="table-item">
        <label>
          <input type="radio" name="tableGroup" />
          <span>MATIC</span>
        </label>
      </li>
      <li>
        <div className="table-btn">
          <Link to="/steps" className="btn">
            Choose
          </Link>
        </div>
      </li>
    </ul>
  );
};
