import { forwardRef, useImperativeHandle, useState, ReactNode } from "react";
import { Portal } from "../Portal";

interface ModalProps {
  children: ReactNode;
}

export interface ModalRef {
  open: () => void;
  close: () => void;
}

export const Modal = forwardRef<ModalRef, ModalProps>(function ModalComponent(
  { children },
  ref
) {
  const [isShow, setShow] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setShow(true),
    close: () => setShow(false),
  }));

  return isShow ? (
    <Portal>
      <div className="modal">
        <button
          type="button"
          className="modal-btn"
          onClick={() => setShow(false)}
        />
        <div className="modal-body">{children}</div>
      </div>
      <span className="overlay" />
    </Portal>
  ) : null;
});
