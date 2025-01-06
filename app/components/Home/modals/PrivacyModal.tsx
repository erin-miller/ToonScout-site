import React from "react";
import AnimatedTabContent from "../../animations/AnimatedTab";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-container">
      <AnimatedTabContent>
        <div className="modal-content max-h-[700px] overflow-y-auto privacy-scrollbar">
          <h2 className="minnie-title text-3xl">Privacy Policy</h2>
          <h3 className="text-2xl py-2 text-gray-1000 dark:text-gray-100">
            Last Updated: January 6th, 2025
          </h3>
          <div className="space-y-2">
            <p>
              Welcome to ToonScout! Your privacy is important to us. This
              Privacy Policy explains how we collect, use, and protect your
              information.
            </p>
            <h3 className="privacy-title">Information We Collect</h3>
            <p>
              We use Google Analytics to collect site metrics, such as page
              views and user activity. This data is anonymous and helps us
              improve our website. No personally identifiable information is
              collected through Google Analytics.
            </p>
            <h3 className="privacy-title">Discord Authorization Data</h3>
            <p>
              If you authenticate with Discord, we store:
              <ul className="list-inside list-disc">
                <li>Your Discord ID</li>
                <li>Your most recent Toon data</li>
                <li>
                  An access token, stored in a cookie for authentication
                  purposes
                </li>
              </ul>
            </p>
            <h3 className="privacy-title">How We Use Your Information</h3>
            <p>
              Your data is used to provide ToonScout&apos;s features and
              services on Discord.
            </p>
            <h3 className="privacy-title">Information Sharing</h3>
            <p>
              We do not disclose or sell your information to any third parties.
            </p>
            <h3 className="privacy-title">Data Security</h3>
            <p>
              We take reasonable measures to protect your data from unauthorized
              access or misuse.
            </p>
            <h3 className="privacy-title">Your Data</h3>
            <p>
              If you no longer wish to use ToonScout, you may request that we
              delete your stored data by contacting us at the{" "}
              <a
                href="https://discord.gg/Qb929SrdRP"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:underline"
              >
                support server
              </a>
              .
            </p>
          </div>
          <button onClick={onClose} className="close-btn pr-4">
            &times;
          </button>
        </div>
      </AnimatedTabContent>
    </div>
  );
};

export default PrivacyModal;
