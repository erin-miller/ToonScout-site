import React from "react";
import Toast from "./Toast";

interface InvasionToastProps {
  show: boolean;
  onClose: () => void;
  message: string;
  cogIcon?: string; // URL to cog icon
  persistent?: boolean;
  duration?: number;
}

const InvasionToast: React.FC<InvasionToastProps> = ({
  show,
  onClose,
  message,
  cogIcon,
  persistent = false,
  duration = 4000,
}) => {
  return (
    <Toast
      show={show}
      onClose={onClose}
      message={message}
      persistent={persistent}
      duration={duration}
    >
      {cogIcon && (
        <img
          src={cogIcon}
          alt="Cog Icon"
          className="w-10 h-10 rounded-full bg-white mr-2"
        />
      )}
    </Toast>
  );
};

export default InvasionToast;
