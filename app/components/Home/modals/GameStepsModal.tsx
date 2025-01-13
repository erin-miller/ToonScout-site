import React from "react";
import AnimatedTabContent from "@/app/components/animations/AnimatedTab";
import GameSteps from "../../GameSteps/GameSteps";
import Modal from "../../Modal";

interface GameStepsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GameStepsModal: React.FC<GameStepsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <GameSteps />
    </Modal>
  );
};

export default GameStepsModal;
