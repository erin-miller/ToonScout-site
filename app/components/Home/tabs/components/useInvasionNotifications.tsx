"use client";

import { useEffect, useRef, useState } from "react";
import { useInvasionContext } from "@/app/context/InvasionContext";
import { useToonContext } from "@/app/context/ToonContext";
import { getRelevantInvasionsForTasks } from "./utils";
import Toast from "@/app/components/Toast";

export function useInvasionNotifications() {
  const { invasions } = useInvasionContext();
  const { toons, activeIndex } = useToonContext();
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const prevRelevant = useRef<string[]>([]);

  // Read notification settings from localStorage
  const notificationsEnabled =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("tasksTabNotifications") || "false")
      : false;
  const toastEnabled =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("tasksTabToastEnabled") || "true")
      : true;
  const soundEnabled =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("tasksTabSoundEnabled") || "true")
      : true;

  useEffect(() => {
    if (!notificationsEnabled || !toons[activeIndex]) return;
    const tasks = toons[activeIndex].data.data.tasks;
    const relevant = getRelevantInvasionsForTasks(tasks, invasions);
    const relevantCogs = relevant.map((i) => i.cog);
    // Find new relevant invasions
    const newCogs = relevantCogs.filter(
      (cog) => !prevRelevant.current.includes(cog)
    );
    if (newCogs.length > 0) {
      if (toastEnabled) {
        setToastMsg(`Relevant invasion: ${newCogs.join(", ")}`);
        setShowToast(true);
      }
      if (soundEnabled) {
        const audio = new Audio("/sounds/notify.mp3");
        audio.play();
      }
    }
    prevRelevant.current = relevantCogs;
  }, [
    invasions,
    toons,
    activeIndex,
    notificationsEnabled,
    toastEnabled,
    soundEnabled,
  ]);

  // Expose a manual trigger for testing
  function triggerTestToast(cogName = "Back Stabber") {
    setToastMsg(`Relevant invasion: ${cogName}`);
    setShowToast(true);
    const audio = new Audio("/sounds/notify.mp3");
    audio.play();
  }

  const toast = (
    <Toast
      message={toastMsg}
      show={showToast}
      onClose={() => setShowToast(false)}
    />
  );
  return { toast, triggerTestToast };
}
