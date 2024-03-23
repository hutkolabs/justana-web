import { SendTransaction } from "../tests/send-transaction";

export const Steps = () => {
  return (
    <div className="steps-wrapper">
      <div className="card">
        <span className="card-title">Daily task!</span>
        <span className="card-task">
          Given Ethereum's Dencun update and the price's recession in the last
          few days, you might want to consider allocating 10% of your investment
          portfolio to ETH.
        </span>
        <ul className="card-footer">
          <li className="card-btn">
            <SendTransaction />
          </li>
          <li className="card-btn">
            <button className="btn">Decline</button>
          </li>
        </ul>
      </div>
      <div className="steps-container">
        <ul className="steps">
          <li className="step" />
          <li className="step" data-value="Step done 1" />
          <li className="step" data-value="Step done 2" />
          <li className="step" />
          <li className="step" />
        </ul>
        <div className="steps-ball" />
      </div>
    </div>
  );
};
