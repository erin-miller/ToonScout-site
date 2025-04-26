import React, { useState, useEffect } from "react";
import { TabProps } from "./components/TabComponent";
import AnimatedTabContent from "../../animations/AnimatedTab";
import { Task, StoredToonData } from "@/app/types";
import { FaBell, FaBellSlash } from "react-icons/fa";

const TasksTab: React.FC<TabProps> = ({ toon: toons }) => {
  // Notification bell state
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(
    () => {
      if (typeof window !== "undefined") {
        return JSON.parse(
          localStorage.getItem("tasksTabNotifications") || "false"
        );
      }
      return false;
    }
  );

  // Notification settings
  const [toastEnabled, setToastEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("tasksTabToastEnabled") || "true");
    }
    return true;
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("tasksTabSoundEnabled") || "true");
    }
    return true;
  });

  // New notification settings
  const [toastPersistent, setToastPersistent] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(
        localStorage.getItem("tasksTabToastPersistent") || "false"
      );
    }
    return false;
  });
  const [soundRepeat, setSoundRepeat] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem("tasksTabSoundRepeat") || "1", 10);
    }
    return 1;
  });
  const [soundRepeatInterval, setSoundRepeatInterval] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(
        localStorage.getItem("tasksTabSoundRepeatInterval") || "10",
        10
      );
    }
    return 10;
  });
  const [nativeNotifEnabled, setNativeNotifEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(
        localStorage.getItem("tasksTabNativeNotifEnabled") || "false"
      );
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "tasksTabNotifications",
        JSON.stringify(notificationsEnabled)
      );
      localStorage.setItem(
        "tasksTabToastEnabled",
        JSON.stringify(toastEnabled)
      );
      localStorage.setItem(
        "tasksTabSoundEnabled",
        JSON.stringify(soundEnabled)
      );
      localStorage.setItem(
        "tasksTabToastPersistent",
        JSON.stringify(toastPersistent)
      );
      localStorage.setItem("tasksTabSoundRepeat", soundRepeat.toString());
      localStorage.setItem(
        "tasksTabSoundRepeatInterval",
        soundRepeatInterval.toString()
      );
      localStorage.setItem(
        "tasksTabNativeNotifEnabled",
        JSON.stringify(nativeNotifEnabled)
      );
    }
  }, [
    notificationsEnabled,
    toastEnabled,
    soundEnabled,
    toastPersistent,
    soundRepeat,
    soundRepeatInterval,
    nativeNotifEnabled,
  ]);

  // Request browser notification permission if enabled
  useEffect(() => {
    if (
      nativeNotifEnabled &&
      typeof window !== "undefined" &&
      "Notification" in window
    ) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, [nativeNotifEnabled]);

  // pulled from ToonScout bot
  function getTasks(toons: StoredToonData) {
    const toontasks = toons.data.data.tasks;
    return toontasks.map((task) => getTaskType(task));
  }

  function getTaskType(task: Task) {
    const progress = task.objective.progress.text;
    const obj = task.objective.text;

    if (obj.includes("Visit") || progress.includes("Complete")) {
      // display npc values for a visit task
      return {
        title: `Visit ${task.to.name} in ${task.to.building}`,
        progress: `${task.to.zone}, ${task.to.neighborhood}`,
        reward: task.reward,
        deletable: task.deletable,
      };
    } else {
      // not a visit task, don't display npc values
      return {
        title: task.objective.text,
        progress: progress,
        location: task.objective.where,
        reward: task.reward,
        deletable: task.deletable,
      };
    }
  }

  function renderProgress(text: string) {
    const match = text.match(/^(\d+)\s+of\s+(\d+)/);
    let curr = 0;
    let target = 1;

    if (match) {
      curr = parseInt(match[1], 10);
      target = parseInt(match[2], 10);
    }

    const progress = Math.min((curr / target) * 100, 100);

    if (match) {
      return (
        <div className="task-progress relative z-5 overflow-hidden">
          <div
            className="bg-emerald-700 absolute inset-0 opacity-30 z-0"
            style={{ width: `${progress}%` }}
          ></div>
          <div className="w-full z-50">{text}</div>
        </div>
      );
    } else {
      return <div className="task-location">{text}</div>;
    }
  }

  const getIndex = (index: number) => {
    if (tasks.length > 2 && (index === 1 || index === 2)) {
      return index === 1 ? index + 2 : index;
    }
    return index + 1;
  };

  const tasks = getTasks(toons);

  // match game format
  if (tasks.length > 2) {
    [tasks[1], tasks[2]] = [tasks[2], tasks[1]];
  }

  return (
    <AnimatedTabContent>
      <div className="flex justify-end items-center mb-2 gap-4">
        <button
          className="text-2xl p-2 focus:outline-none"
          title={
            notificationsEnabled
              ? "Disable Notifications"
              : "Enable Notifications"
          }
          onClick={() => {
            setNotificationsEnabled((prev) => !prev);
          }}
        >
          {notificationsEnabled ? (
            <FaBell className="text-yellow-400" />
          ) : (
            <FaBellSlash className="text-gray-400" />
          )}
        </button>
        <div className="flex items-center gap-2 text-base">
          <label>
            <input
              type="checkbox"
              checked={toastEnabled}
              onChange={(e) => setToastEnabled(e.target.checked)}
              className="mr-1"
            />
            Toast
          </label>
          <label>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="mr-1"
            />
            Sound
          </label>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-2 text-base">
        <label>
          <input
            type="checkbox"
            checked={toastPersistent}
            onChange={(e) => setToastPersistent(e.target.checked)}
            className="mr-1"
          />
          Toast requires manual dismiss (X)
        </label>
        <label>
          Sound:
          <select
            value={soundRepeat}
            onChange={(e) => setSoundRepeat(Number(e.target.value))}
            className="ml-2 px-1 rounded"
          >
            <option value={1}>Once</option>
            <option value={3}>Repeat 3 times</option>
            <option value={5}>Repeat 5 times</option>
            <option value={-1}>
              Repeat every X seconds while invasion is present
            </option>
          </select>
          {soundRepeat === -1 && (
            <>
              , every
              <input
                type="number"
                min={2}
                max={60}
                value={soundRepeatInterval}
                onChange={(e) => setSoundRepeatInterval(Number(e.target.value))}
                className="ml-2 w-12 px-1 rounded"
              />
              seconds while invasion is present
            </>
          )}
        </label>
        <label>
          <input
            type="checkbox"
            checked={nativeNotifEnabled}
            onChange={(e) => setNativeNotifEnabled(e.target.checked)}
            className="mr-1"
          />
          Enable browser notifications
        </label>
      </div>
      <div className="grid md:grid-rows-2 md:grid-cols-2 grid-rows-4">
        {tasks.map((task, index) => (
          <div key={index} className="task-container">
            <img src="/images/task.png" className="task-size" />
            <div className="flex flex-col absolute justify-center items-center text-center task-size px-6 pb-8 xl:pb-10">
              <span className="absolute inset-0 mt-2 2xl:mt-4 font-semibold font-minnie text-gray-1200 text-sm sm:text-xl 2xl:text-2xl">
                TOONTASK
              </span>

              {task.deletable && (
                <span className="hidden 2xl:flex absolute inset-0 font-semibold text-blue-900 -rotate-[25deg] translate-x-[70px] translate-y-[-40px]">
                  Just for fun!
                </span>
              )}
              <div className="flex absolute top-4 left-4 justify-center items-center">
                <span
                  className="hidden 2xl:flex items-center justify-center w-8 h-8 border-4 shadow-lg
                bg-red-500 border-red-600 rounded-full text-gray-100 
                xl:text-lg mt-12 mx-6"
                >
                  {getIndex(index)}
                </span>
              </div>
              <h3 className="task-title">{task.title}</h3>
              <div className="flex flex-col justify-center items-center flex-grow">
                {task.location && (
                  <p className="task-location">{task.location}</p>
                )}
                {task.progress && renderProgress(task.progress)}
              </div>
              <div className="mt-auto px-2">
                {task.reward && (
                  <p className="task-reward">Reward: {task.reward}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AnimatedTabContent>
  );
};
export default TasksTab;
