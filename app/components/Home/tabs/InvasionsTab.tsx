//import from ActiveInvasion.ts and create a simple tab that shows the active invasions for testing
import { TabProps } from "./components/TabComponent";
import AnimatedTabContent from "../../animations/AnimatedTab";
import { useActiveInvasions } from "../../../api/ActiveInvastion";

const InvasionsTab: React.FC<TabProps> = ({ toon }) => {
  const { invasions, loading } = useActiveInvasions();

  return (
    <AnimatedTabContent>
      <div className="flex flex-col gap-2">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : invasions.length > 0 ? (
          invasions.map((invasion) => (
            <div key={invasion.asOf} className="p-2 border rounded-md">
              <h3 className="font-bold">{invasion.cog}</h3>
              <p>District: {invasion.district}</p>
              <p>Progress: {invasion.progress}</p>
              <p>
                Start Time: {new Date(invasion.startTimestamp).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <div>No active invasions</div>
        )}
      </div>
    </AnimatedTabContent>
  );
};

export default InvasionsTab;
