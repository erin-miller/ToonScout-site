import React from "react";
import { TabProps } from "./components/TabComponent";
import AnimatedTabContent from "../../animations/AnimatedTab";
import { Task, ToonData } from "@/app/types";

const TasksTab: React.FC<TabProps> = ({ toonData }) => {
  // pulled from ToonScout bot
  function getTasks(toonData: ToonData) {
    const toontasks = toonData.data.tasks;
    if (toontasks.length === 0) {
      return [
        {
          title: "",
          progress: "This toon has no tasks right now!",
          reward: "",
        },
      ];
    }

    return toontasks.map((task) => getTaskType(task));
  }

  function getForFun(task: Task) {
    return task.deletable ? ` (Just For Fun)` : ``;
  }

  function getTaskType(task: Task) {
    const progress = task.objective.progress.text;
    const obj = task.objective.text;
    console.log(obj);
    if (obj.includes("Visit") || progress.includes("Complete")) {
      // display npc values for a visit task
      return {
        title: `Visit ${task.to.name} in ${task.to.building}`,
        progress: `${task.to.zone}, ${task.to.neighborhood}`,
        reward: task.reward,
      };
    } else {
      // not a visit task, don't display npc values
      return {
        title: task.objective.text + getForFun(task),
        progress: progress,
        location: task.objective.where,
        reward: task.reward,
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
            className="bg-blue-900 dark:bg-pink-900 absolute inset-0 opacity-25 z-0"
            style={{ width: `${progress}%` }}
          ></div>
          <div className="w-full z-50 ">{text}</div>
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

  const tasks = getTasks(toonData);

  // match game format
  if (tasks.length > 2) {
    [tasks[1], tasks[2]] = [tasks[2], tasks[1]];
  }
  return (
    <AnimatedTabContent>
      <div className="grid grid-rows-2 grid-cols-2 gap-2">
        {tasks.map((task, index) => (
          <div key={index} className="task-container">
            <div className="absolute justify-center items-center pt-52">
              <span className="flex items-center justify-center w-6 h-6 bg-red-500 dark:bg-red-900 rounded-full text-gray-100 text-lg">
                {getIndex(index)}
              </span>
            </div>
            <div className="relative flex flex-row">
              <h3 className="task-title w-full">{task.title}</h3>
            </div>
            <div className="flex flex-col justify-center items-center flex-grow">
              {task.location && (
                <p className="task-location">{task.location}</p>
              )}
              {task.progress && renderProgress(task.progress)}
            </div>
            <div className="mt-auto">
              {task.reward && (
                <p className="task-reward">Reward: {task.reward}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </AnimatedTabContent>
  );
};
export default TasksTab;
