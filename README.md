# cli-wrapped

A terminal UI that gives you a fun, Spotify Wrapped-style summary of your command-line usage.

![Demo](assets/demo.gif)

## Features

- **Top Commands Chart** - See your most-used commands visualized as a colorful bar chart
- **Activity Breakdown** - Hourly activity chart and GitHub-style weekly/yearly heatmaps
- **System Info** - View system stats, uptime, and hardware info with fun commentary
- **Tab Navigation** - Switch between views using keyboard navigation
- **Shell Support** - Works with Bash and Zsh history files

## Installation

```bash
git clone https://github.com/asuender/cli-wrapped.git
cd cli-wrapped
pnpm install
pnpm run build
pnpm link --global
```

## Usage

Simply run:

```bash
cli-wrapped
```

**Keyboard controls:**
- `Tab` or arrow keys - Switch between tabs
- `Escape` - Exit the application

For more options:

```bash
cli-wrapped --help
```

## Development

### Prerequisites

- Node.js >= 16
- pnpm

### Development mode

After following the installation steps, run with auto-reload on file changes:

```bash
pnpm start
```

## Tech Stack

- [Ink](https://github.com/vadimdemedes/ink) - React for CLIs
- [meow](https://github.com/sindresorhus/meow) - CLI argument parsing
- TypeScript

## Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features and ideas.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

#### Recording the demo

To record a new demo GIF, you need [vhs](https://github.com/charmbracelet/vhs) installed:

```bash
pnpm run record
```

## License

MIT
