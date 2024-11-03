import { FC, PropsWithChildren, useRef } from 'react';
import ReactDOM from 'react-dom';

import styles from './Modal.module.scss';

interface IModal {
  isOpen: boolean | any[] | string | number;
}

const Modal: FC<PropsWithChildren<IModal>> = ({ isOpen, children }) => {
  const modalRef = useRef<HTMLElement | null>(document.getElementById('modal'));

  if (
    !modalRef.current ||
    (!Array.isArray(isOpen) && !isOpen) ||
    (Array.isArray(isOpen) && !isOpen.length)
  ) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>{children}</div>
    </div>,
    modalRef.current
  );
};

export default Modal;
