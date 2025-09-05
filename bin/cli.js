#!/usr/bin/env node

// Get the absolute path to the dist directory
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cliPath = join(__dirname, '..', 'dist', 'bin', 'cli.js');

// Import and run the CLI
import(cliPath).catch(err => {
  console.error('Failed to start AUX MCP Server:', err.message);
  console.error('Make sure the server is built with: npm run build');
  process.exit(1);
});
