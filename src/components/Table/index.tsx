import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInfo } from "../../providers";

const tokens = [
  "WBTC",
  "WETH",
  "LINK",
  "AAVE",
  "CRV",
]


export const Table = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const navigate = useNavigate();
  const { submitSelectedTokens } = useInfo();

  const handleSelect = (token: string): React.ChangeEventHandler<HTMLInputElement> => () => {
    console.log(token);
    if (selected.includes(token)) {
      setSelected(selected.filter((t) => t !== token));
    } else {
      setSelected([...selected, token]);
    }
  }

  const handleSubmit = async () => {
    console.log(selected);
    await submitSelectedTokens(selected)

    navigate('/steps');

  }

  return (
    <ul className="table">
      {tokens.map((token) => (
        <li key={token} className="table-item">
          <label>
            <input
              type="checkbox"
              checked={selected.includes(token)}
              onChange={handleSelect(token)}
            />
            <span >{token}</span>
          </label>
        </li>
      ))}
      <button type="submit" className="btn" onClick={handleSubmit}>
        Choose
      </button>
    </ul>
  );
};
