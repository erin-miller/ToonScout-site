import React from "react";

interface CommandBoxProps {
  command: {
    title: string;
    description: string;
    color: string;
  };
}

const CommandBox: React.FC<CommandBoxProps> = ({ command }) => (
  <div
    className="bg-gray-100 p-4 md:p-6 rounded-xl shadow-md border border-gray-300"
    style={{ borderColor: command.color }}
  >
    <h3
      className="text-2xl font-semibold font-impress mb-2 md:mb-2"
      style={{ color: command.color }}
    >
      {command.title}
    </h3>
    <p className="text-lg text-gray-600 font-impress mb-2">
      {command.description}
    </p>
  </div>
);

export default CommandBox;
