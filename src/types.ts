export type Command = {
  command: string;
  timestamp: number | null;
};

export type CommandStat = {
  command: string;
  count: number;
};

export type FishHistoryEntry = {
  cmd: string;
  when?: number;
};

export type UsageStats = {
  peakHour: number | null;
  peakHourCount: number;
  totalWithTimestamps: number;
  hourlyBreakdown: number[];
  weeklyHeatmap: number[][]; // 7 days × 24 hours matrix
  yearlyHeatmap: number[][]; // 7 days × 52 weeks matrix
};

export type HistoryStats = {
  topCommands: CommandStat[];
  usageStats: UsageStats;
};

export type SystemData = {
  platform: string;
  arch: string;
  shell: string;
  terminal: string;
  username: string;
  hostname: string;
  cpuCount: number;
  cpuModel: string;
  totalMem: number;
  memUsagePercent: string;
  uptimeFormatted: string;
  uptimeMessage: string;
};

export type CommandChartProps = {
  commands: CommandStat[];
};

export type UsageStatsProps = {
  stats: UsageStats;
};

export type HourlyChartProps = {
  hourlyBreakdown: number[];
  peakHour: number | null;
  peakHourCount: number;
  totalWithTimestamps: number;
};

export type ErrorMessageProps = {
  message: string;
  subtext?: string;
};

export type HeatmapProps = {
  title: string;
  data: number[][];
  rowLabels: string[];
  colLabels: string[];
  colLabelInterval?: number; // Show label every N columns (default: 1)
  cellWidth?: 1 | 2; // Characters per cell (default: 2)
  showLegend?: boolean; // Show legend below heatmap (default: true)
};
