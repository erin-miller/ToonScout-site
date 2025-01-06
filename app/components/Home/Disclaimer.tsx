import React, { useState } from "react";
import PrivacyModal from "./modals/PrivacyModal";
import AboutModal from "./modals/AboutModal";
import ContactModal from "./modals/ContactModal";

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
        <button onClick={() => openModal("contact")} className="modal-btn">
          Contact
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
      {activeModal === "contact" && (
        <ContactModal isOpen={true} onClose={closeModal} />
      )}
    </div>
  );
};

export default Disclaimer;
