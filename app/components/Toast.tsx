import React from "react";
import { getCogImage } from "./Home/tabs/components/utils";

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  duration?: number;
}

// Helper to extract cog names from the message (format: 'Relevant invasion: Cog1, Cog2')
function extractCogNames(message: string): string[] {
  const match = message.match(/Relevant invasion: (.+)/);
  if (!match) return [];
  return match[1].split(",").map((s) => s.trim());
}

const Toast: React.FC<ToastProps> = ({
  message,
  show,
  onClose,
  duration = 4000,
}) => {
  React.useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  // Try to extract cog names and show icons if possible
  const cogNames = extractCogNames(message);

  return (
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
    </div>
  );
};

export default Toast;
