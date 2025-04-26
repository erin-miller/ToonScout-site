"use client";

import { useEffect, useRef, useState } from "react";
import { useInvasionContext } from "@/app/context/InvasionContext";
import { useToonContext } from "@/app/context/ToonContext";
import { getRelevantInvasionsForTasks } from "./utils";
import Toast from "@/app/components/Toast";

// Type for custom invasion notification events
interface InvasionNotificationEvent extends CustomEvent {
  detail: {
    message: string;
    invasions: any[];
    showToast: boolean;
    playSound: boolean;
  };
}

export function useInvasionNotifications({
  notificationsEnabled,
  toastEnabled,
  soundEnabled,
  toastPersistent,
  soundRepeat,
  soundRepeatInterval,
  nativeNotifEnabled,
}: {
  notificationsEnabled: boolean;
  toastEnabled: boolean;
  soundEnabled: boolean;
  toastPersistent: boolean;
  soundRepeat: number;
  soundRepeatInterval: number;
  nativeNotifEnabled: boolean;
}) {
  const { invasions } = useInvasionContext();
  const { toons, activeIndex } = useToonContext();
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const prevRelevantKeys = useRef<string[]>([]);
  const [dismissedCogs, setDismissedCogs] = useState<string[]>([]);
  const [activeCogs, setActiveCogs] = useState<string[]>([]);
  const soundIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Helper: clear sound interval
  function clearSoundInterval() {
    if (soundIntervalRef.current) {
      clearInterval(soundIntervalRef.current);
      soundIntervalRef.current = null;
    }
  }

  // Effect: update notification settings reactively
  useEffect(() => {
    // No-op, but ensures this hook re-runs when settings change
  }, [
    notificationsEnabled,
    toastEnabled,
    soundEnabled,
    toastPersistent,
    soundRepeat,
    soundRepeatInterval,
    nativeNotifEnabled,
  ]);

  // Listen for custom invasion notification events (works across all tabs)
  useEffect(() => {
    const handleInvasionNotification = (event: InvasionNotificationEvent) => {
      if (!notificationsEnabled) return;
      const {
        message,
        showToast: shouldShowToast,
        playSound,
        invasions: eventInvasions,
      } = event.detail;
      // Deduplicate by cog+district key for all notifications
      if (Array.isArray(eventInvasions) && eventInvasions.length > 0) {
        const sanitizeCogName = (name: string) =>
          name.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
        const keys = eventInvasions.map(
          (i) => `${sanitizeCogName(i.cog)}|${i.district}`
        );
        const newKeys = keys.filter(
          (key) => !prevRelevantKeys.current.includes(key)
        );
        if (newKeys.length === 0) return; // Already notified
        prevRelevantKeys.current = [...prevRelevantKeys.current, ...newKeys];
        // Compose message with cog and district(s)
        const cogDistricts = eventInvasions.map(
          (i) => `${sanitizeCogName(i.cog)} in ${i.district}`
        );
        const fullMsg = `Relevant invasion: ${cogDistricts.join(", ")}`;
        if (shouldShowToast) {
          setToastMsg(fullMsg);
          setShowToast(true);
        }
        if (playSound) {
          let played = 0;
          const playAudio = () => {
            const audio = new Audio("/sounds/notify.mp3");
            audio
              .play()
              .catch((err) =>
                console.error("Error playing notification sound:", err)
              );
            played++;
            if (played < soundRepeat) {
              setTimeout(playAudio, soundRepeatInterval * 1000);
            }
          };
          playAudio();
        }
        if (
          nativeNotifEnabled &&
          typeof window !== "undefined" &&
          "Notification" in window
        ) {
          if (Notification.permission === "granted") {
            new Notification("ToonScout Invasion Alert", { body: fullMsg });
          }
        }
        return;
      }
      if (shouldShowToast) {
        setToastMsg(message);
        setShowToast(true);
      }
      if (playSound) {
        let played = 0;
        const playAudio = () => {
          const audio = new Audio("/sounds/notify.mp3");
          audio
            .play()
            .catch((err) =>
              console.error("Error playing notification sound:", err)
            );
          played++;
          if (played < soundRepeat) {
            setTimeout(playAudio, soundRepeatInterval * 1000);
          }
        };
        playAudio();
      }
      if (
        nativeNotifEnabled &&
        typeof window !== "undefined" &&
        "Notification" in window
      ) {
        if (Notification.permission === "granted") {
          new Notification("ToonScout Invasion Alert", { body: message });
        }
      }
    };

    // Add event listener for custom invasion notifications
    window.addEventListener(
      "invasionNotification",
      handleInvasionNotification as EventListener
    );

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener(
        "invasionNotification",
        handleInvasionNotification as EventListener
      );
    };
  }, []);

  // Effect: handle relevant invasions and notifications
  useEffect(() => {
    if (!notificationsEnabled || !toons[activeIndex]) {
      clearSoundInterval();
      return;
    }
    const tasks = toons[activeIndex].data.data.tasks;
    const relevant = getRelevantInvasionsForTasks(tasks, invasions);
    // Use cog+district as unique key
    const sanitizeCogName = (name: string) =>
      name.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
    const relevantKeys = relevant.map(
      (i) => `${sanitizeCogName(i.cog)}|${i.district}`
    );
    setActiveCogs(relevant.map((i) => sanitizeCogName(i.cog)));

    // Find new relevant invasions (not previously active or dismissed)
    const newKeys = relevantKeys.filter(
      (key) =>
        !prevRelevantKeys.current.includes(key) &&
        !dismissedCogs.includes(key.split("|")[0])
    );
    const newCogDistricts = newKeys.map((key) => {
      const [cog, district] = key.split("|");
      return `${cog} in ${district}`;
    });

    // Sound repeat every X seconds while invasion is present
    if (soundEnabled && soundRepeat === -1 && relevantKeys.length > 0) {
      if (!soundIntervalRef.current) {
        soundIntervalRef.current = setInterval(() => {
          const audio = new Audio("/sounds/notify.mp3");
          audio.play().catch(() => {});
        }, soundRepeatInterval * 1000);
        // Play immediately on first detection
        const audio = new Audio("/sounds/notify.mp3");
        audio.play().catch(() => {});
      }
    } else {
      clearSoundInterval();
    }

    if (newKeys.length > 0) {
      if (toastEnabled) {
        setToastMsg(`Relevant invasion: ${newCogDistricts.join(", ")}`);
        setShowToast(true);
      }
      if (soundEnabled && soundRepeat !== -1) {
        let played = 0;
        const playAudio = () => {
          const audio = new Audio("/sounds/notify.mp3");
          audio.play().catch(() => {});
          played++;
          if (played < soundRepeat) {
            setTimeout(playAudio, soundRepeatInterval * 1000);
          }
        };
        playAudio();
      }
      if (
        nativeNotifEnabled &&
        typeof window !== "undefined" &&
        "Notification" in window
      ) {
        if (Notification.permission === "granted") {
          new Notification("ToonScout Invasion Alert", {
            body: `Relevant invasion: ${newCogDistricts.join(", ")}`,
          });
        }
      }
    }

    // If a relevant invasion is no longer present, clear toast and sound
    const goneKeys = prevRelevantKeys.current.filter(
      (key) => !relevantKeys.includes(key)
    );
    if (goneKeys.length > 0 || relevantKeys.length === 0) {
      setShowToast(false);
      clearSoundInterval();
      setDismissedCogs((prev) =>
        prev.filter((cog) => !goneKeys.some((key) => key.startsWith(cog + "|")))
      );
    }

    prevRelevantKeys.current = relevantKeys;
  }, [
    invasions,
    toons,
    activeIndex,
    notificationsEnabled,
    toastEnabled,
    soundEnabled,
    soundRepeat,
    soundRepeatInterval,
    nativeNotifEnabled,
    toastPersistent,
  ]);

  // Manual dismiss handler for toast
  function handleToastDismiss() {
    setShowToast(false);
    // Mark all currently active cogs as dismissed
    setDismissedCogs((prev) => Array.from(new Set([...prev, ...activeCogs])));
    clearSoundInterval();
  }

  // Expose a manual trigger for testing
  function triggerTestToast(
    cogName = "Back Stabber",
    districtName = "Toontown Central"
  ) {
    const sanitizeCogName = (name: string) =>
      name.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
    setToastMsg(
      `Relevant invasion: ${sanitizeCogName(cogName)} in ${districtName}`
    );
    setShowToast(true);
    let played = 0;
    const playAudio = () => {
      const audio = new Audio("/sounds/notify.mp3");
      audio.play().catch(() => {});
      played++;
      if (played < soundRepeat) {
        setTimeout(playAudio, soundRepeatInterval * 1000);
      }
    };
    playAudio();
    if (
      nativeNotifEnabled &&
      typeof window !== "undefined" &&
      "Notification" in window
    ) {
      if (Notification.permission === "granted") {
        new Notification("ToonScout Invasion Alert", {
          body: `Relevant invasion: ${sanitizeCogName(
            cogName
          )} in ${districtName}`,
        });
      }
    }
  }

  const toast = (
    <Toast
      message={toastMsg}
      show={showToast}
      onClose={handleToastDismiss}
      persistent={toastPersistent || true} // Always persistent for relevant invasions
    />
  );
  return { toast, triggerTestToast };
}
