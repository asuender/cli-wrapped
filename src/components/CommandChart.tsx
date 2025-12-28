import React from "react";
import { Box, Text } from "ink";
import type { CommandStat } from "../history.js";

type Props = {
  commands: CommandStat[];
};

export default function CommandChart({ commands }: Props) {
  if (commands.length === 0) {
    return (
      <Box flexDirection="column">
        <Text color="white">No command history found 😢</Text>
        <Text color="white">Try running some commands first!</Text>
      </Box>
    );
  }

  const maxCount = Math.max(...commands.map((c) => c.count));
  const maxBarWidth = 40;

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color="magenta">
        YOUR TOP COMMANDS
      </Text>

      <Box flexDirection="column" marginLeft={2}>
        {commands.map((cmd, index) => {
          const barWidth = Math.ceil((cmd.count / maxCount) * maxBarWidth);
          const bar = "█".repeat(barWidth);
          const color =
            index === 0
              ? "yellow"
              : index === 1
              ? "cyan"
              : index === 2
              ? "magenta"
              : index === 3
              ? "blue"
              : index === 4
              ? "green"
              : "gray";

          const rank = `${index == 0 ? "🏆" : `#${index + 1}`}`.padStart(
            3,
            " "
          );

          return (
            <Box key={cmd.command} flexDirection="row" gap={1}>
              <Text color="white">{rank}</Text>
              <Text>
                <Text color={color}>{bar}</Text>
              </Text>
              <Text bold color={color}>
                {cmd.command}
              </Text>
              <Text color="gray">({cmd.count})</Text>
            </Box>
          );
        })}
      </Box>

      <Box marginTop={1} marginLeft={2}>
        <Text color="white">💡 Keep crushing those commands!</Text>
      </Box>
    </Box>
  );
}
