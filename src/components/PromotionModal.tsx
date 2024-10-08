import { useState } from 'react';

import close from '../assets/close.svg';

import styles from './PromotionModal.module.css';
import FocusTrap from './FocusTrap';

const PromotionModal = ({ closeCallback }: { closeCallback: () => void }) => {
  const [isOpen, setIsOpen] = useState(true);

  const closeModal = () => {
    closeCallback();
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <FocusTrap isActive={isOpen}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="프로모션 모달">
        <div className={styles.modalBackdrop} role="button" onClick={closeModal}></div>
        <div className={styles.modalContainer}>
          <div className={styles.modalContent}>
            <h2 className={`${styles.modalTitle} heading-2-text`} tabIndex={0}>
              여행할 땐 A11Y AIRLINE 앱
            </h2>
            <p className={`${styles.modalDescription} body-text`}>
              체크인, 탑승권 저장, 수하물 알림까지
              <br />- 앱으로 더욱 편하게 여행하세요!
            </p>
            <button className={`${styles.modalActionButton} button-text`}>앱에서 열기</button>
            <button className={`${styles.modalCloseButton} heading-2-text`} onClick={closeModal}>
              <img src={close} alt="닫기" />
            </button>
          </div>
        </div>
      </div>
    </FocusTrap>
  );
};

export default PromotionModal;
