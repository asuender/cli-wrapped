import React from 'react';
import {Box, Text} from 'ink';
import BigText from 'ink-big-text';
import os from 'os';

const formatUptime = (seconds: number): string => {
	const days = Math.floor(seconds / 86400);
	const hours = Math.floor((seconds % 86400) / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);

	if (days > 0) {
		return `${days}d ${hours}h ${minutes}m`;
	}

	if (hours > 0) {
		return `${hours}h ${minutes}m`;
	}

	return `${minutes}m`;
};

const getUptimeMessage = (seconds: number): string => {
	const days = Math.floor(seconds / 86400);

	if (days > 30) {
		return '🔥 Living rent-free in your RAM!';
	}

	if (days > 7) {
		return '💪 Going strong!';
	}

	if (days > 1) {
		return '✨ Fresh and ready!';
	}

	return '⚡ Just getting started!';
};

const formatBytes = (bytes: number): string => {
	const gb = bytes / 1024 / 1024 / 1024;
	return `${gb.toFixed(2)} GB`;
};

export default function App() {
	const platform = os.platform();
	const shell = process.env['SHELL'] || 'Unknown';
	const uptime = os.uptime();
	const uptimeFormatted = formatUptime(uptime);
	const uptimeMessage = getUptimeMessage(uptime);
	const cpuCount = os.cpus().length;
	const cpuModel = os.cpus()[0]?.model || 'Unknown';
	const arch = os.arch();
	const totalMem = os.totalmem();
	const freeMem = os.freemem();
	const usedMem = totalMem - freeMem;
	const memUsagePercent = ((usedMem / totalMem) * 100).toFixed(1);
	const hostname = os.hostname();
	const username = os.userInfo().username;
	const homeDir = os.homedir();
	const terminal = process.env['TERM'] || 'unknown';

	return (
		<Box flexDirection="column">
			<BigText text="CLI Wrapped" font="shade" />

			<Box marginTop={1} flexDirection="column" gap={1}>
				{/* System Info Section */}
				<Box flexDirection="column">
					<Text bold color="magenta">
						💻 SYSTEM STATS
					</Text>
					<Box flexDirection="column" marginLeft={2}>
						<Text>
							<Text color="cyan">OS:</Text> {platform} ({arch})
						</Text>
						<Text>
							<Text color="cyan">Shell:</Text> {shell}
						</Text>
						<Text>
							<Text color="cyan">Terminal:</Text> {terminal}
						</Text>
					</Box>
				</Box>

				{/* User Info Section */}
				<Box flexDirection="column">
					<Text bold color="yellow">
						👤 WHO ARE YOU?
					</Text>
					<Box flexDirection="column" marginLeft={2}>
						<Text>
							<Text color="cyan">Username:</Text> {username}
						</Text>
						<Text>
							<Text color="cyan">Hostname:</Text> {hostname}
						</Text>
						<Text>
							<Text color="cyan">Home:</Text> {homeDir}
						</Text>
					</Box>
				</Box>

				{/* Performance Section */}
				<Box flexDirection="column">
					<Text bold color="green">
						⚡ POWER LEVEL
					</Text>
					<Box flexDirection="column" marginLeft={2}>
						<Text>
							<Text color="cyan">CPU Cores:</Text> {cpuCount} cores of pure power
						</Text>
						<Text>
							<Text color="cyan">Processor:</Text> {cpuModel}
						</Text>
						<Text>
							<Text color="cyan">RAM:</Text> {formatBytes(totalMem)} total (
							{memUsagePercent}% flexing)
						</Text>
						<Text>
							<Text color="cyan">Available RAM:</Text> {formatBytes(freeMem)}
						</Text>
					</Box>
				</Box>

				{/* Uptime Section */}
				<Box flexDirection="column">
					<Text bold color="blue">
						🕐 UPTIME VIBES
					</Text>
					<Box flexDirection="column" marginLeft={2}>
						<Text>
							<Text color="cyan">Running for:</Text> {uptimeFormatted}
						</Text>
						<Text color="gray">{uptimeMessage}</Text>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}
