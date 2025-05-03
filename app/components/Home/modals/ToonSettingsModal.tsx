import React, { useEffect, useState } from "react";
import Modal from "../../Modal";
import { StoredToonData } from "@/app/types";
import { useToonContext } from "@/app/context/ToonContext";
import { FaLock, FaUnlock, FaCog, FaTrash } from "react-icons/fa";

type SettingsModalProps = {
  toon: StoredToonData | null;
  index: number | null;
  isOpen: boolean;
  onClose: () => void;
};

const SettingsModal: React.FC<SettingsModalProps> = ({
  toon,
  index,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !toon || index == null) return null;
  const { toons, addToon, deleteToon } = useToonContext();
  const [flowerType, setFlowerType] = useState<1 | 2 | 3>(() => {
    return JSON.parse(localStorage.getItem("flowerType") || "1");
  });

  useEffect(() => {
    localStorage.setItem("flowerType", JSON.stringify(flowerType));
    window.dispatchEvent(new Event("flowerChange"));
  }, [flowerType]);

  const toggleLock = (index: number) => {
    const toon = toons[index];
    toon.locked = !toon.locked;
    addToon(toon);
  };

  const getLockedStatus = (index: number) => {
    return toons[index]?.locked ?? false;
  };

  function handleFlowerDisplay(arg: 1 | 2 | 3): void {
    setFlowerType(arg);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="px-2">
        <h3 className="text-3xl font-bold text-gray-900">
          {toon.data.data.toon.name}
        </h3>
        <div className="flex flex-col items-left gap-2 mb-4">
          {/* individual settings */}
          {/* lock */}
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 text-xl"
              onClick={() => toggleLock(index)}
            >
              {getLockedStatus(index) ? (
                <FaUnlock className="text-green-500 text-2xl" />
              ) : (
                <FaLock className="text-red-500 text-2xl" />
              )}
            </button>
            <span>
              Currently {getLockedStatus(index) ? "Unlocked" : "Locked"}
            </span>
          </div>

          {/* global settings */}
          <h3 className="text-3xl font-bold text-gray-900 mt-5">
            Global Settings
          </h3>

          {/* gardening settings */}
          <div className="text-2xl flex items-center gap-2 font-semibold">
            <span>Gardening Display</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="flowerType"
                id="progressFlowers"
                checked={flowerType === 1}
                onChange={() => handleFlowerDisplay(1)}
                className="w-5 h-5 cursor-pointer"
              />
              <label
                className="text-lg cursor-pointer hover:text-blue-600"
                htmlFor="progressFlowers"
              >
                Only flowers that grant progress
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="flowerType"
                id="plantableFlowers"
                checked={flowerType === 2}
                onChange={() => handleFlowerDisplay(2)}
                className="w-5 h-5 cursor-pointer"
              />
              <label
                className="text-lg cursor-pointer hover:text-blue-600"
                htmlFor="plantableFlowers"
              >
                All plantable flowers
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="flowerType"
                id="allFlowers"
                checked={flowerType === 3}
                onChange={() => handleFlowerDisplay(3)}
                className="w-5 h-5 cursor-pointer"
              />
              <label
                className="text-lg cursor-pointer hover:text-blue-600"
                htmlFor="allFlowers"
              >
                All flowers
              </label>
            </div>
          </div>
        </div>

        {/* deletion */}
        <div className="flex items-center justify-center text-red-800">
          <button
            className="flex items-center gap-2 text-xl bg-red-200 p-2 rounded hover:bg-red-300"
            onClick={() => {
              onClose();
              deleteToon(toon);
            }}
          >
            <FaTrash className="text-red-800" />
            <span>Delete Toon</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
