import React, { useState, useEffect } from "react";
import { Box, Text } from "ink";
import os from "os";
import type { SystemData } from "../types.js";

const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
};

const getUptimeMessage = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);

  if (days > 30) {
    return "🔥 Living rent-free in your RAM!";
  }

  if (days > 7) {
    return "💪 Going strong!";
  }

  if (days > 1) {
    return "✨ Fresh and ready!";
  }

  return "⚡ Just getting started!";
};

const formatBytes = (bytes: number): string => {
  const gb = bytes / 1024 / 1024 / 1024;
  return `${gb.toFixed(2)} GB`;
};

const getTerminalName = (): string => {
  const term = process.env["TERM"] || "";
  const termProgram = process.env["TERM_PROGRAM"] || "";

  // Check TERM_PROGRAM first (more specific)
  const programLower = termProgram.toLowerCase();
  if (programLower.includes("ghostty")) return "👻 Ghostty";
  if (programLower.includes("iterm")) return "iTerm2";
  if (programLower.includes("apple_terminal")) return "🍎 Terminal";
  if (programLower.includes("vscode")) return "VS Code";
  if (programLower.includes("hyper")) return "⚡ Hyper";
  if (programLower.includes("warp")) return "🚀 Warp";
  if (programLower.includes("alacritty")) return "Alacritty";
  if (programLower.includes("kitty")) return "🐈 Kitty";
  if (programLower.includes("wezterm")) return "WezTerm";

  // Fall back to TERM variable
  const termLower = term.toLowerCase();
  if (termLower.includes("ghostty")) return "👻 Ghostty";
  if (termLower.includes("kitty")) return "🐈 Kitty";
  if (termLower.includes("alacritty")) return "Alacritty";
  if (termLower.includes("tmux")) return "tmux";
  if (termLower.includes("screen")) return "screen";

  // Generic fallback
  if (term) return `${term}`;
  return "Unknown";
};

export default function SystemInfo() {
  const [data, setData] = useState<SystemData | null>(null);

  useEffect(() => {
    const uptime = os.uptime();
    const totalMem = os.totalmem();
    const usedMem = totalMem - os.freemem();

    setData({
      platform: os.platform(),
      arch: os.arch(),
      shell: process.env["SHELL"] || "Unknown",
      terminal: getTerminalName(),
      username: os.userInfo().username,
      hostname: os.hostname(),
      cpuCount: os.cpus().length,
      cpuModel: os.cpus()[0]?.model || "Unknown",
      totalMem,
      memUsagePercent: ((usedMem / totalMem) * 100).toFixed(1),
      uptimeFormatted: formatUptime(uptime),
      uptimeMessage: getUptimeMessage(uptime),
    });
  }, []);

  if (!data) {
    return null;
  }

  return (
    <Box flexDirection="column" gap={1}>
      {/* System Info Section */}
      <Box flexDirection="column">
        <Text bold color="magenta">
          SYSTEM STATS
        </Text>
        <Box flexDirection="column" marginLeft={2}>
          <Text>
            <Text color="cyan">OS:</Text> {data.platform} ({data.arch})
          </Text>
          <Text>
            <Text color="cyan">Shell:</Text> {data.shell}
          </Text>
          <Text>
            <Text color="cyan">Terminal:</Text> {data.terminal}
          </Text>
        </Box>
      </Box>

      {/* User Info Section */}
      <Box flexDirection="column">
        <Text bold color="yellow">
          WHO ARE YOU?
        </Text>
        <Box flexDirection="column" marginLeft={2}>
          <Text>
            <Text color="cyan">Username:</Text> {data.username}
          </Text>
          <Text>
            <Text color="cyan">Hostname:</Text> {data.hostname}
          </Text>
        </Box>
      </Box>

      {/* Performance Section */}
      <Box flexDirection="column">
        <Text bold color="green">
          POWER LEVEL
        </Text>
        <Box flexDirection="column" marginLeft={2}>
          <Text>
            <Text color="cyan">CPU Cores:</Text> {data.cpuCount} cores of pure
            power
          </Text>
          <Text>
            <Text color="cyan">Processor:</Text> {data.cpuModel}
          </Text>
          <Text>
            <Text color="cyan">RAM:</Text> {formatBytes(data.totalMem)} total (
            {data.memUsagePercent}% flexing)
          </Text>
        </Box>
      </Box>

      {/* Uptime Section */}
      <Box flexDirection="column">
        <Text bold color="blue">
          UPTIME VIBES
        </Text>
        <Box flexDirection="column" marginLeft={2}>
          <Text>
            <Text color="cyan">Running for:</Text> {data.uptimeFormatted}
          </Text>
          <Box marginTop={1}>
            <Text color="white">{data.uptimeMessage}</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
