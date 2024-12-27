import InfoTab from "../tabs/InfoTab";
import FishTab from "../tabs/FishTab";
import SuitTab from "../tabs/SuitTab";
import GagsTab from "../tabs/GagsTab";
import TasksTab from "../tabs/TasksTab";
import CommandTab from "../tabs/CommandTab";
import ActivityTab from "../tabs/ActivityTab";
import { useState } from "react";
import { useToonContext } from "../../context/ToonContext";
import AnimatedTabContent from "../animations/AnimatedTab";
import "../../styles/tabs.css";
import { ToonData } from "@/app/types";
import { hasNoSuit } from "./utils";

export interface TabProps {
  toonData: ToonData;
}

export type TabComponent = {
  title: string;
  component: React.FC<{ toonData: ToonData }>;
  disabled?: boolean;
};

const TabContainer = () => {
  const { toonData } = useToonContext();

  if (!toonData) {
    return "No toon data found. Please try refreshing the page.";
  }

  const TabList: TabComponent[] = [
    { title: "Commands", component: CommandTab },
    { title: "Overview", component: InfoTab },
    { title: "Fishing", component: FishTab },
    { title: "Suits", component: SuitTab, disabled: hasNoSuit(toonData) },
    { title: "Gags", component: GagsTab, disabled: true },
    { title: "Tasks", component: TasksTab, disabled: true },
    { title: "Activities", component: ActivityTab, disabled: true },
  ];

  const [selectedTab, setSelectedTab] = useState<TabComponent>(TabList[1]); // Default to "Overview"
  const [pose, setPose] = useState<string>("waving");

  if (selectedTab.title == "Suits" && hasNoSuit(toonData)) {
    setSelectedTab(TabList[1]);
  }

  const poses = [
    "head",
    "portrait-sleep",
    "portrait-delighted",
    "portrait-surprise",
    "portrait-thinking",
    "portrait-birthday",
    "portrait-fall",
    "portrait-grin",
    "cake-topper",
    "crying",
    "waving",
  ];

  const getImage = () => {
    const dna = toonData.toon.style;
    return `https://rendition.toontownrewritten.com/render/${dna}/${pose}/1024x1024.png`;
  };

  const handleTabChange = (tab: TabComponent) => {
    setSelectedTab(tab);
  };

  const handleImageClick = () => {
    const curr = poses.indexOf(pose);
    const next = (curr + 1) % poses.length;
    setPose(poses[next]);
  };

  return (
    <>
      <div className="tab-container">
        {TabList.map((tab) => (
          <button
            key={tab.title}
            className="tab-btn"
            aria-selected={selectedTab.title == tab.title ? true : false}
            onClick={() => handleTabChange(tab)}
            disabled={tab.disabled}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {selectedTab && selectedTab.title !== "Commands" ? (
        <AnimatedTabContent>
          <div className="info-container">
            <div className="left-info-container">
              <div>
                <p className="text-3xl bg-violet-600 text-white rounded-lg py-1">
                  {toonData.toon.name}
                </p>
                <p className="text-2xl pt-1">
                  {toonData.laff.current} / {toonData.laff.max} laff
                </p>
                <p className="text-xl">
                  {toonData.location.zone}, {toonData.location.district}
                </p>
              </div>
              <div className="toon-photo">
                <img
                  src={getImage()}
                  alt={`${toonData.toon.name} in pose ${pose}`}
                  className="w-512 h-512"
                  onClick={handleImageClick}
                />
              </div>
            </div>

            <div className="right-info-container">
              <selectedTab.component toonData={toonData} />
            </div>
          </div>
        </AnimatedTabContent>
      ) : (
        <selectedTab.component toonData={toonData} />
      )}
    </>
  );
};

export default TabContainer;
