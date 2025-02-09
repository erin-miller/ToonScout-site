import { useEffect, useState } from "react";
import { useToonContext } from "@/app/context/ToonContext";
import AnimatedTabContent from "../animations/AnimatedTab";
import { FaLock, FaUnlock } from "react-icons/fa";
import { StoredToonData } from "@/app/types";

const ToonSelect = () => {
  const { toons, activeIndex, setActiveIndex, addToon } = useToonContext();
  const [isOpen, setOpen] = useState(false);
  const curr = toons[activeIndex];
  const MAX_TOONS = 8;

  const getImage = (dna: string) => {
    const flippy =
      "https://rendition.toontownrewritten.com/render/740101000103110311000011000011010400000000000000000000000000000000/portrait/512x512.png";
    return dna
      ? `https://rendition.toontownrewritten.com/render/${dna}/portrait/512x512.png`
      : flippy;
  };

  const handleDropdown = () => {
    setOpen(!isOpen);
  };

  const handleToonSelect = (index: number) => () => {
    setActiveIndex(index);
    setOpen(false);
  };

  const getRemaining = () => {
    if (toons.length < MAX_TOONS) {
      return `Add up to ${MAX_TOONS - toons.length} more toons!`;
    } else {
      return `The oldest toon will be replaced by the next new toon.`;
    }
  };

  const toggleLock = (index: number) => {
    const toon = toons[index];

    const existingData = localStorage.getItem("toonData");
    let toonData = existingData ? JSON.parse(existingData) : [];

    const toonIndex = toonData.findIndex(
      (stored: StoredToonData) => stored.data.data.toon.id === toon.data.data.toon.id
    );

    if (toonIndex !== -1) {
      toonData[toonIndex].locked = !toonData[toonIndex].locked;
    } else {
        return; // Toon not found in storage
    }

    localStorage.setItem("toonData", JSON.stringify(toonData));
    addToon(toons[index]);
  };

  const getLockedStatus = (index: number) => {
    const toon = toons[index];

    const existingData = localStorage.getItem("toonData");
    let toonData = existingData ? JSON.parse(existingData) : [];

    const toonIndex = toonData.findIndex(
      (stored: StoredToonData) => stored.data.data.toon.id === toon.data.data.toon.id
    );

    if (toonIndex !== -1) {
      return toonData[toonIndex].locked;
    }
  };

  return (
    <div className="relative flex items-center text-gray-900 dark:text-gray-100 z-50">
      <button
        className="border-2 h-12 w-12 border-pink-700 bg-pink-100 dark:bg-pink-900 rounded-full shadow-lg hover:shadow-lg scale-up overflow-hidden"
        onClick={handleDropdown}
      >
        <img src={getImage(curr?.data.data.toon.style)} />
      </button>
      {isOpen && (
        <AnimatedTabContent>
          <div className="absolute -left-[52px] top-7 w-52 bg-white dark:bg-gray-900 border border-gray-700 dark:border-pink-900 shadow-xl overflow-hidden">
            {toons.map((toon, index) => (
              <button
                key={index}
                className="flex items-center gap-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-1000 cursor-pointer w-full"
                onClick={handleToonSelect(index)}
              >
                <img
                  src={getImage(toon.data.data.toon.style)}
                  alt="Toon Portrait"
                  className="hidden lg:block w-10 h-10 rounded-full border-2 border-pink-300 bg-pink-100 dark:bg-pink-900"
                />
                <span className="text-sm md:text-md text-left">
                  {toon.data.data.toon.name}
                </span>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLock(index);
                  }}
                  className="ml-auto text-gray-500 dark:text-gray-300"
                  title="Locked toons won't be replaced."
                >
                  {getLockedStatus(index) ? (
                    <FaLock className="text-red-500" />
                  ) : (
                    <FaUnlock className="text-green-500" />
                  )}
                </div>
              </button>
            ))}
            <div className="hidden lg:block items-center text-center justify-center w-full p-2">
              {getRemaining()}
            </div>
          </div>
        </AnimatedTabContent>
      )}
    </div>
  );
};

export default ToonSelect;
