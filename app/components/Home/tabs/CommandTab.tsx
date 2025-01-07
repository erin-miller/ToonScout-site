import React from "react";
import CommandBox from "./components/CommandBox";
import AnimatedTabContent from "@/app/components/animations/AnimatedTab";
import "/styles/tabs.css";

const commands = [
  {
    title: "/info",
    description: "Displays your toon photo, laff, and location.",
    color: "blue-400",
  },
  {
    title: "/fish",
    description: "Find the best place to catch new fish.",
    color: "blue-500 dark:blue-300",
  },
  {
    title: "/suit",
    description: "Get suit progress and recommendations.",
    color: "blue-600 dark:blue-200",
  },
  {
    title: "/gags",
    description: "Displays current gags and progress.",
    color: "blue-700 dark:blue-100",
  },
  {
    title: "/tasks",
    description: "Lists your active toontasks and progress.",
    color: "pink-400 dark:pink-100",
  },
  {
    title: "/race",
    description: "Provides advising on racing trophies.",
    color: "pink-500 dark:pink-200",
  },
  {
    title: "/golf",
    description: "Provides advising on golfing trophies.",
    color: "pink-300",
  },
  {
    title: "/hidden",
    description: "Set if your info can be viewed by others.",
    color: "pink-400",
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
