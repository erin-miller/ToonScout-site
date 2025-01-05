"use client";
import React, { useEffect, useState } from "react";
import { handleOAuthToken } from "./api/DiscordOAuth";
import { useToonContext } from "./context/ToonContext";
import { useConnectionContext } from "./context/ConnectionContext";
import { initWebSocket } from "./api/LocalWebSocket";
import "./styles/fonts.css";
import GameSteps from "./components/GameSteps/GameSteps";
import Home from "./components/Home/Home";

const HomePage: React.FC = () => {
  const { setIsConnected, isConnected } = useConnectionContext();
  const { setToonData } = useToonContext();

  useEffect(() => {
    initWebSocket(setIsConnected, setToonData);
  }, []);

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
