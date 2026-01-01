import React from "react";
import { Box, Text } from "ink";
import type { HeatmapProps } from "../types.js";

const INTENSITY_CHARS = ["░", "▒", "▓", "█"];
const EMPTY_CHAR = "·";

function getIntensityChar(value: number, max: number): string {
	if (max === 0 || value === 0) return EMPTY_CHAR;
	const normalized = Math.ceil((value / max) * INTENSITY_CHARS.length);
	return (
		INTENSITY_CHARS[Math.min(normalized, INTENSITY_CHARS.length) - 1] ?? EMPTY_CHAR
	);
}

export default function Heatmap({
	title,
	data,
	rowLabels,
	colLabels,
	colLabelInterval = 1,
	cellWidth = 2,
	showLegend = true,
}: HeatmapProps) {
	const max = Math.max(...data.flat());
	const maxRowLabelLen = Math.max(...rowLabels.map((l) => l.length));
	const cellPadding = " ".repeat(cellWidth);

	return (
		<Box flexDirection="column" marginTop={1}>
			<Text bold color="cyan">
				{title}
			</Text>
			<Box flexDirection="column" marginTop={1}>
				{/* Header row with column labels */}
				<Box>
					<Text dimColor>{" ".repeat(maxRowLabelLen + 1)}</Text>
					{colLabels.map((label, i) => {
						const showLabel =
							label.length > 0 && (colLabelInterval === 1 || i % colLabelInterval === 0);
						return (
							<Text key={i} dimColor>
								{showLabel ? label.slice(0, cellWidth).padStart(cellWidth, " ") : cellPadding}
							</Text>
						);
					})}
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
