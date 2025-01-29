import React, { useEffect, useState } from "react";
import AnimatedTabContent from "@/app/components/animations/AnimatedTab";
import { TabProps } from "./components/TabComponent";
import { sumFish } from "./components/utils";
import { FishRarity } from "@/app/types";
const API_LINK = process.env.NEXT_PUBLIC_API_HTTP;

const FishTab: React.FC<TabProps> = ({ toon }) => {
  const [fish, setFish] = useState<FishRarity[] | null>(null);
  const probabilityTooltip =
    "You have a 90% chance to catch the fish in the amount of buckets listed.";

  const getBuckets = (fish: FishRarity) => {
    const confidence = 1 - 0.9;
    const bucketCapacity = 20;
    const catchProb = fish.probability;
    const missProb = 1 - catchProb;

    const attempts = Math.log(confidence) / Math.log(missProb);
    return Math.ceil(attempts / bucketCapacity);
  };

  useEffect(() => {
    const getFish = async () => {
      const response = await fetch(API_LINK + "/get-fish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ toonData: toon }),
      });
      if (!response.ok) {
        return "Error loading fish data. Please try again later.";
      }
      const data = await response.json();
      setFish(data);
    };

    getFish();
  }, [toon]);

  return (
    <AnimatedTabContent>
      <div className="fish-container">
        <div className="fish-header">
          <div className="fish-item">
            <p>{sumFish(toon)} / 70 caught</p>
          </div>
          <div className="fish-item">{toon.data.fish.rod.name} Rod</div>
        </div>
        <div className="fish-table">
          <div className="flex text-xl md:text-2xl xl:text-3xl pb-2 ml-5 mr-9 space-x-2">
            <div className="fish-table-header">Uncaught Fish</div>
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
          </div>

          <div className="fishtank fish-scrollbar">
            {fish && fish.length > 0 ? (
              fish.map((item, index) => (
                <div className="fish" key={index}>
                  <div className="fish-info w-2/3 text-left">{item.name}</div>

                  <div className="fish-info w-2/3 text-left">
                    {item.location}
                  </div>

                  <div className="fish-info w-2/3 text-left">
                    {(item.probability * 100).toFixed(2)}% or {getBuckets(item)}{" "}
                    buckets
                  </div>
                </div>
              ))
            ) : (
              <p className="fish">No new fish available to catch!</p>
            )}
          </div>
        </div>
      </div>
    </AnimatedTabContent>
  );
};

export default FishTab;
