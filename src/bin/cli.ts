#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { AuxMCPServer } from '../server.js';
import { CLIArguments, ServerConfig } from '../types/index.js';

const argv = yargs(hideBin(process.argv))
  .command(
    'start',
    'Start the AUX MCP server',
    {
      'pdf-directory': {
        alias: 'd',
        type: 'string',
        description: 'Directory containing PDF files',
        // No default - let environment variable take precedence
      },
      name: {
        alias: 'n',
        type: 'string',
        description: 'Server name',
        // No default - let environment variable take precedence
      },
    }
  )
  .help()
  .alias('help', 'h')
  .version()
  .alias('version', 'v')
  .demandCommand(1, 'You need to specify a command')
  .parseSync() as any;

async function main(): Promise<void> {
  const command = argv._[0];

  if (command === 'start') {
    // Build config, only including CLI args that were explicitly provided
    const serverConfig: Partial<ServerConfig> = {
      server: {
        port: 8080, // Not used for stdio transport
        httpStream: { port: 8080 },
      },
    };
    
    // Override with CLI args only if provided
    if (argv.pdfDirectory) {
      serverConfig.pdf = {
        directory: argv.pdfDirectory,
      };
    }
    
    if (argv.name) {
      serverConfig.mcp = {
        name: argv.name,
        version: '1.0.0', // This will be overridden by package.json
      };
    }

    const server = new AuxMCPServer(serverConfig);

    // Graceful shutdown handlers
    const shutdown = async (signal: string): Promise<void> => {
      console.log(`${signal} received, shutting down gracefully`);
      await server.stop();
      process.exit(0);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    try {
      await server.start();
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

main().catch((error) => {
  console.error('CLI error:', error);
  process.exit(1);
});
