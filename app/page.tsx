"use client";
import React, { useEffect } from "react";
import { useConnectionContext } from "./context/ConnectionContext";
import { initWebSocket } from "./api/LocalWebSocket";
import "./styles/fonts.css";
import GameSteps from "./components/GameSteps/GameSteps";
import Home from "./components/Home/Home";
import { initScoutWebSocket } from "./api/ScoutWebSocket";

const HomePage: React.FC = () => {
  const { isConnected } = useConnectionContext();

  useEffect(() => {
    initScoutWebSocket();
    initWebSocket();
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
