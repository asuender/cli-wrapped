import React, {useState} from 'react';
import {Box, Text, useInput} from 'ink';
import BigText from 'ink-big-text';
import CommandChart from './components/CommandChart.js';
import SystemInfo from './components/SystemInfo.js';
import {getTopCommands} from './history.js';

const tabs = ['Your wrapped', 'System Info'];

export default function App() {
	const [activeTab, setActiveTab] = useState(0);

	// Handle Tab key to switch between tabs
	useInput((_input, key) => {
		if (key.tab) {
			setActiveTab(prev => (prev + 1) % tabs.length);
		}
	});

	const topCommands = getTopCommands(5);

	return (
		<Box flexDirection="column">
			<BigText text="CLI Wrapped" font="shade" />

			{/* Tab Headers */}
			<Box marginTop={1} gap={2}>
				{tabs.map((tab, index) => (
					<Text
						key={tab}
						bold={activeTab === index}
						color={activeTab === index ? 'cyan' : 'gray'}
						dimColor={activeTab !== index}
					>
						{activeTab === index ? '▶ ' : '  '}
						{tab}
					</Text>
				))}
			</Box>

			<Box marginTop={1}>
				<Text color="gray" dimColor>
					Press Tab to switch between tabs
				</Text>
			</Box>

			{/* Tab Content */}
			<Box marginTop={1}>
				{activeTab === 0 && <CommandChart commands={topCommands} />}
				{activeTab === 1 && <SystemInfo />}
			</Box>
		</Box>
	);
}
