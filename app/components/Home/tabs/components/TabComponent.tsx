import {
  InfoTab,
  FishTab,
  SuitTab,
  GagsTab,
  TasksTab,
  CommandTab,
  ActivityTab,
} from "./TabList";
import AnimatedTabContent from "@/app/components/animations/AnimatedTab";
import "/styles/tabs.css";
import { useState } from "react";
import { useToonContext } from "@/app/context/ToonContext";
import { ToonData } from "@/app/types";
import { hasNoSuit } from "./utils";

export interface TabProps {
  toons: ToonData;
  setSelectedTab?: React.Dispatch<React.SetStateAction<TabComponent>>;
}

export type TabComponent = {
  title: string;
  component: React.FC<{ toons: ToonData }>;
  disabled?: boolean;
};

const TabContainer = () => {
  const { activeIndex, toons } = useToonContext();
  toons.forEach((toon, index) =>
    console.log(`${index + 1}. ${toon?.data.toon.id}`)
  );
  console.log("active:" + toons[activeIndex]?.data.toon.name);
  if (!activeIndex) {
    return "No toon data found. Please try refreshing the page.";
  }

  const TabList: TabComponent[] = [
    { title: "Commands", component: CommandTab },
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
      disabled: hasNoSuit(toons[activeIndex]),
    },
    { title: "Gags", component: GagsTab },
    {
      title: "Tasks",
      component: TasksTab,
      disabled: toons[activeIndex].data.tasks.length <= 0,
    },
    { title: "Activities", component: ActivityTab },
  ];

  const [selectedTab, setSelectedTab] = useState<TabComponent>(TabList[1]); // Default to "Overview"
  const [pose, setPose] = useState<string>("waving");

  if (selectedTab.title == "Suits" && hasNoSuit(toons[activeIndex])) {
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
    const dna = toons[activeIndex]?.data.toon.style;
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
                <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl bg-pink-900 text-gray-100 dark:text-blue-100 dark:bg-pink-900 rounded-lg py-1 break-words overflow-hidden">
                  {toons[activeIndex].data.toon.name}
                </p>
                <p className="text-lg md:text-xl lg:text-2xl pt-1">
                  {toons[activeIndex].data.laff.current} /{" "}
                  {toons[activeIndex].data.laff.max} laff
                </p>
                <p className="text-md md:text-xl lg:text-2xl">
                  {toons[activeIndex].data.location.zone},{" "}
                  {toons[activeIndex].data.location.district}
                </p>
              </div>
              <div className="toon-photo">
                <img
                  src={getImage()}
                  alt={`${toons[activeIndex].data.toon.name} in pose ${pose}`}
                  className="w-512 h-512"
                  onClick={handleImageClick}
                />
              </div>
            </div>

            <div className="right-info-container">
              <selectedTab.component toons={toons[activeIndex]} />
            </div>
          </div>
        </AnimatedTabContent>
      ) : (
        <selectedTab.component toons={toons[activeIndex]} />
      )}
    </>
  );
};

export default TabContainer;
