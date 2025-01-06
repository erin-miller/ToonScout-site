"use client";
import React, { useEffect } from "react";
import "./styles/fonts.css";
import GameSteps from "./components/GameSteps/GameSteps";
import Home from "./components/Home/Home";
import { initWebSocket } from "./api/LocalWebSocket";
import { initScoutWebSocket, sendScoutData } from "./api/ScoutWebSocket";
import { useConnectionContext } from "./context/ConnectionContext";
import { useDiscordContext } from "./context/DiscordContext";
import { useToonContext } from "./context/ToonContext";

const HomePage: React.FC = () => {
  const { isConnected, setIsConnected } = useConnectionContext();
  const { toonData, setToonData } = useToonContext();
  const { userId } = useDiscordContext();

  useEffect(() => {
    initScoutWebSocket();
    initWebSocket(setIsConnected, setToonData);
  }, []);

  useEffect(() => {
    const sendData = () => {
      if (userId && toonData) {
        sendScoutData(userId, toonData);
      }
    };
    sendData();
  }, [userId, toonData]);

  return (
    <div className="page-container">
      {/* Connecting Steps */}
      {!isConnected && <GameSteps />}

      {/* Home Screen */}
      {isConnected && toonData && <Home />}
    </div>
  );
};

export default HomePage;
