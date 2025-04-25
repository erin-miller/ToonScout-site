"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { InvasionData } from "@/app/api/ActiveInvastion";

interface InvasionContextType {
  invasions: InvasionData[];
  loading: boolean;
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
        // Add cache-busting query param and no-store cache option
        const response = await fetch(
          `https://www.toontownrewritten.com/api/invasions?cb=${Date.now()}`,
          {
            cache: "no-store",
            headers: {
              "User-Agent": "gh-warmpoptart",
            },
          }
        );
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

    fetchInvasions(); // Initial fetch sets loading
    interval = setInterval(fetchInvasions, 60000); // Poll every 60 seconds

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []); // Remove dependency on notification state

  return (
    <InvasionContext.Provider value={{ invasions, loading }}>
      {children}
    </InvasionContext.Provider>
  );
};

export const useInvasionContext = () => useContext(InvasionContext);
