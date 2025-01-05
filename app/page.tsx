"use client";
import React, { useEffect } from "react";
import { useToonContext } from "./context/ToonContext";
import { useConnectionContext } from "./context/ConnectionContext";
import { initWebSocket } from "./api/LocalWebSocket";
import "./styles/fonts.css";
import GameSteps from "./components/GameSteps/GameSteps";
import Home from "./components/Home/Home";
import { initScoutWebSocket, sendScoutData } from "./api/ScoutWebSocket";
import { useDiscordContext } from "./context/DiscordContext";

const HomePage: React.FC = () => {
  const { setIsConnected, isConnected } = useConnectionContext();
  const { toonData, setToonData } = useToonContext();
  const { userId } = useDiscordContext();

  useEffect(() => {
    initScoutWebSocket();
    initWebSocket(setIsConnected, setToonData);
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
