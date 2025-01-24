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
  const { activeIndex, setActiveIndex, toons, addToon } = useToonContext();
  const { userId } = useDiscordContext();

  useEffect(() => {
    initScoutWebSocket();
    initWebSocket(setIsConnected, addToon);

    const existingToon = localStorage.getItem("toonData");
    if (existingToon) {
      try {
        const storedData = JSON.parse(existingToon);
        const { data } = storedData;
        addToon(data);
        setActiveIndex(0);
      } catch (error) {
        console.error("Error parsing existing toon data.");
      }
    }

    console.log(`toons: ${toons}`);
    if (toons.length > 0) {
      setIsConnected(true);
    }
  }, []);

  useEffect(() => {
    const sendData = () => {
      if (userId && activeIndex) {
        sendScoutData(userId, toons[activeIndex]);
      }
    };
    sendData();
  }, [userId, activeIndex]);

  return (
    <div className="page-container">
      {isMobile || isSafari ? (
        <Incompatible />
      ) : toons && toons.length > 0 ? (
        <Home />
      ) : (
        <GameSteps />
      )}
    </div>
  );
};

export default HomePage;
