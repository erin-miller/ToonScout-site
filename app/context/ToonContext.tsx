"use client";
import React, { createContext, useContext, useMemo, useState } from "react";
import { ToonData } from "../types";

type ToonContextType = {
  toons: ToonData[];
  addToon: (newToon: ToonData) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
};

const MAX_TOONS = 8;

const ToonContext = createContext<ToonContextType | undefined>(undefined);

export const ToonProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toons, setToons] = useState<ToonData[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const addToon = (newToon: ToonData) => {
    const sanitized: ToonData = JSON.parse(sanitize(JSON.stringify(newToon)));

    setToons((prevToons) => {
      const existingIndex = prevToons.findIndex(
        (toon) => toon?.data.toon.id === sanitized.data.toon.id
      );

      if (existingIndex !== -1) {
        // toon exists
        const newToons = [...prevToons];
        newToons[existingIndex] = sanitized;
        return newToons;
      }

      // toon does not exist
      const newToons = [...prevToons];
      if (newToons.length < MAX_TOONS) {
        newToons.push(sanitized);
      } else {
        newToons.shift(); // Remove the oldest toon
        newToons.push(sanitized);
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
    cleaned = cleaned.replace(/\\u[0-9a-fA-F]{4}/g, '');
    return cleaned;
}