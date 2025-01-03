"use client";
import React, { useEffect, useState } from "react";
import { handleOAuthToken } from "./api/oauth";
import { useToonContext } from "./context/ToonContext";
import { useConnectionContext } from "./context/ConnectionContext";
import { initWebSocket } from "./api/websocket";
import "./styles/fonts.css";
import Auth from "./components/Auth";
import GameSteps from "./components/GameSteps";
import Home from "./components/Home/Home";

const HomePage: React.FC = () => {
  const [isAuth, setIsAuth] = useState(true);
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
    // const accessToken = fragment.get("access_token");
    const accessToken = "1";

    if (accessToken) {
      handleOAuthToken(fragment).then((userId) => {
        setIsAuth(true);
        userId = "2";
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

  return (
    <div className="page-container">
      {/* Authentication */}
      {!isAuth && <Auth />}

      {/* Connecting Steps */}
      {isAuth && !isConnected && <GameSteps />}

      {/* Home Screen */}
      {isAuth && isConnected && <Home />}
    </div>
  );
};

export default HomePage;
