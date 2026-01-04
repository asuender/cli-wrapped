import React from "react";
import { Box, Text } from "ink";
import type { UsageStatsProps } from "../types.js";
import ErrorMessage from "./ErrorMessage.js";
import Heatmap from "./Heatmap.js";
import HourlyChart from "./HourlyChart.js";

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
  const labels: string[] = Array(52).fill("");
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - now.getDay() - 51 * 7);
  const startMonth = startDate.getMonth();
  const interval = 4;
  const remaining = 52 - interval * 12;
  const offset = Math.floor(remaining / 2);

  // Place 12 month labels at a consistent spacing for visual alignment
  for (let i = 0; i < 12; i++) {
    const weekIndex = offset + i * interval;
    const monthIndex = (startMonth + i) % 12;
    labels[weekIndex] = MONTH_NAMES[monthIndex] ?? "";
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
    <Box flexDirection="column" gap={1}>
      <HourlyChart
        hourlyBreakdown={hourlyBreakdown}
        peakHour={peakHour}
        peakHourCount={peakHourCount}
        totalWithTimestamps={totalWithTimestamps}
      />
      <Box flexDirection="row" gap={5}>
        <Heatmap
          title="Weekly Heatmap"
          data={weeklyHeatmap}
          rowLabels={DAYS}
          colLabels={HOURS}
          colLabelInterval={6}
        />
        <Heatmap
          title="Yearly Heatmap"
          data={yearlyHeatmap}
          rowLabels={DAYS}
          colLabels={getWeekLabels()}
          cellWidth={1}
          colLabelWidth={3}
        />
      </Box>
      <Text dimColor>
        Based on {totalWithTimestamps.toLocaleString()} commands with timestamps
      </Text>
    </Box>
  );
}
