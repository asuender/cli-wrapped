import React from 'react';
import {Box, Text} from 'ink';
import BigText from 'ink-big-text';
import os from 'os';

export default function App() {
	const platform = os.platform();
	const shell = process.env['SHELL'] || 'Unknown';

	return (
		<Box flexDirection="column">
			<BigText text="CLI Wrapped" font="chrome" />
			<Box marginTop={1} flexDirection="column">
				<Text>
					<Text color="cyan">OS:</Text> {platform}
				</Text>
				<Text>
					<Text color="cyan">Shell:</Text> {shell}
				</Text>
			</Box>
		</Box>
	);
}
