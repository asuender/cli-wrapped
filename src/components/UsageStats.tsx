import React from "react";
import { Box, Text } from "ink";
import type { UsageStatsProps, HourlyChartProps } from "../types.js";
import ErrorMessage from "./ErrorMessage.js";
import Heatmap from "./Heatmap.js";

const BAR_CHARS = [" ", "▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];
const CHART_WIDTH = 2;
const CHART_HEIGHT = 4;

function formatHour(hour: number): string {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function HourlyChart(chartProps: HourlyChartProps) {
  const { hourlyBreakdown, peakHour, peakHourCount, totalWithTimestamps } =
    chartProps;

  const max = Math.max(...hourlyBreakdown);
  if (max === 0) {
    return <ErrorMessage message="No hourly data available to display." />;
  }

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
      return (BAR_CHARS[inThisRow] ?? " ").repeat(CHART_WIDTH);
    });
    rows.push(rowChars.join(""));
  }

  // Build peak label row
  const peakLabel = peakHourCount.toLocaleString();
  let labelRow = "";
  if (peakHour !== null) {
    const peakPos = peakHour * CHART_WIDTH;
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

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => String(i));
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getWeekLabels(): string[] {
  const labels: string[] = [];
  const now = new Date();
  // Start from 51 weeks ago
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - now.getDay() - 51 * 7);

  let lastMonth = -1;
  for (let i = 0; i < 52; i++) {
    const weekDate = new Date(startDate);
    weekDate.setDate(startDate.getDate() + i * 7);
    const month = weekDate.getMonth();
    if (month !== lastMonth) {
      labels.push(MONTH_NAMES[month] ?? "");
      lastMonth = month;
    } else {
      labels.push("");
    }
  }
  return labels;
}

export default function UsageStats({ stats }: UsageStatsProps) {
  const {
    peakHour,
    peakHourCount,
    totalWithTimestamps,
    hourlyBreakdown,
    weeklyHeatmap,
    yearlyHeatmap,
  } = stats;

  if (totalWithTimestamps === 0) {
    return (
      <ErrorMessage
        message="No timestamp data available in your shell history."
        subtext="Your shell may not record timestamps by default."
      />
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
      <Heatmap
        title="Weekly Heatmap"
        data={weeklyHeatmap}
        rowLabels={DAYS}
        colLabels={HOURS}
        colLabelInterval={6}
        showLegend={false}
      />
      <Heatmap
        title="Yearly Heatmap"
        data={yearlyHeatmap}
        rowLabels={DAYS}
        colLabels={getWeekLabels()}
        cellWidth={1}
      />
    </Box>
  );
}
