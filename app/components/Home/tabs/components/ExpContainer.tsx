import React, { useEffect, useState } from "react";
import { ToonData } from "@/app/types";

export type ExpContainerProps = {
  track: string;
  toonData: ToonData;
};

const ExpContainer: React.FC<ExpContainerProps> = ({ track, toonData }) => {
  const trackData = toonData.data.gags[track];
  const [progress, setProgress] = useState(0);

  const formatExp = (track: string) => {
    const curr = toonData.data.gags[track]?.experience.current;
    const next = toonData.data.gags[track]?.experience.next;
    const lvl = toonData.data.gags[track]?.gag.level;

    if (!curr || !next) {
      return;
    }

    if (curr >= next) {
      return `0 to go!`;
    }

    if (lvl == 7) {
      return `${next - curr} to go!`;
    } else {
      return `${curr} / ${next}`;
    }
  };

  const calculateProgress = () => {
    const curr = toonData.data.gags[track]?.experience.current || 0;
    const next = toonData.data.gags[track]?.experience.next || 1;
    return Math.min((curr / next) * 100, 100);
  };

  useEffect(() => {
    setProgress(calculateProgress());
  }, [track, toonData]);

  return (
    <div
      className={`relative bg-${track.toLowerCase()} rounded-lg items-center justify-center text-xl lg:text-md 2xl:text-xl`}
    >
      {/* Background overlay */}
      <div
        className="absolute inset-0 z-0 h-full bg-gray-1400 opacity-20 rounded-lg"
        style={{
          width: `${progress}%`,
        }}
      ></div>

      {/* Content */}
      <div className={`relative z-10 text-${track.toLowerCase()}`}>
        <div className="text-black opacity-90 rounded-lg">
          {formatExp(track)}
        </div>
      </div>

      {/* Border for owned gags */}
      {trackData && (
        <div
          className="absolute inset-0 border-2 border-solid rounded-lg"
          style={{
            borderColor: `rgba(0, 0, 0, 0.1)`,
          }}
        ></div>
      )}
    </div>
  );
};

export default ExpContainer;
