import { useState } from "react";
import { useToonContext } from "@/app/context/ToonContext";
import AnimatedTabContent from "../animations/AnimatedTab";

const ToonSelect = () => {
  const { toons, activeIndex, setActiveIndex } = useToonContext();
  const [isOpen, setOpen] = useState(false);
  const curr = toons[activeIndex];

  const getImage = (dna: string) => {
    return `https://rendition.toontownrewritten.com/render/${dna}/portrait/512x512.png`;
  };

  const handleDropdown = () => {
    setOpen(!isOpen);
  };

  const handleToonSelect = (index: number) => () => {
    setActiveIndex(index);
    setOpen(false);
  };

  const getRemaining = () => {
    if (toons.length < 7) {
      return `Add up to ${7 - toons.length} more toons!`;
    } else {
      return `The oldest toon will be replaced by the next new toon.`;
    }
  };

  return (
    <div className="relative flex items-center text-gray-900 dark:text-gray-100 z-50">
      <button
        className="border-2 h-12 w-12 border-pink-700 bg-pink-100 dark:bg-pink-900 rounded-full shadow-lg hover:shadow-lg scale-up overflow-hidden"
        onClick={handleDropdown}
      >
        <img src={getImage(curr.data.toon.style)} />
      </button>
      {isOpen && (
        <AnimatedTabContent>
          <div className="absolute -left-[52px] top-7 w-52 bg-white dark:bg-gray-900 border border-gray-700 dark:border-pink-900 shadow-xl overflow-hidden">
            {toons.map(
              (toon, index) =>
                index !== activeIndex && (
                  <button
                    key={index}
                    className="flex items-center gap-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-1000 cursor-pointer w-full"
                    onClick={handleToonSelect(index)}
                  >
                    <img
                      src={getImage(toon.data.toon.style)}
                      alt="Toon Portrait"
                      className="hidden lg:block w-10 h-10 rounded-full border-2 border-pink-300 bg-pink-100 dark:bg-pink-900"
                    />
                    <span className="text-sm md:text-md text-left">
                      {toon.data.toon.name}
                    </span>
                  </button>
                )
            )}
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
