import React from "react";
import LoadingDots from "./LoadingDots";

const GameSteps: React.FC = () => (
  <div className="flex max-w-7xl mx-auto">
    <div className="bg-white p-6 md:p-10 rounded-lg shadow-lg text-center border border-gray-300 space-y-6 md:space-y-5 mt-10">
      <LoadingDots
        className="text-3xl font-semibold font-minnie text-gray-800 mb-4"
        text="Connecting to Toontown Rewritten"
      />
      <div className="flex justify-center space-x-8">
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
  <div className="bg-gray-100 p-6 rounded-lg shadow-md border border-gray-300 max-w-xl">
    <h2 className="text-2xl font-semibold font-minnie text-gray-800 mb-4">
      {title}
    </h2>
    <img src={image} alt={title} className="mx-auto" />
  </div>
);

export default GameSteps;
