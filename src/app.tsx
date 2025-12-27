import React, { useState, useEffect } from "react";
import { Box, Text, useApp, useInput } from "ink";
import BigText from "ink-big-text";
import Spinner from "ink-spinner";
import CommandChart from "./components/CommandChart.js";
import SystemInfo from "./components/SystemInfo.js";
import { getTopCommands, CommandStat } from "./history.js";

const tabs = ["Your wrapped", "System Info"];

export default function App() {
  const { exit } = useApp();
  const [activeTab, setActiveTab] = useState(0);
  const [topCommands, setTopCommands] = useState<CommandStat[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTopCommands(15)
      .then(setTopCommands)
      .catch((error) =>
        setError(error.message ?? "Failed to retrieve top commands.")
      );
  }, []);

  useInput((_input, key) => {
    if (key.tab) {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    }

    if (key.escape) {
      exit();
    }
  });

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
          Press Tab to switch between tabs, Escape to exit.
        </Text>
      </Box>

      {/* Tab Content */}
      <Box marginTop={1}>
        {activeTab === 0 &&
          (error ? (
            <Box width={60}>
              <Text color="red">Error: {error}</Text>
            </Box>
          ) : topCommands ? (
            <CommandChart commands={topCommands} />
          ) : (
            <Text>
              <Text color="cyan">
                <Spinner type="dots" />
              </Text>
              {" Loading command history..."}
            </Text>
          ))}
        {activeTab === 1 && <SystemInfo />}
      </Box>
    </Box>
  );
}
