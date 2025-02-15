import React, { useEffect, useState } from "react";
import AnimatedTabContent from "@/app/components/animations/AnimatedTab";
import { TabProps } from "./components/TabComponent";
import { sumFish } from "./components/utils";
import { FishRarity } from "@/app/types";
import { FaFilter } from "react-icons/fa";
const API_LINK = process.env.NEXT_PUBLIC_API_HTTP;

const RARITY_INDEX: { [key: number]: "VC" | "C" | "R" | "VR" | "ER" | "UR" } = {
  1: "VC",
  2: "VC",
  3: "VC",
  4: "C",
  5: "C",
  6: "R",
  7: "R",
  8: "VR",
  9: "ER",
  10: "UR",
};

const RARITY_COLORS = {
  VC: "green",
  C: "blue",
  R: "yellow",
  VR: "orange",
  ER: "red",
  UR: "purple",
};

const FISH_RARITY: { [key: string]: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 } = {
  "Balloon Fish": 1,
  "Hot Air Balloon Fish": 4,
  "Weather Balloon Fish": 5,
  "Water Balloon Fish": 3,
  "Red Balloon Fish": 2,
  "Cat Fish": 1,
  "Siamese Cat Fish": 9,
  "Alley Cat Fish": 4,
  "Tabby Cat Fish": 3,
  "Tom Cat Fish": 2,
  "Clown Fish": 1,
  "Sad Clown Fish": 4,
  "Party Clown Fish": 2,
  "Circus Clown Fish": 6,
  "Frozen Fish": 1,
  "Star Fish": 1,
  "Five Star Fish": 2,
  "Rock Star Fish": 5,
  "Shining Star Fish": 7,
  "All Star Fish": 10,
  "Holey Mackerel": 9,
  "Dog Fish": 1,
  "Bull Dog Fish": 6,
  "Hot Dog Fish": 5,
  "Dalmatian Dog Fish": 4,
  "Puppy Dog Fish": 2,
  "Amore Eel": 1,
  "Electric Amore Eel": 3,
  "Nurse Shark": 5,
  "Clara Nurse Shark": 7,
  "Florence Nurse Shark": 8,
  "King Crab": 3,
  "Alaskan King Crab": 7,
  "Old King Crab": 8,
  "Moon Fish": 1,
  "Full Moon Fish": 10,
  "Half Moon Fish": 8,
  "New Moon Fish": 3,
  "Crescent Moon Fish": 6,
  "Harvest Moon Fish": 4,
  "Sea Horse": 2,
  "Rocking Sea Horse": 3,
  "Clydesdale Sea Horse": 5,
  "Arabian Sea Horse": 7,
  "Pool Shark": 3,
  "Kiddie Pool Shark": 5,
  "Swimming Pool Shark": 6,
  "Olympic Pool Shark": 7,
  "Brown Bear Acuda": 2,
  "Black Bear Acuda": 3,
  "Koala Bear Acuda": 4,
  "Honey Bear Acuda": 5,
  "Polar Bear Acuda": 6,
  "Panda Bear Acuda": 7,
  "Kodiac Bear Acuda": 8,
  "Grizzly Bear Acuda": 10,
  "Cutthroat Trout": 2,
  "Captain Cutthroat Trout": 6,
  "Scurvy Cutthroat Trout": 7,
  "Piano Tuna": 5,
  "Grand Piano Tuna": 10,
  "Baby Grand Piano Tuna": 9,
  "Upright Piano Tuna": 6,
  "Player Piano Tuna": 7,
  "Peanut Butter & Jellyfish": 2,
  "Grape PB&J Fish": 3,
  "Crunchy PB&J Fish": 4,
  "Strawberry PB&J Fish": 5,
  "Concord Grape PB&J Fish": 10,
  "Devil Ray": 9,
};

