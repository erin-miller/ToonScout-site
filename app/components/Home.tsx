import React from "react";
import CommandBox from "./CommandBox";
import Disclaimer from "./Disclaimer";

const commands = [
  {
    title: "/info",
    description: "Displays your toon photo, laff, and location.",
    color: "#4A90E2",
  },
  {
    title: "/fish",
    description: "Provides advising on where to fish or what to catch.",
    color: "#4c7fe2",
  },
  {
    title: "/suit",
    description: "Get suit progress and recommendations.",
    color: "#4d6de2",
  },
  {
    title: "/gags",
    description: "Displays current gags and progress.",
    color: "#504AE2",
  },
  {
    title: "/tasks",
    description: "Lists your active toontasks and progress.",
    color: "#764AE2",
  },
  {
    title: "/race",
    description: "Provides advising on racing trophies.",
    color: "#9C4AE2",
  },
  {
    title: "/golf",
    description: "Provides advising on golfing trophies.",
    color: "#BF4ADF",
  },
  {
    title: "/hidden",
    description: "Set if your info can be viewed by others.",
    color: "#E24ADC",
  },
  {
    title: "...and more!",
    description: "You can see all other commands in Discord!",
    color: "#E24AB6",
  },
];

const Home = () => {
  return (
    <div className="flex-1 w-full max-w-6xl mx-auto">
      <div className="home-card">
        <h2 className="text-4xl minnie-title">Welcome to ToonScout!</h2>
        <p className="text-xl text-gray-600 font-impress">
          <a
            href="https://discord.com/oauth2/authorize?client_id=1286517155315322950"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="py-1 px-3 bg-indigo-400 text-white border-none rounded-full cursor-pointer">
              Add ToonScout on Discord
            </button>
          </a>
          <br />
          <br />
          This page needs to stay in the background to continue receiving
          real-time information.
          <br />
          If you close it, you can still access your last saved data any time.
          <br />
          <br />
          Run the commands below <strong>anywhere</strong> in Discord after
          adding with the button above!
        </p>

        {/* Commands Container */}
        <div className="grid grid-cols-1 sm: grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
          {commands.map((command) => (
            <CommandBox key={command.title} command={command} />
          ))}
        </div>

        {/* Disclaimer */}
        <Disclaimer />
      </div>
    </div>
  );
};

export default Home;
