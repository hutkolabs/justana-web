import { useCircle } from "../../providers";
import { useRef, useState, FormEvent } from "react";
import { Modal, ModalRef } from "../Modal";

const shortizeAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

export const ConnectWallet = () => {
  const modalRef = useRef<ModalRef>(null);
  const [userAddress, setUserAddress] = useState("");
  const { circle } = useCircle();

  const connectWallet = async (name: string) => {
    if (!userAddress) {
      await circle.connectWallet({ userId: name });
      setUserAddress(circle.userAddress || "");
      modalRef.current?.close();
    } else {
      setUserAddress("");
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nickname = new FormData(e.currentTarget).get("nickname") as string;
    connectWallet(nickname);
  };

  return (
    <>
      <button className="btn" onClick={() => modalRef.current?.open()}>
        {userAddress ? shortizeAddress(userAddress) : "Connect Wallet"}
      </button>
      <Modal ref={modalRef}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="nickname" className="input-label">
            Nickname
            <input
              type="text"
              className="input"
              id="nickname"
              name="nickname"
            />
          </label>
          <div className="input-btn">
            <button type="submit" className="btn">
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
