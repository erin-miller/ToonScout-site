"use client";
import React, { useEffect } from "react";
import "./styles/fonts.css";
import GameSteps from "./components/GameSteps/GameSteps";
import Home from "./components/Home/Home";
import { initWebSocket } from "./api/LocalWebSocket";
<<<<<<< HEAD
import { initScoutWebSocket } from "./api/ScoutWebSocket";
=======
import { initScoutWebSocket, sendScoutData } from "./api/ScoutWebSocket";
>>>>>>> b545765f286c77b934e79fd71ad662e144f8c188
import { useConnectionContext } from "./context/ConnectionContext";
import { useDiscordContext } from "./context/DiscordContext";
import { useToonContext } from "./context/ToonContext";

const HomePage: React.FC = () => {
  const { isConnected, setIsConnected } = useConnectionContext();
<<<<<<< HEAD
  const { setToonData } = useToonContext();
=======
  const { toonData, setToonData } = useToonContext();
>>>>>>> b545765f286c77b934e79fd71ad662e144f8c188
  const { userId } = useDiscordContext();

  useEffect(() => {
    initScoutWebSocket();
    initWebSocket(setIsConnected, setToonData, userId);
  }, []);

<<<<<<< HEAD
=======
  useEffect(() => {
    const sendData = () => {
      if (userId && toonData) {
	sendScoutData(userId, toonData); // Await the async call
      } 
     };
     sendData();
  }, [userId, toonData]);

>>>>>>> b545765f286c77b934e79fd71ad662e144f8c188
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
