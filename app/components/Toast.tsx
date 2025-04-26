import React from "react";
import { createPortal } from "react-dom";
import { getCogImage } from "./Home/tabs/components/utils";

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  duration?: number;
  persistent?: boolean; // If true, only dismiss manually
}

// Helper to extract cog names from the message (format: 'Relevant invasion: Cog1, Cog2')
function extractCogNames(message: string): string[] {
  const match = message.match(/Relevant invasion: (.+)/);
  if (!match) return [];
  // Split by comma, then extract cog name before ' in '
  return match[1].split(",").map((s) => s.trim().split(" in ")[0].trim());
}

const Toast: React.FC<ToastProps> = ({
  message,
  show,
  onClose,
  duration = 4000,
  persistent = false,
}) => {
  React.useEffect(() => {
    if (!show || persistent) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose, persistent]);

  if (!show) return null;

  // Try to extract cog names and show icons if possible
  const cogNames = extractCogNames(message);

  const toastContent = (
    <div className="fixed bottom-8 right-8 z-50 bg-pink-700 text-white px-6 py-3 rounded-lg shadow-lg text-lg animate-fade-in flex items-center gap-2">
      {cogNames.length > 0
        ? cogNames.map((cog) => {
            const img = getCogImage(cog);
            return img ? (
              <img
                key={cog}
                src={img}
                alt={cog}
                className="inline-block w-10 h-10 rounded-full border-2 border-pink-200 bg-white shadow-md"
                style={{ objectFit: "cover" }}
              />
            ) : null;
          })
        : null}
      <span className="ml-2 font-semibold text-xl drop-shadow-sm">
        {message}
      </span>
      <button
        className="ml-4 text-2xl font-bold hover:text-pink-300 focus:outline-none"
        onClick={onClose}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );

  return createPortal(toastContent, document.body);
};

export default Toast;
