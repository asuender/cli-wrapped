import React from "react";
import { Box, Text } from "ink";
import { UsageStats as UsageStatsType } from "../history.js";

type Props = {
  stats: UsageStatsType;
};

const BAR_CHARS = [" ", "▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];
const CHART_HEIGHT = 4;

function formatHour(hour: number): string {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

type ChartProps = {
  hourlyBreakdown: number[];
  peakHour: number | null;
  peakHourCount: number;
  totalWithTimestamps: number;
};

function HourlyChart(chartProps: ChartProps) {
  const { hourlyBreakdown, peakHour, peakHourCount, totalWithTimestamps } =
    chartProps;

  const max = Math.max(...hourlyBreakdown);
  if (max === 0) return null;

  // Normalize values to total height (CHART_HEIGHT rows × 8 levels per row)
  const totalLevels = CHART_HEIGHT * 8;
  const normalized = hourlyBreakdown.map((count) =>
    Math.round((count / max) * totalLevels)
  );

  // Build rows from top to bottom
  const rows: string[] = [];
  for (let row = CHART_HEIGHT - 1; row >= 0; row--) {
    const rowChars = normalized.map((level) => {
      const rowBase = row * 8;
      const inThisRow = Math.max(0, Math.min(8, level - rowBase));
      return (BAR_CHARS[inThisRow] ?? " ").repeat(2);
    });
    rows.push(rowChars.join(""));
  }

  // Build peak label row
  const peakLabel = peakHourCount.toLocaleString();
  let labelRow = "";
  if (peakHour !== null) {
    const peakPos = peakHour * 2;
    const labelStart = Math.max(0, peakPos - Math.floor(peakLabel.length / 2));
    labelRow = " ".repeat(labelStart) + peakLabel;
  }

  return (
    <Box flexDirection="column">
      {peakHour !== null && <Text color="green">{labelRow}</Text>}
      <Box flexDirection="column">
        {rows.map((row, i) => (
          <Text key={i} color="cyan">
            {row}
          </Text>
        ))}
      </Box>
      <Box justifyContent="space-between">
        <Text dimColor>{formatHour(0)}</Text>
        <Text dimColor>{formatHour(24)}</Text>
      </Box>
      <Box marginTop={1} flexDirection="column">
        {peakHour !== null && (
          <Box gap={1}>
            <Text dimColor>Your peak hour: </Text>
            <Text color="green">{formatHour(peakHour)}</Text>
          </Box>
        )}
        <Text dimColor>
          Based on {totalWithTimestamps.toLocaleString()} commands with
          timestamps
        </Text>
      </Box>
    </Box>
  );
}

export default function UsageStats({ stats }: Props) {
  const { peakHour, peakHourCount, totalWithTimestamps, hourlyBreakdown } =
    stats;

  if (totalWithTimestamps === 0) {
    return (
      <Box flexDirection="column">
        <Text color="yellow">
          No timestamp data available in your shell history.
        </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">
        Hourly Activity
      </Text>
      <HourlyChart
        hourlyBreakdown={hourlyBreakdown}
        peakHour={peakHour}
        peakHourCount={peakHourCount}
        totalWithTimestamps={totalWithTimestamps}
      />
    </Box>
  );
}
