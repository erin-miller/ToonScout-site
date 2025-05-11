import React, { useState, useEffect } from "react";
import SettingsItem from "./SettingsItem";

const FishSettingsItem: React.FC = () => {
  const [bucketType, setBucketType] = useState<1 | 2>(() => {
    return JSON.parse(localStorage.getItem("bucketType") || "1");
  });

  const [showCaught, setShowCaught] = useState<boolean>(() => {
    return JSON.parse(localStorage.getItem("showCaught") || "false");
  });

  const [showTime, setShowTime] = useState<boolean>(() => {
    return JSON.parse(localStorage.getItem("showTime") || "false");
  });

  useEffect(() => {
    localStorage.setItem("bucketType", JSON.stringify(bucketType));
    localStorage.setItem("showCaught", JSON.stringify(showCaught));
    localStorage.setItem("showTime", JSON.stringify(showTime));
    window.dispatchEvent(new Event("fishChange"));
  }, [bucketType, showCaught, showTime]);

  return (
    <SettingsItem label="Fishing">
      <div className="space-y-4">
        {/* Bucket Type */}
        <div>
          <div className="font-semibold text-lg">Bucket Type</div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              name="bucketType"
              id="avgBuckets"
              checked={bucketType === 1}
              onChange={() => setBucketType(1)}
              className="w-5 h-5 cursor-pointer"
            />
            <label
              className="text-lg cursor-pointer hover:text-blue-600"
              htmlFor="avgBuckets"
            >
              Average
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="radio"
              name="bucketType"
              id="confidentBuckets"
              checked={bucketType === 2}
              onChange={() => setBucketType(2)}
              className="w-5 h-5 cursor-pointer"
            />
            <label
              className="text-lg cursor-pointer hover:text-blue-600"
              htmlFor="confidentBuckets"
            >
              Confident (90%)
            </label>
          </div>
        </div>

        {/* Other Settings */}
        <div>
          <div className="text-lg font-semibold">Other</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showCaught}
                id="caught"
                onChange={(e) => setShowCaught(e.target.checked)}
                className="w-5 h-5 cursor-pointer"
              />
              <label
                htmlFor="caught"
                className="text-lg cursor-pointer hover:text-blue-600"
              >
                Show Caught Fish
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showTime}
                id="catchTime"
                onChange={(e) => setShowTime(e.target.checked)}
                className="w-5 h-5 cursor-pointer"
              />
              <label
                htmlFor="catchTime"
                className="text-lg cursor-pointer hover:text-blue-600"
              >
                Show Estimated Time to Catch
              </label>
            </div>
          </div>
        </div>
      </div>
    </SettingsItem>
  );
};

export default FishSettingsItem;
