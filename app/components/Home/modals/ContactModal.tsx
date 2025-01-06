import React from "react";
import AnimatedTabContent from "../../animations/AnimatedTab";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-container">
      <AnimatedTabContent>
        <div className="modal-content">
          <h3 className="text-3xl mb-2 minnie-title">Contact</h3>
          <div className="space-y-4 pt-2">
            <p>
              Need help or have a question? Please join ToonScout's{" "}
              <a
                href="https://discord.gg/Qb929SrdRP"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                support server
              </a>
              ! Alternatively, you can contact me at{" "}
              <span className="text-blue-400">c.smic</span> on Discord.
            </p>
          </div>
          {/* Close button in the top-right corner */}
          <button onClick={onClose} className="close-btn">
            &times;
          </button>
        </div>
      </AnimatedTabContent>
    </div>
  );
};

export default ContactModal;
