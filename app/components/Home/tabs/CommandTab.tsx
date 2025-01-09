import React from "react";
import CommandBox from "./components/CommandBox";
import AnimatedTabContent from "@/app/components/animations/AnimatedTab";
import "/styles/tabs.css";

const commands = [
  {
    title: "/info",
    description: "Displays your toon photo, laff, and location.",
    color: "toon-up",
  },
  {
    title: "/fish",
    description: "Find the best place to catch new fish.",
    color: "yellow-400",
  },
  {
    title: "/suit",
    description: "Get suit progress and recommendations.",
    color: "lure",
  },
  {
    title: "/gags",
    description: "Displays current gags and progress.",
    color: "sound",
  },
  {
    title: "/tasks",
    description: "Lists your active toontasks and progress.",
    color: "throw",
  },
  {
    title: "/race",
    description: "Provides advising on racing trophies.",
    color: "squirt",
  },
  {
    title: "/golf",
    description: "Provides advising on golfing trophies.",
    color: "drop",
  },
  {
    title: "/hidden",
    description: "Set if your info can be viewed by others.",
    color: "blue-400",
  },
  {
    title: "...and more!",
    description: "You can see all other commands in Discord!",
    color: "pink-500",
  },
];

const CommandTab: React.FC = () => {
  return (
    <AnimatedTabContent>
      <span className="text-block p-2">
        Run the commands below <strong>anywhere</strong> in Discord after adding
        with the button above!
      </span>
      <div className="cmd-container">
        {commands.map((command) => (
          <CommandBox key={command.title} command={command} />
        ))}
      </div>
    </AnimatedTabContent>
  );
};

export default CommandTab;
