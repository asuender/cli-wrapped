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
