import React from "react";
import { TabProps } from "./components/TabComponent";
import AnimatedTabContent from "../../animations/AnimatedTab";
import "/styles/tabs.css";
import ExpContainer from "./components/ExpContainer";

const GagsTab: React.FC<TabProps> = ({ toonData }) => {
  const tracks = Object.keys(toonData.data.gags);

  return (
    <AnimatedTabContent>
      <div className="container mx-auto">
        {tracks.map((track) => {
          const trackData = toonData.data.gags[track];

          let maxLevel = 0;

          if (trackData) {
            maxLevel = toonData.data.gags[track]?.gag.level || 0;
          }

          return (
            <div
              key={track}
              className={`flex items-center bg-${track.toLowerCase()} rounded-3xl py-2 space-x-1 shadow-lg relative overflow-hidden inline-flex max-w-max pr-4`}
            >
              <div className="flex flex-col px-2">
                <h3
                  className={`w-36 font-bold uppercase text-xl lg:text-lg xl:text-xl 2xl:text-2xl text-${track.toLowerCase()} text-left`}
                >
                  <div className="text-black opacity-70 rounded-lg">
                    {track}
                  </div>
                </h3>

                <ExpContainer track={track} toonData={toonData} />
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }).map((_, gagIndex) => {
                  const isImageVisible = trackData && gagIndex + 1 <= maxLevel;
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
                          src={`/gags/${track.toLowerCase()}-${
                            gagIndex + 1
                          }.png`}
                          aria-label={`${track} gag ${gagIndex + 1}`}
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
    </AnimatedTabContent>
  );
};

export default GagsTab;
