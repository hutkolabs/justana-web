import { Link } from "react-router-dom";

export const Table = () => {
  return (
    <ul className="table">
      <li className="table-item">
        <label>
          <input type="radio" name="tableGroup" />
          <span>Explorer</span>
        </label>
      </li>
      <li className="table-item">
        <label>
          <input type="radio" name="tableGroup" />
          <span>All rankings</span>
        </label>
      </li>
      <li className="table-item">
        <label>
          <input type="radio" name="tableGroup" />
          <span>Hot contracts</span>
        </label>
      </li>
      <li className="table-item">
        <label>
          <input type="radio" name="tableGroup" />
          <span>Chains</span>
        </label>
      </li>
      <li className="table-item">
        <label>
          <input type="radio" name="tableGroup" />
          <span>Games</span>
        </label>
      </li>
      <li className="table-item">
        <label>
          <input type="radio" name="tableGroup" />
          <span>NFTs</span>
        </label>
      </li>
      <li className="table-item">
        <label>
          <input type="radio" name="tableGroup" />
          <span>DeFi</span>
        </label>
      </li>
      <li className="table-item">
        <label>
          <input type="radio" name="tableGroup" />
          <span>Social</span>
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
