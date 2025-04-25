import React, { useEffect, useState } from "react";
import { TabProps } from "./components/TabComponent";
import AnimatedTabContent from "../../animations/AnimatedTab";
import { useInvasionContext } from "@/app/context/InvasionContext";
import { FaGlobe, FaClock, FaHourglassStart } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

const InvasionsTab: React.FC<TabProps> = ({ toon }) => {
  const { invasions, loading } = useInvasionContext();
  const [now, setNow] = useState(Date.now());

  // Update every second for live elapsed time
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Helper to parse progress string like "123/500"
  function parseProgress(progress: string) {
    const match = progress.match(/(\d+)\s*\/\s*(\d+)/);
    if (!match) return { current: 0, total: 1 };
    return { current: parseInt(match[1]), total: parseInt(match[2]) };
  }

  // Helper to format elapsed time
  function formatElapsed(ms: number) {
    const sec = Math.floor(ms / 1000) % 60;
    const min = Math.floor(ms / 60000) % 60;
    const hr = Math.floor(ms / 3600000);
    return `${hr > 0 ? hr + ":" : ""}${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  }

  return (
    <AnimatedTabContent>
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : invasions.length > 0 ? (
          <AnimatePresence initial={false}>
            {invasions.map((invasion) => {
              const { current, total } = parseProgress(invasion.progress);
              const percent = Math.floor((current / total) * 100); // Use Math.floor for percent
              const elapsedMs = now - invasion.startTimestamp * 1000;
              return (
                <motion.div
                  key={`${invasion.asOf}-${invasion.district}-${invasion.cog}`}
                  initial={{ y: -40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  layout // enables smooth reordering and stacking
                  className="p-4 border rounded-xl bg-white dark:bg-gray-1100 shadow-md space-y-2"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <h3 className="font-bold text-xl md:text-2xl text-pink-700 dark:text-pink-300">
                      {invasion.cog}
                    </h3>
                    <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300">
                      <FaGlobe className="inline-block mr-1" />
                      <span className="font-semibold">{invasion.district}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center w-full">
                    <div className="text-center text-base font-medium mb-1">
                      Progress: {invasion.progress} ({percent.toFixed(0)}%)
                    </div>
                    <div className="w-full max-w-xs h-4 bg-gray-200 dark:bg-gray-900 rounded-full overflow-hidden mb-1">
                      <div
                        className="h-full bg-pink-600 dark:bg-pink-400 transition-all duration-500"
                        style={{ width: percent + "%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-gray-700 dark:text-gray-200 text-sm mt-2">
                    <div className="flex items-center gap-1">
                      <FaClock className="inline-block" />
                      <span>
                        Start:{" "}
                        {new Date(
                          invasion.startTimestamp * 1000
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaHourglassStart className="inline-block" />
                      <span>
                        Active For:{" "}
                        <span className="font-mono">
                          {formatElapsed(elapsedMs)}
                        </span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <div>No active invasions</div>
        )}
      </div>
    </AnimatedTabContent>
  );
};

export default InvasionsTab;
