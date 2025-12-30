# cli-wrapped

A terminal UI that gives you a fun, Spotify Wrapped-style summary of your command-line usage.

![Demo](assets/demo.gif)

## Features

- **Top Commands Chart** - See your most-used commands visualized as a colorful bar chart
- **System Info** - View system stats, uptime, and hardware info with fun commentary
- **Tab Navigation** - Switch between views using keyboard navigation
- **Shell Support** - Works with Bash and Zsh history files

## Installation

```bash
npm install --global cli-wrapped
```

## Usage

Simply run:

```bash
cli-wrapped
```

**Keyboard controls:**
- `Tab` - Switch between tabs
- `Escape` - Exit the application

For more options:

```bash
cli-wrapped --help
```

## Development

### Prerequisites

- Node.js >= 16
- pnpm

### Setup

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/asuender/cli-wrapped.git
   cd cli-wrapped
   pnpm install
   ```

2. Build and link globally:

   ```bash
   pnpm run build
   pnpm link --global
   ```

3. Run `cli-wrapped` from anywhere.

### Development mode

For auto-rebuild on file changes:

```bash
pnpm run dev
```

## Tech Stack

- [Ink](https://github.com/vadimdemedes/ink) - React for CLIs
- [meow](https://github.com/sindresorhus/meow) - CLI argument parsing
- TypeScript

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

### Recording the demo

To record a new demo GIF, you need [vhs](https://github.com/charmbracelet/vhs) installed:

```bash
pnpm run record
```

## License

MIT
