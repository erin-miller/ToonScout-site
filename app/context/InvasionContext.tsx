"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useToonContext } from "./ToonContext";
import { getRelevantInvasionsForTasks } from "../components/Home/tabs/components/utils";
const API_LINK = process.env.NEXT_PUBLIC_API_HTTP;

/**
 * @typedef {Object} InvasionDetails
 * @property {number} asOf - Timestamp when invasion info was updated
 * @property {string} type - The cog type (e.g., "Ambulance Chaser", "Bottom Feeder")
 * @property {string} progress - Current invasion progress as "current/total" (e.g., "1498/3000")
 * @property {number} startTimestamp - Unix timestamp when the invasion started
 */

/**
 * @typedef {Object} TTRInvasionResponse
 * @property {null|string} error - Error message if any, null if successful
 * @property {Object.<string, InvasionDetails>} invasions - Map of district names to invasion details
 * @property {number} lastUpdated - Unix timestamp of when the data was last updated
 */

interface InvasionContextType {
  invasions: InvasionData[];
  loading: boolean;
  isTestMode: boolean;
  enableTestMode: () => void;
  disableTestMode: () => void;
  triggerTestInvasionNotification: () => void;
}

interface InvasionData {
  asOf: number;
  cog: string;
  progress: string;
  startTimestamp: number;
  district: string;
}

// TypeScript interface for the API response
interface TTRInvasionResponse {
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

// Intervals in milliseconds
const LIVE_DATA_INTERVAL = 60000; // 60 seconds for live data
const TEST_DATA_INTERVAL = 10000; // 10 seconds for test data

const InvasionContext = createContext<InvasionContextType>({
  invasions: [],
  loading: true,
  isTestMode: false,
  enableTestMode: () => {},
  disableTestMode: () => {},
  triggerTestInvasionNotification: () => {},
});

export const InvasionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [invasions, setInvasions] = useState<InvasionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTestMode, setIsTestMode] = useState(false);
  const prevInvasions = useRef<InvasionData[]>([]);

  // Function to trigger a custom invasion notification event for the whole app
  const triggerInvasionNotification = (relevantInvasions: InvasionData[]) => {
    if (!relevantInvasions.length) return;

    // Get notification settings from localStorage
    const toastEnabled =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("tasksTabToastEnabled") || "true")
        : true;

    const soundEnabled =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("tasksTabSoundEnabled") || "true")
        : true;

    // Get cog names
    const cogNames = relevantInvasions.map((inv) => inv.cog).join(", ");

    // Create and dispatch custom event with the relevant data
    const event = new CustomEvent("invasionNotification", {
      detail: {
        message: `Relevant invasion: ${cogNames}`,
        invasions: relevantInvasions,
        showToast: toastEnabled,
        playSound: soundEnabled,
      },
    });

    window.dispatchEvent(event);
  };

  // Test notification function that enforces the same correlation logic
  const triggerTestInvasionNotification = () => {
    if (!invasions.length) return;
    // Check if notifications are enabled (matches TasksTab bell)
    const notificationsEnabled =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("tasksTabNotifications") || "false")
        : false;
    if (!notificationsEnabled) return;

    // Create and dispatch custom event with Legal Eagle or other test invasion
    const testInvasion =
      invasions.find((inv) => inv.cog === "Legal Eagle") || invasions[0];

    const event = new CustomEvent("invasionNotification", {
      detail: {
        message: `Test Notification: ${testInvasion.cog} invasion in ${testInvasion.district}!`,
        invasions: [testInvasion],
        showToast: true,
        playSound: true,
      },
    });

    window.dispatchEvent(event);
  };

  // Function to enable test mode
  const enableTestMode = () => {
    setIsTestMode(true);
  };

  // Function to disable test mode
  const disableTestMode = () => {
    setIsTestMode(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let isFirstFetch = true;

    const fetchInvasions = async () => {
      try {
        if (isFirstFetch) setLoading(true);

        // Use the appropriate endpoint based on test mode
        const endpoint = isTestMode
          ? `${API_LINK}/utility/test-invasions`
          : `${API_LINK}/utility/get-invasions`;

        const response = await fetch(endpoint, {
          cache: "no-store",
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const data = (await response.json()) as TTRInvasionResponse;
        if (data.error) return;

        const transformed = Object.entries(data.invasions).map(
          ([district, invasion]) => ({
            asOf: invasion.asOf,
            cog: invasion.type,
            progress: invasion.progress,
            startTimestamp: invasion.startTimestamp,
            district,
          })
        );

        // Set the invasions state
        setInvasions(transformed);

        // If in test mode, always trigger a notification when data updates
        if (isTestMode) {
          // For test mode, choose a Legal Eagle invasion if available
          const legalEagle = transformed.find(
            (inv) => inv.cog === "Legal Eagle"
          );
          if (legalEagle) {
            triggerInvasionNotification([legalEagle]);
          } else if (transformed.length > 0) {
            triggerInvasionNotification([transformed[0]]);
          }
        }

        prevInvasions.current = transformed;
      } catch (e) {
        // Optionally handle error
        console.error("Error fetching invasions:", e);
      } finally {
        if (isFirstFetch) setLoading(false);
        isFirstFetch = false;
      }
    };

    // Initial fetch
    fetchInvasions();

    // Set interval based on test mode
    const intervalTime = isTestMode ? TEST_DATA_INTERVAL : LIVE_DATA_INTERVAL;
    interval = setInterval(fetchInvasions, intervalTime);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTestMode]); // Re-run when test mode changes

  return (
    <InvasionContext.Provider
      value={{
        invasions,
        loading,
        isTestMode,
        enableTestMode,
        disableTestMode,
        triggerTestInvasionNotification,
      }}
    >
      {children}
    </InvasionContext.Provider>
  );
};

export const useInvasionContext = () => useContext(InvasionContext);
