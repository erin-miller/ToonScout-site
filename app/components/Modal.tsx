import React from "react";
import AnimatedTabContent from "@/app/components/animations/AnimatedTab";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-container">
      <AnimatedTabContent>
        <div className="modal-content">
          {children}
          {/* Close button in the top-right corner */}
          <button onClick={onClose} className="close-btn">
            &times;
          </button>
        </div>
      </AnimatedTabContent>
    </div>
  );
};

export default Modal;
