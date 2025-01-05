"use client";
import React, { useEffect } from "react";
import { useConnectionContext } from "./context/ConnectionContext";
import { initWebSocket } from "./api/LocalWebSocket";
import "./styles/fonts.css";
import GameSteps from "./components/GameSteps/GameSteps";
import Home from "./components/Home/Home";
import { initScoutWebSocket } from "./api/ScoutWebSocket";

const HomePage: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);
  const { setIsConnected, isConnected } = useConnectionContext();
  const { setToonData } = useToonContext();

  useEffect(() => {
    const checkAccessToken = async () => {
      const response = await fetch("https://api.scouttoon.info/get-token", {
        method: "GET",
        credentials: "include", // Cookies will be sent automatically
      });

      if (response.ok) {
        console.log("Token found.");
        const { userId } = await response.json();
        setIsAuth(true);
        initWebSocket(setIsConnected, setToonData, userId);
      } else {
        console.log("No token found.");
        // wait for user to click button...
      }
    };

    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get("access_token");
    // const accessToken = "1";

    if (accessToken) {
      handleOAuthToken(fragment).then((userId) => {
        setIsAuth(true);
        // userId = "2";
        if (userId) {
          initWebSocket(setIsConnected, setToonData, userId);
        } else {
          console.log("ID error");
        }
      });
    } else {
      checkAccessToken();
    }
  }, []);

  useEffect(() => {
    if (userId && toonData) {
      sendScoutData(userId, toonData);
    }
  }, [toonData, userId]);

  return (
    <div className="page-container">
      {/* Connecting Steps */}
      {!isConnected && <GameSteps />}

      {/* Home Screen */}
      {isConnected && <Home />}
    </div>
  );
};

export default HomePage;
