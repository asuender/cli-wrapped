import fs from "fs/promises";
import os from "os";
import path from "path";
import { parse as parseYAML } from "yaml";
import type { Command, FishHistoryEntry, HistoryStats } from "./types.js";

const IGNORED_COMMANDS = new Set([
  "clear",
  "cd",
  "ls",
  "pwd",
  "exit",
  "echo",
  "history",
  "l",
  "ll",
  "la",
  "git",
]);

function parseZsh(content: string): Command[] {
  const commands: Command[] = [];
  const lines = content.split("\n").filter((line) => line.trim());

  for (const line of lines) {
    const trimmed = line.trim();

    // zsh extended history format: : timestamp:duration;command
    if (trimmed.startsWith(":")) {
      const match = trimmed.match(/^: (\d+):\d+;(.*)$/);
      if (match && match[1] && match[2]) {
        commands.push({
          command: match[2].trim(),
          timestamp: parseInt(match[1], 10),
        });
      }
    } else {
      // Plain command without timestamp
      commands.push({ command: trimmed, timestamp: null });
    }
  }

  return commands;
}

function parseBash(content: string): Command[] {
  const commands: Command[] = [];
  const lines = content.split("\n").filter((line) => line.trim());

  for (const line of lines) {
    // Bash history doesn't include timestamps by default
    commands.push({ command: line.trim(), timestamp: null });
  }

  return commands;
}

function parseFish(content: string): Command[] {
  const parsed = parseYAML(content) as FishHistoryEntry[] | null;

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .filter((entry) => entry && typeof entry.cmd === "string")
    .map((entry) => ({
      command: entry.cmd,
      timestamp: entry.when ?? null,
    }));
}

async function getCommands(): Promise<Command[]> {
  const homeDir = os.homedir();
  const shell = process.env["SHELL"] || "";
  let historyFile = "";
  let parser: (content: string) => Command[];

  // Determine history file and parser based on shell
  if (shell.includes("zsh")) {
    historyFile = path.join(homeDir, ".zsh_history");
    parser = parseZsh;
  } else if (shell.includes("bash")) {
    historyFile = path.join(homeDir, ".bash_history");
    parser = parseBash;
  } else if (shell.includes("fish")) {
    historyFile = path.join(homeDir, ".local/share/fish/fish_history");
    parser = parseFish;
  } else {
    throw new Error(
      "You're likely using a shell other than 'bash', 'zsh' and 'fish'. " +
        "If that's the case, reach out by creating an issue to add support for your shell."
    );
  }

  try {
    await fs.access(historyFile);
    const historyContent = await fs.readFile(historyFile, "utf-8");

    return parser(historyContent);
  } catch {
    throw new Error(
      "Could not read the history file. It either does not exist or" +
        "you don't have the permissions to read it."
    );
  }
}

export const getHistoryStats = async (limit = 10): Promise<HistoryStats> => {
  const commands = await getCommands();

  // Count command frequency
  const commandCounts = new Map<string, number>();
  for (const { command } of commands) {
    const baseCommand = command.split(/\s+/)[0]?.toLowerCase();
    if (baseCommand && !IGNORED_COMMANDS.has(baseCommand)) {
      commandCounts.set(baseCommand, (commandCounts.get(baseCommand) || 0) + 1);
    }
  }

  const topCommands = Array.from(commandCounts.entries())
    .map(([command, count]) => ({ command, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  // Count commands by hour
  const hourCounts = new Map<number, number>();
  let totalWithTimestamps = 0;

  for (const { timestamp } of commands) {
    if (timestamp !== null) {
      totalWithTimestamps++;
      const hour = new Date(timestamp * 1000).getHours();
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    }
  }

  // Find peak hour
  let peakHour: number | null = null;
  let peakHourCount = 0;

  for (const [hour, count] of hourCounts) {
    if (count > peakHourCount) {
      peakHour = hour;
      peakHourCount = count;
    }
  }

  const hourlyBreakdown = Array.from(
    { length: 24 },
    (_, i) => hourCounts.get(i) || 0
  );

  return {
    topCommands,
    usageStats: {
      peakHour,
      peakHourCount,
      totalWithTimestamps,
      hourlyBreakdown,
    },
  };
};
