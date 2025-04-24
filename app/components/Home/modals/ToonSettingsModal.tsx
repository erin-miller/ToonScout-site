import React from "react";
import Modal from "../../Modal";
import { StoredToonData } from "@/app/types";
import { useToonContext } from "@/app/context/ToonContext";

type SettingsModalProps = {
  toon: StoredToonData; 
  isOpen: boolean;
  onClose: () => void;
};

const SettingsModal: React.FC<SettingsModalProps> = ({ toon, isOpen, onClose }) => {
  if (!isOpen || !toon) return null;
  const { toons, addToon } = useToonContext();

  const toggleLock = (index: number) => {
    const toon = toons[index];
    toon.locked = !toon.locked;
    addToon(toon);
  };

  const getLockedStatus = (index: number) => {
    return toons[index].locked;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-3xl font-bold">{toon.data.data.toon.name}</h3>
      
    </Modal>
  );
};

export default SettingsModal;