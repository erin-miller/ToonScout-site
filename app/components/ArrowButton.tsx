import { useState } from "react";

const ArrowButton = ({ onClick }: { onClick: () => void }) => {
  const clickedImg = "/images/button-clicked.png";
  const unclickedImg = "/images/button-unclicked.png";
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      onMouseDown={() => {
        setIsPressed(true);
      }}
      onMouseUp={() => {
        setIsPressed(false);
      }}
      onMouseLeave={() => {
        setIsPressed(false);
      }}
      onClick={onClick}
      className="discord-btn"
      style={{
        backgroundImage: `url(${isPressed ? clickedImg : unclickedImg})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        cursor: "pointer",
      }}
    ></button>
  );
};

export default ArrowButton;
