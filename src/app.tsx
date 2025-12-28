import React, { useState, useEffect } from "react";
import { Box, Text, useApp, useInput } from "ink";
import BigText from "ink-big-text";
import Spinner from "ink-spinner";
import CommandChart from "./components/CommandChart.js";
import SystemInfo from "./components/SystemInfo.js";
import UsageStats from "./components/UsageStats.js";
import { getHistoryStats } from "./history.js";
import { HistoryStats } from "./types.js";

const tabs = ["Your wrapped", "Activity Breakdown", "System Info"];

export default function App() {
  const { exit } = useApp();
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHistoryStats(15)
      .then(setStats)
      .catch((error) =>
        setError(error.message ?? "Failed to retrieve history stats.")
      );
  }, []);

  useInput((_input, key) => {
    if (key.tab || key.rightArrow) {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    }

    if (key.leftArrow) {
      setActiveTab((prev) => (prev <= 0 ? tabs.length - 1 : prev - 1));
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
          Press Tab or arrow keys to navigate, Escape to exit.
        </Text>
      </Box>

      {/* Tab Content */}
      <Box marginTop={1}>
        {error ? (
          <Box width={60}>
            <Text color="red">Error: {error}</Text>
          </Box>
        ) : !stats ? (
          <Text>
            <Text color="cyan">
              <Spinner type="dots" />
            </Text>
            {" Loading history..."}
          </Text>
        ) : (
          <>
            {activeTab === 0 && <CommandChart commands={stats.topCommands} />}
            {activeTab === 1 && <UsageStats stats={stats.usageStats} />}
            {activeTab === 2 && <SystemInfo />}
          </>
        )}
      </Box>
    </Box>
  );
}
