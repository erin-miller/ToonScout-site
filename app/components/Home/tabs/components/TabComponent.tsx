import {
  InfoTab,
  FishTab,
  SuitTab,
  GagsTab,
  TasksTab,
  ActivityTab,
} from "./TabList";
import "/styles/tabs.css";
import { useState } from "react";
import { useToonContext } from "@/app/context/ToonContext";
import { StoredToonData } from "@/app/types";
import { hasNoSuit } from "./utils";

export interface TabProps {
  toon: StoredToonData;
  setSelectedTab?: React.Dispatch<React.SetStateAction<TabComponent>>;
}

export type TabComponent = {
  title: string;
  component: React.FC<{ toon: StoredToonData }>;
  disabled?: boolean;
  tooltip?: string;
};

const TabContainer = () => {
  const { activeIndex, toons } = useToonContext();

  const toon = toons[activeIndex];

  if (!toon) {
    return "No toon data found. Please try refreshing the page.";
  }

  const TabList: TabComponent[] = [
    {
      title: "Overview",
      component: (props) => (
        <InfoTab {...props} setSelectedTab={setSelectedTab} />
      ),
    },
    {
      title: "Fishing",
      component: FishTab,
      tooltip:
        "Percentages and buckets are estimates and should not be taken literally. Toontown Rewritten has not disclosed their actual fishing odds.",
    },
    {
      title: "Suits",
      component: SuitTab,
      disabled: hasNoSuit(toon),
      tooltip:
        "Promotion recommendations are weighted by merit return and time. The time is determined by the average group find time at peak hours and length of the facility.",
    },
    { title: "Gags", component: GagsTab },
    {
      title: "Tasks",
      component: TasksTab,
      disabled: toons[activeIndex].data.data.tasks.length <= 0,
    },
    { title: "Activities", component: ActivityTab },
  ];

  const [selectedTab, setSelectedTab] = useState<TabComponent>(TabList[0]); // Default to "Overview"
  const [pose, setPose] = useState<string>("waving");

  if (selectedTab.title == "Suits" && hasNoSuit(toon)) {
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
    const dna = toon.data.data.toon.style;
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
    <div>
      {/* list of tabs */}
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

      {/* tab display */}
      {selectedTab && (
        <div className="info-container relative">
          <div className="left-info-container">
            <div>
              <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl bg-pink-900 text-gray-100 dark:text-white dark:bg-pink-900 rounded-lg py-1 break-words overflow-hidden">
                {toon.data.data.toon.name}
              </p>
              <p className="text-lg md:text-xl lg:text-2xl pt-1">
                {toon.data.data.laff.current} / {toon.data.data.laff.max} laff
              </p>
              <p className="text-md md:text-xl lg:text-2xl">
                {toon.data.data.location.zone},{" "}
                {toon.data.data.location.district}
              </p>
            </div>
            <div className="toon-photo">
              <img
                src={getImage()}
                alt={`${toon.data.data.toon.name} in pose ${pose}`}
                className="w-512 h-512"
                onClick={handleImageClick}
              />
            </div>
          </div>

          <div className="right-info-container">
            <selectedTab.component toon={toon} />
          </div>

          {selectedTab.tooltip && (
            <div className="hidden md:block absolute group bottom-0 right-0 px-2 bg-pink-700 dark:bg-blue-900 rounded-tl-xl border-t-4 border-l-4 border-pink-500 dark:border-blue-600">
              <span className="relative text-2xl text-white">?</span>
              <div className="absolute hidden group-hover:block bg-white border border-gray-700 text-gray-900 p-2 left-0 bottom-full transform -translate-x-[90%] w-64">
                {selectedTab.tooltip}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TabContainer;
