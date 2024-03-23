import { useCircle } from "../../providers";
import { useRef, useState } from "react";
import { Modal, ModalRef } from "../Modal";

const shortizeAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const ConnectWallet = () => {
  const modalRef = useRef<ModalRef>(null);

  const [userAddress, setUserAddress] = useState<string>("");
  const { circle } = useCircle();

  const isConnected = userAddress;

  const connectWallet = async () => {
    if (!isConnected) {
      await circle.connectWallet();
      setUserAddress(circle.userAddress!);
    } else {
      setUserAddress("");
      modalRef?.current?.open();
    }
  };

  const showModal = () => {
    modalRef?.current?.open();
  };

  return (
    <>
      <button className="btn" onClick={showModal}>
        {isConnected ? shortizeAddress(userAddress) : "Connect Wallet"}
      </button>
      <Modal ref={modalRef}>
        <label htmlFor="" className="input-label">
          nickname
          <input type="text" className="input" />
        </label>
        <div className="input-btn">
          <button className="btn" onClick={connectWallet}>
            Submit
          </button>
        </div>
      </Modal>
    </>
  );
};
