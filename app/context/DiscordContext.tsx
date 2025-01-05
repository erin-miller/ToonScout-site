"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type DiscordContextType = {
  isAuth: boolean;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
};

const DiscordContext = createContext<DiscordContextType | undefined>(undefined);

export const DiscordProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);

  return (
    <DiscordContext.Provider value={{ isAuth: isAuth, setIsAuth: setIsAuth }}>
      {children}
    </DiscordContext.Provider>
  );
};

export const useDiscordContext = () => {
  const context = useContext(DiscordContext);
  if (!context) {
    throw new Error("useDiscordContext must be used within a DiscordProvider");
  }
  return context;
};
