import { useConnectionContext } from "@/app/context/ConnectionContext";
import { useToonContext } from "@/app/context/ToonContext";
import React, { useEffect, useState } from "react";
interface ConnectionStatusProps {
  setActiveModal: React.Dispatch<React.SetStateAction<string | null>>;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  setActiveModal,
}) => {
  const { isConnected } = useConnectionContext();
  const { toonData } = useToonContext();
  const [modified, setModified] = useState<string>("");

  useEffect(() => {
    const existingToon = localStorage.getItem("toonData");

    if (existingToon) {
      try {
        const storedData = JSON.parse(existingToon);
        const { timestamp } = storedData;

        const diff = Date.now() - timestamp;
        const timeAgo = getTimeAgo(diff);

        setModified(timeAgo);
      } catch (error) {
        console.error("Error parsing existing toon data.");
      }
    }
  }, [toonData]);

  const handleStatusClick = () => {
    setActiveModal("connect");
  };

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
    <div className="flex items-center justify-center">
      <button className="scale-up" onClick={handleStatusClick}>
        <div
          className={`flex flex-row text-lg items-center justify-center px-2 rounded-full border-2
            ${
              isConnected
                ? "border-green-600 bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100"
                : "border-red-500 bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100"
            }`}
        >
          <div
            className={`w-2.5 h-2.5 rounded-full mr-2 ${
              isConnected ? "bg-green-600" : "bg-red-500"
            }`}
          />
          <div>{toonData ? `Last updated ${modified}` : "No data found."}</div>
        </div>
      </button>
    </div>
  );
};

export default ConnectionStatus;
