import React from "react";
import Modal from "../../Modal";
import { StoredToonData } from "@/app/types";
import { useToonContext } from "@/app/context/ToonContext";
import { FaLock, FaUnlock, FaCog } from "react-icons/fa";


type SettingsModalProps = {
  toon: StoredToonData | null; 
  index: number | null;
  isOpen: boolean;
  onClose: () => void;
};

const SettingsModal: React.FC<SettingsModalProps> = ({ toon, index, isOpen, onClose }) => {
  if (!isOpen || !toon || !index) return null;
  const { toons, addToon } = useToonContext();

  const toggleLock = (index: number) => {
    const toon = toons[index];
    toon.locked = !toon.locked;
    addToon(toon);
  };

  const getLockedStatus = (index: number) => {
    return toons[index]?.locked ?? false;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-3xl font-bold">{toon.data.data.toon.name}</h3>

      {/* individual settings */}
      <div>
        {/* lock */}
        <button
          className="flex items-center gap-2 text-xl"
          onClick={() => toggleLock(toons.indexOf(toon))}>
          {getLockedStatus(toons.indexOf(toon)) ? (
            <FaUnlock className="text-green-500" />
          ) : (
            <FaLock className="text-red-500" />
          )}
        </button>
        {/* deletion */}
      </div>
    </Modal>
  );
};

export default SettingsModal;