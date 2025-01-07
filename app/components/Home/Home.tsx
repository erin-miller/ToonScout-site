import React, { useEffect, useState } from "react";
import Disclaimer from "./Disclaimer";
import TabContainer from "./tabs/TabContainer/TabComponent";
import "/styles/home.css";
import ThemeToggle from "@/app/components/Theme";
import DiscordModal from "./modals/DiscordModal";
import { useDiscordContext } from "@/app/context/DiscordContext";
import { handleOAuthToken } from "@/app/api/DiscordOAuth";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userId, setUserId } = useDiscordContext();

  const onClose = () => {
    setIsOpen(false);
  };

  const handleDiscordClick = () => {
    setIsOpen(!isOpen);
  };

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
          setUserId(userId); // Set userId from the response
        } else {
          console.log("No user ID found.");
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
          setUserId(userId);
        } else {
          console.log("ID error: failed to find data in cookie");
        }
      });
    } else {
      checkAccessToken();
    }
  }, []);

  return (
    <div className="card-container">
      <div className="home-card">
        <div className="relative flex flex-col md:flex-row justify-center items-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl minnie-title dark:text-gray-100 w-full text-center">
            Welcome to ToonScout!
          </h2>
          <div className="relative md:absolute right-0 space-x-2 text-white dark: text-blue-900">
            <button className="home-btn" onClick={handleDiscordClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 127.14 96.36"
                className="w-4 h-4 md:w-8 md:h-8"
                fill="currentColor"
              >
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
              </svg>
              {userId && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  className="w-5 h-5 absolute top-5 right-2 translate-x-3 translate-y-3 text-gray-100 bg-green-800 dark:bg-green-600 dark:text-gray-200 rounded-full"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.293 5.293a1 1 0 011.414 1.414l-9 9a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <ThemeToggle />
          </div>
          {isOpen && <DiscordModal isOpen={isOpen} onClose={onClose} />}
        </div>
        <p>
          <span className="text-block">
            This page needs to stay in the background to continue receiving
            real-time information.
          </span>
          <span className="text-block">
            If you close it, you can still access your last saved data any time
            on Discord.
          </span>
        </p>

        <TabContainer />

        <Disclaimer />
      </div>
    </div>
  );
};

export default Home;
