import { handleOAuthToken } from "@/app/api/DiscordOAuth";
import { useToonContext } from "../../context/ToonContext";
import React, { useEffect, useState } from "react";
import OAuth from "../OAuth/OAuth";
import ArrowButton from "../ArrowButton";
import { sendScoutData } from "@/app/api/ScoutWebSocket";
import AnimatedTabContent from "../animations/AnimatedTab";
import { useDiscordContext } from "@/app/context/DiscordContext";

interface DiscordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DiscordModal: React.FC<DiscordModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1); // 1: OAuth, 2: Add Bot
  const { userId, setUserId } = useDiscordContext();
  const { toonData } = useToonContext();

  useEffect(() => {
    if (userId && toonData) {
      sendScoutData(userId, toonData);
    }
  }, [toonData, userId]);

  useEffect(() => {
    const checkAccessToken = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_HTTP + "/get-token",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        console.log("Token found.");
        const { userId } = await response.json();
        if (userId) {
          setStep(2);
          setUserId(userId);
        } else {
          setError("No user ID found.");
        }
      } else {
        console.log("No token found.");
      }
    };

    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get("access_token");

    if (accessToken) {
      handleOAuthToken(fragment).then((userId) => {
        if (userId) {
          setStep(2);
          setUserId(userId);
        } else {
          setError("ID error: failed to find data in cookie");
        }
      });
    } else {
      checkAccessToken();
    }
  }, []);

  const handleClick = () => {
    window.open(
      "https://discord.com/oauth2/authorize?client_id=1286517155315322950",
      "_blank",
      "noopener noreferrer"
    );
  };

  return (
    <div className="fixed transition ease-in-out inset-0 bg-gray-500 bg-opacity-70 dark:bg-gray-1200 dark:bg-opacity-70 dark:text-gray-100 flex justify-center items-center z-50">
      <AnimatedTabContent>
        <div className="text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-1100 p-6 rounded-lg w-96 border-blue-700 border-4 relative text-xl">
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

              {/* Error Message */}
              {error && <p className="text-red-500 pt-2">{error}</p>}
            </div>
          )}

          {/* Close button in the top-right corner */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-2xl text-blue-700 hover:text-blue-900"
          >
            &times;
          </button>
        </div>
      </AnimatedTabContent>
    </div>
  );
};

export default DiscordModal;
