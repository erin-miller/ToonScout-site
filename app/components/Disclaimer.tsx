import React from "react";

const Disclaimer: React.FC = () => (
  <div className="disclaimer-text">
    <p>
      ToonScout only stores your Discord User ID, latest toon data, and your
      access token in a secure cookie. If you wish for your data to be removed,
      please contact us at our{" "}
      <a
        href="https://discord.gg/Qb929SrdRP"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:underline"
      >
        support server
      </a>
      .
    </p>
    <p>
      This website and the Discord app are not affiliated with Toontown
      Rewritten.
    </p>
  </div>
);

export default Disclaimer;
