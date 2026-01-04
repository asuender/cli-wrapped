import React from "react";
import { Box, Text } from "ink";
import type { HeatmapProps } from "../types.js";
import ErrorMessage from "./ErrorMessage.js";

const INTENSITY_CHARS = ["░", "▒", "▓", "█"];
const EMPTY_CHAR = "·";

function getIntensityChar(value: number, max: number): string {
  if (max === 0 || value === 0) return EMPTY_CHAR;
  const normalized = Math.ceil((value / max) * INTENSITY_CHARS.length);
  return (
    INTENSITY_CHARS[Math.min(normalized, INTENSITY_CHARS.length) - 1] ??
    EMPTY_CHAR
  );
}

function buildHeaderRow(
  colLabels: string[],
  cellWidth: number,
  labelWidth: number,
  colLabelInterval: number
): string {
  const hasLabel = (index: number): boolean => {
    const label = colLabels[index] ?? "";
    return (
      label.length > 0 &&
      (colLabelInterval === 1 || index % colLabelInterval === 0)
    );
  };

  const formatLabel = (label: string): string =>
    label.slice(0, labelWidth).padStart(labelWidth, " ");

  const totalWidth = colLabels.length * cellWidth;
  const buffer = Array.from({ length: totalWidth }, () => " ");

  for (let i = 0; i < colLabels.length; i++) {
    if (!hasLabel(i)) continue;
    const label = formatLabel(colLabels[i] ?? "");
    const start = i * cellWidth;
    for (let j = 0; j < label.length && start + j < totalWidth; j++) {
      buffer[start + j] = label[j] ?? " ";
    }
  }

  return buffer.join("");
}

export default function Heatmap({
  title,
  data,
  rowLabels,
  colLabels,
  colLabelInterval = 1,
  cellWidth = 2,
  colLabelWidth,
  showLegend = true,
}: HeatmapProps) {
  const flatData = data.flat();
  const max = flatData.length > 0 ? Math.max(...flatData) : 0;

  if (max === 0) {
    return <ErrorMessage message="No heatmap data available to display." />;
  }
  const maxRowLabelLen = Math.max(...rowLabels.map((l) => l.length));
  const labelWidth = colLabelWidth ?? cellWidth;
  const headerRow = buildHeaderRow(
    colLabels,
    cellWidth,
    labelWidth,
    colLabelInterval
  );

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text bold color="cyan">
        {title}
      </Text>
      <Box flexDirection="column" marginTop={1}>
        {/* Header row with column labels */}
        <Box>
          <Text dimColor>{" ".repeat(maxRowLabelLen + 1)}</Text>
          <Text dimColor>{headerRow}</Text>
        </Box>

        {/* Heatmap rows */}
        {rowLabels.map((rowLabel, rowIndex) => {
          const rowData = data[rowIndex] ?? [];
          return (
            <Box key={rowLabel}>
              <Text dimColor>{rowLabel.padEnd(maxRowLabelLen)} </Text>
              {rowData.map((count, colIndex) => {
                const char = getIntensityChar(count, max).repeat(cellWidth);
                const isEmpty = count === 0;
                return (
                  <Text key={colIndex} color="cyan" dimColor={isEmpty}>
                    {char}
                  </Text>
                );
              })}
            </Box>
          );
        })}
      </Box>

      {/* Legend */}
      {showLegend && (
        <Box marginTop={1} gap={1}>
          <Text dimColor>Less</Text>
          <Text color="cyan" dimColor>
            {EMPTY_CHAR}
          </Text>
          {INTENSITY_CHARS.map((char, i) => (
            <Text key={i} color="cyan">
              {char}
            </Text>
          ))}
          <Text dimColor>More</Text>
        </Box>
      )}
    </Box>
  );
}
