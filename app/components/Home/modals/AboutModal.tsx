import React from "react";
import AnimatedTabContent from "../../animations/AnimatedTab";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-container">
      <AnimatedTabContent>
        <div className="modal-content">
          <h3 className="text-3xl mb-2 minnie-title">Hi there!</h3>
          <div className="flex mt-4 items-center justify-center overflow-x-auto privacy-scrollbar">
            <div className="flex space-x-4">
              <img
                src="/images/sunny.png"
                alt="Sunny"
                className="w-auto max-h-64 rounded-lg shadow-lg"
              />
              <img
                src="/images/rainy.png"
                alt="Rainy"
                className="w-auto max-h-64 rounded-lg shadow-lg"
              />
              <img
                src="/images/meerkataclysm.png"
                alt="Meerkataclysm"
                className="w-auto max-h-64 rounded-lg shadow-lg"
              />
              <img
                src="/images/cloudy.png"
                alt="Cloudy"
                className="w-auto max-h-64 rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="space-y-4 pt-8">
            <p>My name is Erin! I've been playing Toontown since 2008.</p>
            <p>
              ToonScout is my personal project originally created to teach
              myself how to build a full-stack application with a Discord bot.
            </p>
            <p>
              I really appreciate you taking the time to check the project out.
              If you ever see me in-game, please don't hesitate to say hello!
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

export default AboutModal;
