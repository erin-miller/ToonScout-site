import React, { useState } from "react";
import PrivacyModal from "./modals/PrivacyModal";
import AboutModal from "./modals/AboutModal";

const Disclaimer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (modalName: string) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  return (
    <div className="disclaimer-text">
      <div className="space-x-4">
        <button onClick={() => openModal("about")} className="modal-btn">
          About
        </button>
        <button onClick={() => openModal("privacy")} className="modal-btn">
          Privacy Policy
        </button>
      </div>
      <p className="pt-1">
        This website and the Discord app are not affiliated with Toontown
        Rewritten.
      </p>

      {/* Modals */}
      {activeModal === "about" && (
        <AboutModal isOpen={true} onClose={closeModal} />
      )}
      {activeModal === "privacy" && (
        <PrivacyModal isOpen={true} onClose={closeModal} />
      )}
    </div>
  );
};

export default Disclaimer;
