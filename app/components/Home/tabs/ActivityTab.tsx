import React from "react";
import { TabProps } from "./components/TabComponent";
import AnimatedTabContent from "../../animations/AnimatedTab";
import { golf_trophies } from "@/data/golf_trophies";
import { race_trophies } from "@/data/race_trophies";
import { sumGolf, sumRace } from "./components/utils";

const ActivityTab: React.FC<TabProps> = ({ toonData }) => {
  const trophyIcon = (earned: number) => {
    const total = 3;
    return (
      <div className="flex space-x-2">
        {Array.from({ length: total }).map((_, index) => (
          <svg
            fill="currentColor"
            className={`w-10 h-10 ${
              index < earned
                ? "text-blue-900 dark:text-pink-400"
                : "text-blue-300 dark:text-gray-900"
            }`}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M22,3H19V2a1,1,0,0,0-1-1H6A1,1,0,0,0,5,2V3H2A1,1,0,0,0,1,4V6a4.994,4.994,0,0,0,4.276,4.927A7.009,7.009,0,0,0,11,15.92V18H7a1,1,0,0,0-.949.684l-1,3A1,1,0,0,0,6,23H18a1,1,0,0,0,.948-1.316l-1-3A1,1,0,0,0,17,18H13V15.92a7.009,7.009,0,0,0,5.724-4.993A4.994,4.994,0,0,0,23,6V4A1,1,0,0,0,22,3ZM5,8.829A3.006,3.006,0,0,1,3,6V5H5ZM16.279,20l.333,1H7.387l.334-1ZM17,9A5,5,0,0,1,7,9V3H17Zm4-3a3.006,3.006,0,0,1-2,2.829V5h2ZM10.667,8.667,9,7.292,11,7l1-2,1,2,2,.292L13.333,8.667,13.854,11,12,9.667,10.146,11Z" />
          </svg>
        ))}
      </div>
    );
  };

  const renderStats = (
    data: { name: string; num: number }[],
    trophyData: typeof golf_trophies | typeof race_trophies
  ) => {
    return (
      <ul className="space-y-2">
        {data.map((item, index) => {
          const trophy = trophyData.find(
            (trophy) => trophy.description === item.name
          );

          let curr = item.num.toString();
          let progress = 100;
          if (trophy) {
            const target = trophy.values.find((value) => item.num < value);

            if (target) {
              curr = `${item.num} / ${target}`;
              progress = Math.min((item.num / target) * 100, 100);
            }
          }

          return (
            <li key={index} className="trophies relative z-5">
              <div
                className="bg-blue-900 dark:bg-gray-1200 absolute inset-0 opacity-15 z-0"
                style={{ width: `${progress}%` }}
              ></div>
              <div className="text-xl w-full text-left z-50">{item.name}</div>
              <div
                className="flex z-50 w-36 text-nowrap justify-center items-center  rounded-full
              text-gray-100 dark:text-gray-400 bg-blue-800 dark:bg-pink-900"
              >
                {curr}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <AnimatedTabContent>
      <div className="flex flex-row space-x-2">
        <div className="activity-container">
          <div className="activity-header-container">
            <h2 className="activity-header activity-name">Racing</h2>
            <p className="activity-header trophy-total">
              {trophyIcon(sumRace(toonData))}
            </p>
          </div>
          {toonData.data.racing ? (
            renderStats(toonData.data.racing, race_trophies)
          ) : (
            <p>No racing data found.</p>
          )}
        </div>

        <div className="activity-container">
          <div className="activity-header-container">
            <h2 className="activity-header activity-name">Golf</h2>
            <p className="activity-header trophy-total">
              {trophyIcon(sumGolf(toonData))}
            </p>
          </div>
          {toonData.data.golf ? (
            renderStats(toonData.data.golf, golf_trophies)
          ) : (
            <p>No golf data found.</p>
          )}
        </div>
      </div>
    </AnimatedTabContent>
  );
};

export default ActivityTab;
