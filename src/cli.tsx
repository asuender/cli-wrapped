#!/usr/bin/env node

import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

meow(
	`
	Usage
	  $ cli-wrapped

	Options
		<TODO>

	Examples
	  <TODO>
`,
	{
		importMeta: import.meta,
	},
);

render(<App />);
