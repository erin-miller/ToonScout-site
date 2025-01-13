"use client";
import React, { useEffect } from "react";
import "/styles/fonts.css";
import GameSteps from "./components/GameSteps/GameSteps";
import Home from "./components/Home/Home";
import { initWebSocket } from "./api/LocalWebSocket";
import { initScoutWebSocket, sendScoutData } from "./api/ScoutWebSocket";
import { useConnectionContext } from "./context/ConnectionContext";
import { useDiscordContext } from "./context/DiscordContext";
import { useToonContext } from "./context/ToonContext";
import { isMobile, isSafari } from "react-device-detect";
import Incompatible from "./components/Incompatible";

const HomePage: React.FC = () => {
  const { setIsConnected } = useConnectionContext();
  const { toonData, setToonData } = useToonContext();
  const { userId } = useDiscordContext();

  useEffect(() => {
    initScoutWebSocket();
    initWebSocket(setIsConnected, setToonData);

    const existingToon = localStorage.getItem("toonData");
    if (existingToon) {
      try {
        const storedData = JSON.parse(existingToon);
        const { data } = storedData;
        setToonData(data);
      } catch (error) {
        console.error("Error parsing existing toon data.");
      }
    }
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
      {isMobile || isSafari ? (
        <Incompatible />
      ) : toonData ? (
        <Home />
      ) : (
        <GameSteps />
      )}
    </div>
  );
};

export default HomePage;
