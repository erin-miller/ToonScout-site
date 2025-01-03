import React from "react";
import Disclaimer from "./Disclaimer";
import TabContainer from "../TabContainer/TabComponent";
import "../../styles/home.css";
import ThemeToggle from "../Theme";

const Home = () => {
  return (
    <div className="card-container">
      <div className="home-card">
        <div className="relative flex flex-row justify-center items-center">
          <h2 className="text-4xl minnie-title dark:text-gray-100 w-full text-center">
            Welcome to ToonScout!
          </h2>
          <div className="absolute right-0">
            <ThemeToggle />
          </div>
        </div>
        <p>
          <a
            href="https://discord.com/oauth2/authorize?client_id=1286517155315322950"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="add-btn">Add ToonScout on Discord</button>
          </a>
          <span className="text-block pt-6">
            This page needs to stay in the background to continue receiving
            real-time information.
          </span>
          <span className="text-block">
            If you close it, you can still access your last saved data any time
            on Discord.
          </span>
        </p>

        <TabContainer />

        <Disclaimer />
      </div>
    </div>
  );
};

export default Home;
