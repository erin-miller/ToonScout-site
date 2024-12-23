import React, { useState } from "react";

const generateRandomString = (length = 16) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};

export const initOAuth = () => {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const uri = "https://scouttoon.info/";
  const redirectUri = encodeURIComponent(uri);
  const scope = encodeURIComponent("identify");

  const randomState = generateRandomString();
  localStorage.setItem("oauth-state", randomState);

  const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scope}&state=${btoa(
    randomState
  )}`;

  // Redirect to Discord authorization URL
  window.location.href = url;
};

const Auth = () => {
  const clickedImg = "/images/button-clicked.png";
  const unclickedImg = "/images/button-unclicked.png";

  const [isPressed, setIsPressed] = useState(false);
  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <div className="flex w-full items-center justify-center">
      <div className="discord-card">
        <h2 className="minnie-title">Connect to Discord</h2>
        <p className="text-xl">
          ToonScout needs a Discord connection to function.
        </p>
        <p className="text-xl">Click the button below to begin!</p>
        <button
          id="login"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onClick={initOAuth}
          className="relative flex justify-center items-center w-16 h-16 mx-auto"
          style={{
            backgroundImage: `url(${isPressed ? clickedImg : unclickedImg})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            cursor: "pointer",
          }}
        ></button>
      </div>
    </div>
  );
};

export default Auth;
