import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "#/store";
import AgentState from "#/types/AgentState";

enum IndicatorColor {
  BLUE = "bg-blue-500",
  GREEN = "bg-green-500",
  ORANGE = "bg-orange-500",
  YELLOW = "bg-yellow-500",
  RED = "bg-red-500",
  DARK_ORANGE = "bg-orange-800",
}

function AgentStatusBar() {
  const { curAgentState } = useSelector((state: RootState) => state.agent);

  const AgentStatusMap: {
    [key in AgentState]: { message: string; indicator: IndicatorColor };
  } = {
    [AgentState.INIT]: {
      message: "Agent is initializing",
      indicator: IndicatorColor.BLUE,
    },
    [AgentState.RUNNING]: {
      message: "Agent is running",
      indicator: IndicatorColor.GREEN,
    },
    [AgentState.AWAITING_USER_INPUT]: {
      message: "Agent is awaiting user input",
      indicator: IndicatorColor.ORANGE,
    },
    [AgentState.PAUSED]: {
      message: "Agent is paused",
      indicator: IndicatorColor.YELLOW,
    },
    [AgentState.LOADING]: {
      message: "Initializing agent loading",
      indicator: IndicatorColor.DARK_ORANGE,
    },
    [AgentState.STOPPED]: {
      message: "Agent stopped",
      indicator: IndicatorColor.RED,
    },
    [AgentState.FINISHED]: {
      message: "Agent finished",
      indicator: IndicatorColor.GREEN,
    },
    [AgentState.ERROR]: {
      message: "Agent error",
      indicator: IndicatorColor.RED,
    },
  };

  return (
    <div className="flex items-center">
      <div
        className={`w-3 h-3 mr-2 rounded-full animate-pulse ${
          AgentStatusMap[curAgentState].indicator
        }`}
      />
      <span className="text-sm text-stone-400">
        {AgentStatusMap[curAgentState].message}
      </span>
    </div>
  );
}

export default AgentStatusBar;
