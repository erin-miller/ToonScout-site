import React from "react";
import LoadingDots from "@/app/components/animations/LoadingDots";
import "/styles/gamesteps.css";
import ThemeToggle from "@/app/components/Theme";

const GameSteps: React.FC = () => (
  <div className="flex max-w-7xl mx-auto">
    <div className="connect-container">
      <div className="relative flex flex-row justify-center items-center w-full">
        <LoadingDots
          className="minnie-title text-4xl pb-4 w-full text-center"
          text="Connecting to Toontown Rewritten"
        />
        <div className="absolute right-0 pb-5">
          <ThemeToggle />
        </div>
      </div>
      <div className="step-container">
        <Step
          title="1. Enable Companion App Support"
          image="/images/gameplay-menu.png"
        />
        <Step
          title="2. Click 'OK' on in-game popup and select a toon"
          image="/images/prompt.png"
        />
      </div>
    </div>
  </div>
);

const Step: React.FC<{ title: string; image: string }> = ({ title, image }) => (
  <div className="step-card">
    <h2 className="step-name">{title}</h2>
    <img src={image} alt={title} className="mx-auto" />
  </div>
);

export default GameSteps;