const FishTab: React.FC<TabProps> = ({ toon }) => {
  const [rarity, setRarity] = useState<FishRarity[] | null>(null);
  const [caught, setCaught] = useState<string[]>([]);

  const [showCaught, setShowCaught] = useState<boolean>(() => {
    return JSON.parse(localStorage.getItem("showCaught") || "false");
  });

  const [bucketType, setBucketType] = useState<1 | 2>(() => {
    return JSON.parse(localStorage.getItem("bucketType") || "1");
  });

  const [showTime, setShowTime] = useState<boolean>(() => {
    return JSON.parse(localStorage.getItem("showTime") || "false");
  });

  const [showModal, setShowModal] = useState<boolean>(() => {
    return JSON.parse(localStorage.getItem("showModal") || "false");
  });

  useEffect(() => {
    localStorage.setItem("showCaught", JSON.stringify(showCaught));
  }, [showCaught]);

  useEffect(() => {
    localStorage.setItem("bucketType", JSON.stringify(bucketType));
  }, [bucketType]);

  useEffect(() => {
    localStorage.setItem("showTime", JSON.stringify(showTime));
  }, [showTime]);

  useEffect(() => {
    localStorage.setItem("showModal", JSON.stringify(showModal));
  }, [showModal]);

  const probabilityTooltip =
    bucketType === 2
      ? "The average toon will catch the fish in the amount of buckets listed."
      : "You have a 90% chance to catch the fish in the amount of buckets listed.";

  const getBuckets = (fish: FishRarity) => {
    console.log(fish.buckets);
    if (bucketType === 2) {
      return fish.buckets.avgBuckets;
    }
    return fish.buckets.confBuckets;
  };

  const getTime = (fish: FishRarity) => {
    if (bucketType === 2) {
      return processTime(fish.buckets.avgTime);
    }
    return processTime(fish.buckets.confTime);
  };

  const processTime = (time: number) => {
    if (time < 60) {
      return `${time} min`;
    } else {
      const hours = Math.ceil(time / 60);
      return `${hours} hrs`;
    }
  };

  useEffect(() => {
    const getFish = async () => {
      const response = await fetch(API_LINK + "/utility/get-fish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ toonData: toon.data }),
      });
      if (!response.ok) {
        return "Error loading fish data. Please try again later.";
      }
      const data = await response.json();
      setCaught(data.caught);
      setRarity(data.rarity);
    };

    getFish();
  }, [toon?.data]);

  const showModalHandler = () => {
    setShowModal(!showModal);
  };

  const handleBucketTypeChange = (value: 1 | 2) => {
    setBucketType(value);
  };

  const handleShowCaughtChange = (value: boolean) => {
    setShowCaught(value);
  };

  const handleShowTimeChange = (value: boolean) => {
    setShowTime(value);
  };

  return (
    <AnimatedTabContent>
      <div className="fish-container">
        <div className="fish-header">
          <div className="fish-item">
            <p>{sumFish(toon)} / 70 caught</p>
          </div>
          <div className="fish-item">{toon.data.data.fish.rod.name} Rod</div>
        </div>
        <div className="fish-table relative">
          <div className="flex text-xl md:text-2xl xl:text-3xl pb-2 ml-5 mr-9 space-x-2">
            <div className="fish-table-header">Fish</div>
            <div className="fish-table-header">Location</div>
            <div className="fish-table-header">
              Probability
              <div className="relative px-2 group">
                <span className="border-4 border-pink-900 dark:border-pink-100 rounded-full w-6 h-6 flex items-center justify-center text-base">
                  ?
                </span>
                <div className="hidden group-hover:block absolute text-base bg-white border border-gray-700 text-gray-900 p-2 transform -translate-x-[90%] ml-2 w-64 text-center">
                  {probabilityTooltip}
                </div>
              </div>
            </div>
            <button
              className="scale-up absolute right-2 h-8 w-8 bg-violet-800 rounded-full flex items-center justify-center"
              onClick={showModalHandler}
            >
              <FaFilter className="h-4 w-4 text-white" />
            </button>
          </div>

          {/* MODAL */}
          {showModal && (
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-900 rounded-md bg-opacity-60 flex justify-center items-center z-50 dark:text-gray-1000">
              <div className="absolute bg-gray-100 dark:bg-gray-200 border-4 border-gagblue p-6 rounded-lg shadow-lg">
                <div
                  className={`${
                    rarity && rarity.length > 0 ? "block" : "hidden"
                  }`}
                >
                  <div className="text-2xl font-semibold">Bucket Type</div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="bucketType"
                      id="confidentBuckets"
                      checked={bucketType === 1}
                      onChange={() => handleBucketTypeChange(1)}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <label
                      className="text-lg cursor-pointer hover:text-blue-600"
                      htmlFor="confidentBuckets"
                    >
                      Confident (90%)
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="bucketType"
                      id="avgBuckets"
                      checked={bucketType === 2}
                      onChange={() => handleBucketTypeChange(2)}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <label
                      className="text-lg cursor-pointer hover:text-blue-600"
                      htmlFor="avgBuckets"
                    >
                      Average
                    </label>
                  </div>
                </div>

                <div>
                  <div className="text-2xl font-semibold">Other</div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={showCaught}
                        id="caught"
                        onChange={(e) =>
                          handleShowCaughtChange(e.target.checked)
                        }
                        className="w-4 h-4 cursor-pointer"
                      />
                      <label
                        htmlFor="caught"
                        className="text-lg cursor-pointer hover:text-blue-600"
                      >
                        Show Caught Fish
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={showTime}
                        id="catchTime"
                        onChange={(e) => handleShowTimeChange(e.target.checked)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <label
                        htmlFor="catchTime"
                        className="text-lg cursor-pointer hover:text-blue-600"
                      >
                        Show Estimated Time to Catch
                      </label>
                    </div>
                  </div>
                </div>

                {/* Close button in the top-right corner */}
                <button
                  onClick={showModalHandler}
                  className="absolute -top-0 right-0 text-2xl text-blue-700 
            hover:text-blue-900 w-8 h-8 flex justify-center items-stretch"
                >
                  &times;
                </button>
              </div>
            </div>
          )}

          <div className="fishtank fish-scrollbar">
            {rarity && rarity.length > 0 ? (
              rarity.map((item, index) => {
                const itemRarity = RARITY_INDEX[FISH_RARITY[item.name]];
                const rarityColor = RARITY_COLORS[itemRarity];
                return (
                  <div className="fish" key={index}>
                    <div className="fish-info w-2/3 text-left gap-2">
                      <div
                        className={`flex items-center justify-center rounded-full w-8 text-base bg-${rarityColor}-500 dark:grayscale-[30%]`}
                      >
                        {itemRarity}
                      </div>

                      {item.name}
                    </div>

                    <div className="fish-info w-2/3 text-left">
                      {item.location}
                    </div>

                    <div className="fish-info w-2/3 text-left">
                      <span>
                        {(item.probability * 100).toFixed(2)}% or{" "}
                        {getBuckets(item)} buckets
                      </span>

                      {showTime && (
                        <span className="text-base ml-2">{`(${getTime(
                          item
                        )})`}</span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="fish">No new fish available to catch!</p>
            )}
            {showCaught &&
              caught &&
              caught.map((fish, index) => {
                const itemRarity = RARITY_INDEX[FISH_RARITY[fish]];
                const rarityColor = RARITY_COLORS[itemRarity];
                return (
                  <div className="fish uncaught-fish" key={index}>
                    <div className="flex justify-center items-center text-pink-900">
                      <div
                        className={`rounded-full w-8 text-base bg-${rarityColor}-500 opacity-60 dark:opacity-80 text-pink-800 dark:text-gray-1000 dark:grayscale-[30%]`}
                      >
                        {itemRarity}
                      </div>
                    </div>
                    <div className="fish-info w-2/3 text-left">{fish}</div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </AnimatedTabContent>
  );
};

export default FishTab;
