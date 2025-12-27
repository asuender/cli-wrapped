import React, { useState } from "react";
import { Box, Text, useApp, useInput } from "ink";
import BigText from "ink-big-text";
import CommandChart from "./components/CommandChart.js";
import SystemInfo from "./components/SystemInfo.js";
import { getTopCommands } from "./history.js";

const tabs = ["Your wrapped", "System Info"];

export default function App() {
  const { exit } = useApp();
  const [activeTab, setActiveTab] = useState(0);

  // Handle keyboard input
  useInput((_input, key) => {
    if (key.tab) {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    }

    if (key.escape) {
      exit();
    }
  });

  const topCommands = getTopCommands(15);

  return (
    <Box flexDirection="column">
      <BigText text="CLI Wrapped" font="shade" />

      {/* Tab Headers */}
      <Box marginTop={1} gap={2}>
        {tabs.map((tab, index) => (
          <Text
            key={tab}
            bold={activeTab === index}
            color={activeTab === index ? "cyan" : "gray"}
            dimColor={activeTab !== index}
          >
            {activeTab === index ? "▶ " : "  "}
            {tab}
          </Text>
        ))}
      </Box>

      <Box marginTop={1} gap={2}>
        <Text color="white">
          Press Tab to switch between tabs and escape to exit.
        </Text>
      </Box>

      {/* Tab Content */}
      <Box marginTop={1}>
        {activeTab === 0 && <CommandChart commands={topCommands} />}
        {activeTab === 1 && <SystemInfo />}
      </Box>
    </Box>
  );
}
