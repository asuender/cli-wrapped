import fs from "fs";
import os from "os";
import path from "path";

export type CommandStat = {
  command: string;
  count: number;
};

// Commands to filter out (common noise commands)
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

export const getTopCommands = (limit = 10): CommandStat[] => {
  try {
    const homeDir = os.homedir();
    const shell = process.env["SHELL"] || "";
    let historyFile = "";

    // Determine history file based on shell
    if (shell.includes("zsh")) {
      historyFile = path.join(homeDir, ".zsh_history");
    } else if (shell.includes("bash")) {
      historyFile = path.join(homeDir, ".bash_history");
    } else {
      // Default to bash history
      historyFile = path.join(homeDir, ".bash_history");
    }

    // Check if file exists
    if (!fs.existsSync(historyFile)) {
      return [];
    }

    // Read and parse history file
    const historyContent = fs.readFileSync(historyFile, "utf-8");
    const lines = historyContent.split("\n").filter((line) => line.trim());

    // Count command frequency
    const commandCounts = new Map<string, number>();

    for (const line of lines) {
      let command = line.trim();

      // Handle zsh extended history format: : timestamp:duration;command
      if (command.startsWith(":")) {
        const parts = command.split(";");
        if (parts.length > 1) {
          command = parts.slice(1).join(";").trim();
        }
      }

      // Extract base command (first word), normalize to lowercase for counting
      const baseCommand = command.split(/\s+/)[0]?.toLowerCase();
      if (baseCommand && !IGNORED_COMMANDS.has(baseCommand)) {
        commandCounts.set(
          baseCommand,
          (commandCounts.get(baseCommand) || 0) + 1
        );
      }
    }

    // Convert to array and sort by count
    const sortedCommands = Array.from(commandCounts.entries())
      .map(([command, count]) => ({ command, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return sortedCommands;
  } catch (error) {
    // Return empty array if there's any error reading history
    return [];
  }
};
