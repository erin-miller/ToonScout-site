import React from "react";
import { TabProps } from "./components/TabComponent";
import AnimatedTabContent from "../../animations/AnimatedTab";

const TasksTab: React.FC<TabProps> = ({ toonData }) => {
  return (
    <AnimatedTabContent>
      <div className="grid grid-rows-2 grid-cols-2">
        <div className="task-container left-task">
          <img src="/images/task.png" alt="Task 1" className="task"></img>
        </div>
        <div className="task-container left-task">
          {" "}
          <img src="/images/task.png" alt="Task 2" className="task"></img>
        </div>
        <div className="task-container right-task">
          {" "}
          <img src="/images/task.png" alt="Task 3" className="task"></img>
        </div>
        <div className="task-container right-task">
          {" "}
          <img src="/images/task.png" alt="Task 4" className="task"></img>
        </div>
      </div>
    </AnimatedTabContent>
  );
};

export default TasksTab;
