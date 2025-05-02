import React from "react";
import AnimatedTabContent from "@/app/components/animations/AnimatedTab";
import { TabProps } from "./components/TabComponent";

const GardenTab: React.FC<TabProps> = ({ toon }) => {
  return (
    <AnimatedTabContent>
      <div></div>
    </AnimatedTabContent>
  );
};

export default GardenTab;
