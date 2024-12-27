import React, { useEffect, useState } from "react";
import { TabProps } from "../TabContainer/TabComponent";
import { findSuit, getSuitName, hasNoSuit } from "../TabContainer/utils";
import AnimatedTabContent from "../animations/AnimatedTab";

interface PromotionPath {
  path: Array<string>;
  total: number;
}

const deptChars = {
  sellbot: "s",
  cashbot: "m",
  lawbot: "l",
  bossbot: "c",
};

const SuitTab: React.FC<TabProps> = ({ toonData }) => {
  if (hasNoSuit(toonData)) {
    return null;
  }

  const first = findSuit(toonData);
  const [dept, setDept] = useState(first ? first : "s");
  const [promo, setPromo] = useState<PromotionPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [suit, setSuit] = useState(toonData.cogsuits[dept]);

  useEffect(() => {
    const updateDept = () => {
      const avail = Object.keys(toonData.cogsuits);
      const currAvail = avail.includes(dept);

      if (!currAvail || !toonData.cogsuits[dept]?.hasDisguise) {
        const firstAvail = avail.find(
          (department) => toonData.cogsuits[department]?.hasDisguise
        );
        if (firstAvail) {
          setDept(firstAvail);
        }
      }
    };

    updateDept();

    const getPromo = async () => {
      const response = await fetch("http://localhost:3001/get-promo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ toonData, dept }),
      });

      if (!response.ok) {
        return "Error loading promo data. Please try again later.";
      }
      const data = await response.json();
      setPromo(data);
      setLoading(false);
    };

    if (toonData.cogsuits[dept]?.hasDisguise) {
      getPromo();
    }
  }, [toonData, dept]);

  const sortPath = () => {
    if (!promo || !suit || suit.promotion.current >= suit.promotion.target)
      return [];
    const counts = promo.path.reduce((acc, activity) => {
      acc[activity] = (acc[activity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([activity, count]) => ({
      activity,
      count,
    }));
  };

  const getPromo = () => {
    const path = sortPath();

    return path.map((entry, index) => (
      <div key={index} className="promo-item">
        <div className="promo-count">{entry.count} </div>
        <div className="promo-activity">{entry.activity}</div>
      </div>
    ));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AnimatedTabContent>
      <div className="tab-suit-container">
        <div className="dept-container">
          <button
            onClick={() => setDept(deptChars.sellbot)}
            className="suit-btn"
            aria-selected={dept === deptChars.sellbot}
            disabled={!toonData.cogsuits[deptChars.sellbot]?.hasDisguise}
          >
            <img src="/images/emblem_sell.png" className="dept-photo" />
          </button>
          <button
            onClick={() => setDept(deptChars.cashbot)}
            className="suit-btn"
            aria-selected={dept === deptChars.cashbot}
            disabled={!toonData.cogsuits[deptChars.cashbot]?.hasDisguise}
          >
            <img src="/images/emblem_cash.png" className="dept-photo" />
          </button>
          <button
            onClick={() => setDept(deptChars.lawbot)}
            className="suit-btn"
            aria-selected={dept === deptChars.lawbot}
            disabled={!toonData.cogsuits[deptChars.lawbot]?.hasDisguise}
          >
            <img src="/images/emblem_law.png" className="dept-photo" />
          </button>
          <button
            onClick={() => setDept(deptChars.bossbot)}
            className="suit-btn"
            aria-selected={dept === deptChars.bossbot}
            disabled={!toonData.cogsuits[deptChars.bossbot]?.hasDisguise}
          >
            <img src="/images/emblem_boss.png" className="dept-photo" />
          </button>
        </div>
        <div className="suit-container">
          <div className="suit-overview">
            <div className="w-1/2 text-4xl text-left">
              {getSuitName(toonData, dept)}
            </div>
            <div className="w-1/5 text-4xl text-left">
              {suit ? `Level ${suit.level}` : "No suit available"}
            </div>
            <div className="w-1/3 text-4xl text-right">
              {suit
                ? `${suit.promotion.current} / ${suit.promotion.target}`
                : "No suit available"}
            </div>
          </div>
          <div className="promo-rec">
            <div className="font-minnie text-4xl pb-5 pt-1">
              Recommended Activities
            </div>
            <div className="flex-1 flex-grow">
              {suit?.promotion.current >= suit?.promotion.target ? (
                <div>Ready for promotion!</div>
              ) : promo ? (
                getPromo()
              ) : (
                <div>Loading...</div>
              )}
            </div>
            <div className="footer pb-2 text-2xl text-center">
              <div className="inline">
                {suit?.promotion.current < suit?.promotion.target &&
                  `Estimated Total: ${promo?.total}`}
              </div>
              <div className="inline">
                {promo &&
                suit?.promotion.target - suit?.promotion.current <
                  promo.total ? (
                  <div>
                    Remaining Needed:{" "}
                    {suit?.promotion.target - suit?.promotion.current}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedTabContent>
  );
};

export default SuitTab;
