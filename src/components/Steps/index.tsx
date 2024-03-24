import { useInfo } from "../../providers";
import { SendTransaction } from "../tests/send-transaction";

export const Steps = () => {
  const {advise} = useInfo();

  return (
    <div className="steps-wrapper">
      <div className="card">
        <span className="card-title">Daily task!</span>
        <span className="card-task">
          {advise?.advise}
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
