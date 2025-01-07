import React, { useEffect, useState } from "react";
import OAuth from "./OAuthModal";
import ArrowButton from "@/app/components/ArrowButton";
import AnimatedTabContent from "@/app/components/animations/AnimatedTab";
import { useDiscordContext } from "@/app/context/DiscordContext";

interface DiscordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DiscordModal: React.FC<DiscordModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [step, setStep] = useState<1 | 2>(1); // 1: OAuth, 2: Add Bot
  const { userId } = useDiscordContext();

  useEffect(() => {
    if (userId) {
      setStep(2);
    }
  }, [userId]);

  const handleClick = () => {
    window.open(
      "https://discord.com/oauth2/authorize?client_id=1286517155315322950",
      "_blank",
      "noopener noreferrer"
    );
  };

  return (
    <div className="modal-container">
      <AnimatedTabContent>
        <div className="modal-content">
          {/* Step 1: OAuth */}
          {step === 1 && <OAuth />}

          {/* Step 2: Add Bot */}
          {step === 2 && (
            <div>
              <h3 className="text-2xl mb-2 minnie-title">You're connected!</h3>
              <p className="py-2">
                Click the button below to add the bot to your Discord account.
              </p>
              <div className="space-x-2">
                <ArrowButton onClick={handleClick} />
              </div>
            </div>
          )}

          {/* Close button in the top-right corner */}
          <button onClick={onClose} className="close-btn">
            &times;
          </button>
        </div>
      </AnimatedTabContent>
    </div>
  );
};

export default DiscordModal;
