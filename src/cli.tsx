#!/usr/bin/env node

import React from "react";
import { withFullScreen } from "fullscreen-ink";
import meow from "meow";
import App from "./app.js";

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
  }
);

withFullScreen(<App />).start();
