import fs from "fs/promises";
import os from "os";
import path from "path";

export type CommandStat = {
  command: string;
  count: number;
};

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

export const getTopCommands = async (limit = 10): Promise<CommandStat[]> => {
  const homeDir = os.homedir();
  const shell = process.env["SHELL"] || "";
  let historyFile = "";

  // Determine history file based on shell
  if (shell.includes("zsh")) {
    historyFile = path.join(homeDir, ".zsh_history");
  } else if (shell.includes("bash")) {
    historyFile = path.join(homeDir, ".bash_history");
  } else {
    throw new Error(
      "You're likely using a shell other than 'bash', 'zsh' and 'fish'. " +
        "If that's the case, reach out by creating an issue to add support for your shell."
    );
  }

  try {
    await fs.access(historyFile);
  } catch {
    throw new Error(
      "Could not read the history file. It either does not exist or" +
        "commands are stored elsewhere."
    );
  }

  // Read and parse history file
  const historyContent = await fs.readFile(historyFile, "utf-8");
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
      commandCounts.set(baseCommand, (commandCounts.get(baseCommand) || 0) + 1);
    }
  }

  const sortedCommands = Array.from(commandCounts.entries())
    .map(([command, count]) => ({ command, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return sortedCommands;
};
