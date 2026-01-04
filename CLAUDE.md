# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

cli-wrapped is a terminal CLI application built with [Ink](https://github.com/vadimdemedes/ink), a React renderer for the terminal. It uses React components to build interactive command-line interfaces.

## Commands

```bash
# Build TypeScript to dist/
pnpm run build

# Watch mode for development
pnpm run dev

# Linting
pnpm run lint        # Check for issues
pnpm run lint:fix    # Fix auto-fixable issues

# Formatting
pnpm run format       # Format all files
pnpm run format:check # Check formatting
```

## Architecture

- **src/cli.tsx** - Entry point. Parses CLI arguments using `meow` and renders the root App component with Ink
- **src/app.tsx** - Main React component rendered in the terminal

The project compiles TypeScript from `src/` to `dist/`, with `dist/cli.js` as the executable binary.

## Tech Stack

- **Package Manager**: pnpm
- **Ink** - React for CLIs (terminal UI framework)
- **meow** - CLI argument parsing
- **ESLint** - Linting (flat config with TypeScript + React)
- **Prettier** - Code formatting (2 spaces, double quotes)
- **husky + lint-staged** - Pre-commit hooks
