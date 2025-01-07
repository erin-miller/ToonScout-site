import React from "react";
import { TabProps } from "./TabContainer/TabComponent";
import AnimatedTabContent from "../../animations/AnimatedTab";
import "/styles/tabs.css";

const GagsTab: React.FC<TabProps> = ({ toonData }) => {
  const tracks = Object.keys(toonData.data.gags);

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

  return (
    <AnimatedTabContent>
      <div className="container mx-auto">
        <div className="">
          {tracks.map((track) => {
            const trackData = toonData.data.gags[track];

            let maxLevel = 0;

            if (trackData) {
              maxLevel = toonData.data.gags[track]?.gag.level || 0;
            }

            return (
              <div
                key={track}
                className={`flex items-center bg-${track.toLowerCase()} rounded-3xl py-2 space-x-1 shadow-lg relative`}
              >
                <div className="flex flex-col px-2">
                  <h3
                    className={`w-36 font-bold uppercase text-2xl text-${track.toLowerCase()} text-left`}
                  >
                    <div className="text-black opacity-70 rounded-lg">
                      {track}
                    </div>
                  </h3>

                  {/* exp container */}
                  <div
                    className={`relative bg-${track.toLowerCase()} rounded-lg items-center justify-center`}
                  >
                    <div className="absolute inset-0 z-0 bg-black opacity-10 rounded-lg"></div>
                    <div
                      className={`relative z-10 text-${track.toLowerCase()}`}
                    >
                      <div className="text-black opacity-80 rounded-lg">
                        {formatExp(track)}
                      </div>
                    </div>

                    {/* exp border for owned gags */}
                    {trackData && (
                      <div
                        className={`absolute inset-0 border-2 border-solid rounded-lg`}
                        style={{
                          borderColor: `rgba(0, 0, 0, 0.1)`,
                        }}
                      ></div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 7 }).map((_, gagIndex) => {
                    const isImageVisible =
                      trackData && gagIndex + 1 <= maxLevel;
                    return (
                      <div
                        key={`${track}-${gagIndex}`}
                        className={`w-20 h-16 rounded-3xl flex items-center justify-center relative shadow-lg ${
                          isImageVisible ? "bg-gagblue" : ""
                        }`}
                      >
                        {/* unowned slot */}
                        {!isImageVisible && (
                          <div
                            className={`absolute inset-0 bg-black opacity-15 rounded-3xl`}
                          ></div>
                        )}
                        {/* gag slot */}
                        {isImageVisible ? (
                          <img
                            src={`/gags/${track}-${gagIndex + 1}.png`}
                            alt={`${track} gag ${gagIndex + 1}`}
                            className="w-12 h-12 object-contain"
                          />
                        ) : null}

                        {/* gag border styling */}
                        {isImageVisible && (
                          <div
                            className={`absolute inset-0 border-2 border-solid rounded-3xl shadow-md`}
                            style={{
                              borderColor: `rgba(0, 0, 0, 0.1)`,
                            }}
                          >
                            <div
                              className={`absolute inset-0 border-2 border-b-8 opacity-5 border-solid rounded-3xl`}
                              style={{
                                borderColor: `white`,
                              }}
                            ></div>
                            <div
                              className={`absolute inset-0 border-4 border-t-8 opacity-5 border-solid rounded-3xl`}
                              style={{
                                borderColor: `white`,
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div
                    className={`absolute inset-0 border-4 border-solid rounded-3xl`}
                    style={{
                      borderColor: `rgba(0, 0, 0, 0.2)`,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedTabContent>
  );
};

export default GagsTab;
