"use client";
import React, { createContext, useContext, useMemo, useState } from "react";
import { StoredToonData } from "../types";

type ToonContextType = {
  toons: StoredToonData[];
  addToon: (newToon: StoredToonData) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
};

const MAX_TOONS = 8;

const ToonContext = createContext<ToonContextType | undefined>(undefined);

export const ToonProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toons, setToons] = useState<StoredToonData[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const addToon = (newToon: StoredToonData) => {
    const sanitized: StoredToonData = JSON.parse(JSON.stringify(newToon)); // Just deep clone the object if needed
  
    setToons((prevToons) => {
      const existingIndex = prevToons.findIndex(
        (toon) => toon?.data?.data.toon.id === sanitized?.data?.data.toon?.id
      );
  
      if (existingIndex !== -1) {
        // toon exists
        const newToons = [...prevToons];
        newToons[existingIndex] = sanitized;
        localStorage.setItem("toonData", JSON.stringify(newToons));
        return newToons;
      }
  
      // toon does not exist
      const newToons = [...prevToons];
      if (newToons.length < MAX_TOONS) {
        newToons.push(sanitized);
      } else {
        const parse = localStorage.getItem("toonData");
        const storage = parse ? JSON.parse(parse) : [];
  
        // Filter for unlocked toons
        const unlocked = storage.filter((toon: StoredToonData) => !toon.locked);
  
        if (unlocked.length === 0) {
          console.log("All toons are locked. Cannot add a new toon.");
          return prevToons;
        }
  
        // Replace the oldest unlocked toon
        const oldest = storage.findIndex((toon: StoredToonData) => !toon.locked);
        if (oldest !== -1) {
          const replaceIndex = newToons.findIndex(
            (toon) => toon.data.data.toon.id === storage[oldest].data.data.toon.id
          );
          if (replaceIndex !== -1) {
            newToons[replaceIndex] = sanitized;
            storage[oldest].data = sanitized;
            localStorage.setItem("toonData", JSON.stringify(storage)); // Sync with localStorage
          }
        }
      }
  
      return newToons;
    });
  };
  

  const value = useMemo(
    () => ({
      toons,
      addToon,
      activeIndex,
      setActiveIndex,
    }),
    [toons, activeIndex]
  );

  return <ToonContext.Provider value={value}>{children}</ToonContext.Provider>;
};

export const useToonContext = () => {
  const context = useContext(ToonContext);
  if (!context) {
    throw new Error("useToonContext must be used within a ToonProvider");
  }
  return context;
};

const sanitize = (data: string) => {
  let obj = JSON.parse(data);
  let cleaned = JSON.stringify(obj);
  cleaned = cleaned.replace(/\\u[0-9a-fA-F]{4}/g, "");
  return cleaned;
};
