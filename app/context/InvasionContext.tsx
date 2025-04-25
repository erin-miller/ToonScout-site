"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
const API_LINK = process.env.NEXT_PUBLIC_API_HTTP;

interface InvasionContextType {
  invasions: InvasionData[];
  loading: boolean;
}

interface InvasionData {
  asOf: number;
  cog: string;
  progress: string;
  startTimestamp: number;
  district: string;
}

const InvasionContext = createContext<InvasionContextType>({
  invasions: [],
  loading: true,
});

export const InvasionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [invasions, setInvasions] = useState<InvasionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let isFirstFetch = true;
    const fetchInvasions = async () => {
      try {
        if (isFirstFetch) setLoading(true);
        const response = await fetch(`${API_LINK}/utility/get-invasions`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        if (data.error) return;
        const transformed = Object.entries(data.invasions).map(
          ([district, invasion]: any) => ({
            asOf: invasion.asOf,
            cog: invasion.type,
            progress: invasion.progress,
            startTimestamp: invasion.startTimestamp,
            district,
          })
        );
        setInvasions(transformed);
      } catch (e) {
        // Optionally handle error
      } finally {
        if (isFirstFetch) setLoading(false);
        isFirstFetch = false;
      }
    };

    fetchInvasions();
    interval = setInterval(fetchInvasions, 60000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <InvasionContext.Provider value={{ invasions, loading }}>
      {children}
    </InvasionContext.Provider>
  );
};

export const useInvasionContext = () => useContext(InvasionContext);
