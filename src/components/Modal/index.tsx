import { forwardRef, useImperativeHandle, useState, ReactNode } from 'react';

import { Portal } from '@components/Portal/index';

interface ModalProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export interface ModalRef {
  open: () => void;
  close: () => void;
}

export const Modal = forwardRef<ModalRef, ModalProps>(function ModalComponent(
  { title, subtitle, children, className },
  ref
) {
  const [isShow, setShow] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setShow(true),
    close: () => setShow(false)
  }));

  return isShow ? (
    <Portal>
      <div className={`modal ${className ? className : ''}`}>
        <div className="modal-header">
          <h4 className="modal-heading">{title}</h4>
          {subtitle && <span className="modal-subtitle">{subtitle}</span>}
          <button type="button" className="modal-btn" onClick={() => setShow(false)}>
            x
          </button>
        </div>
        {children}
      </div>
      <span className="overlay" />
    </Portal>
  ) : null;
});
