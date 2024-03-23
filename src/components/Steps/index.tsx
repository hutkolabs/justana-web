import { SendTransaction } from "../tests/send-transaction";

export const Steps = () => {
  return (
    <div className="steps-wrapper">
      <div className="card">
        <span className="card-title">Daily task!</span>
        <span className="card-task">Feed your cat</span>
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
          <li className="step" />
          <li className="step" />
          <li className="step" />
          <li className="step" />
        </ul>
        <div className="steps-ball" />
      </div>
    </div>
  );
};
