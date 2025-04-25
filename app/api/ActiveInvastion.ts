import { useEffect, useState } from "react";

interface InvasionAPIResponse {
  error: null | string;
  invasions: {
    [district: string]: {
      asOf: number;
      type: string;
      progress: string;
      startTimestamp: number;
    };
  };
  lastUpdated: number;
}

export interface InvasionData {
  asOf: number;
  cog: string;
  progress: string;
  startTimestamp: number;
  district: string;
}

const useActiveInvasions = () => {
  const BASE_URL = "https://www.toontownrewritten.com";
  const [invasions, setInvasions] = useState<InvasionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvasions = async () => {
      try {
        // Add cache-busting query param and no-store cache option
        const response = await fetch(
          `${BASE_URL}/api/invasions?cb=${Date.now()}`,
          { cache: "no-store" }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: InvasionAPIResponse = await response.json();
        console.log("Invasions data:", data);
        if (data.error) {
          console.error("Error in API response:", data.error);
          return;
        }

        const transformedInvasions = Object.values(data.invasions).map(
          (invasion) => {
            return {
              asOf: invasion.asOf,
              cog: invasion.type,
              progress: invasion.progress,
              startTimestamp: invasion.startTimestamp,
              district: Object.keys(data.invasions).find(
                (key) => data.invasions[key] === invasion
              ) as string,
            };
          }
        );

        setInvasions(transformedInvasions);
        console.log("Transformed Invasions data:", transformedInvasions);
      } catch (error) {
        console.error("Error fetching invasions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvasions();
  }, []);

  return { invasions, loading };
};

export { useActiveInvasions };
