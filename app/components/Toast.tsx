import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  show,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;
  return (
    <div className="fixed bottom-8 right-8 z-50 bg-pink-700 text-white px-6 py-3 rounded-lg shadow-lg text-lg animate-fade-in">
      {message}
    </div>
  );
};

export default Toast;
