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
import { ToonData } from "@/app/types";
import { hasNoSuit } from "./utils";

export interface TabProps {
  toon: ToonData;
  setSelectedTab?: React.Dispatch<React.SetStateAction<TabComponent>>;
}

export type TabComponent = {
  title: string;
  component: React.FC<{ toon: ToonData }>;
  disabled?: boolean;
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
    { title: "Fishing", component: FishTab },
    {
      title: "Suits",
      component: SuitTab,
      disabled: hasNoSuit(toon),
    },
    { title: "Gags", component: GagsTab },
    {
      title: "Tasks",
      component: TasksTab,
      disabled: toons[activeIndex].data.tasks.length <= 0,
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
    const dna = toon.data.toon.style;
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

      {selectedTab && (
        <div className="info-container">
          <div className="left-info-container">
            <div>
              <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl bg-pink-900 text-gray-100 dark:text-white dark:bg-pink-900 rounded-lg py-1 break-words overflow-hidden">
                {toon.data.toon.name}
              </p>
              <p className="text-lg md:text-xl lg:text-2xl pt-1">
                {toon.data.laff.current} / {toon.data.laff.max} laff
              </p>
              <p className="text-md md:text-xl lg:text-2xl">
                {toon.data.location.zone}, {toon.data.location.district}
              </p>
            </div>
            <div className="toon-photo">
              <img
                src={getImage()}
                alt={`${toon.data.toon.name} in pose ${pose}`}
                className="w-512 h-512"
                onClick={handleImageClick}
              />
            </div>
          </div>

          <div className="right-info-container">
            <selectedTab.component toon={toon} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TabContainer;
