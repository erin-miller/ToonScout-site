import { useConnectionContext } from "@/app/context/ConnectionContext";
import { useToonContext } from "@/app/context/ToonContext";
import React, { useEffect, useState } from "react";

const ConnectionStatus: React.FC = () => {
  const { isConnected } = useConnectionContext();
  const { toonData } = useToonContext();
  const [modified, setModified] = useState<string>("");

  useEffect(() => {
    const existingToon = localStorage.getItem("toonData");

    if (existingToon) {
      try {
        const storedData = JSON.parse(existingToon);
        const { timestamp } = storedData;

        const timeDifference = Date.now() - timestamp;
        const timeAgo = getTimeAgo(timeDifference);

        setModified(timeAgo);
      } catch (error) {
        console.error("Error parsing existing toon data.");
      }
    }
  }, []);

  const getTimeAgo = (timeDifference: number): string => {
    if (timeDifference < 60000) {
      return `<1 minute ago`;
    } else if (timeDifference < 3600000) {
      return `${Math.floor(timeDifference / 60000)} minute(s) ago`;
    } else if (timeDifference < 86400000) {
      return `${Math.floor(timeDifference / 3600000)} hour(s) ago`;
    } else {
      return `${Math.floor(timeDifference / 86400000)} day(s) ago`;
    }
  };

  return (
    <div className="flex items-center justify-center pt-6 scale-up">
      <span
        className={`w-2.5 h-2.5 rounded-full mr-2 ${
          isConnected ? "bg-green-500" : "bg-gray-900"
        }`}
      />
      <span>{toonData ? `Last updated ${modified}` : "No data found."}</span>
    </div>
  );
};

export default ConnectionStatus;
