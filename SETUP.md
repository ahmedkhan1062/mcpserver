# Setup Guide for NPM Package Conversion

## What We've Done

Your Livingston MCP Server has been converted into a professional npm package! Here's what was added:

### New Directory Structure
```
mcpserver/
├── bin/
│   └── cli.js                 # CLI entry point
├── src/
│   ├── bin/
│   │   └── cli.ts            # CLI source code
│   ├── config/
│   │   └── default.ts        # Configuration management
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   ├── server.ts             # Refactored server class
│   └── mcpserver.ts          # Your original server (kept for reference)
├── test/
│   └── server.test.ts        # Basic test setup
└── [config files]
```

### New Features Added
- **CLI Interface**: `livingston-mcp-server start --port 3000`
- **Professional Package Structure**: Proper npm package with bin entries
- **Type Safety**: Comprehensive TypeScript types
- **Testing Framework**: Jest setup for testing
- **Build System**: Automated compilation and distribution
- **Configuration Management**: Environment variables and CLI arguments
- **Development Tools**: ESLint, development scripts

## Next Steps

### 1. Install New Dependencies
```bash
chmod +x install-deps.sh
./install-deps.sh
```

Or manually:
```bash
npm install yargs
npm install --save-dev @types/yargs @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint jest @types/jest ts-jest rimraf
```

### 2. Build the Project
```bash
npm run build
```

### 3. Test the CLI
```bash
# Test with TypeScript (development)
npm run cli start --port 3001

# Test compiled version
node bin/cli.js start --port 3001
```

### 4. Test Locally as Global Package
```bash
npm link
livingston-mcp-server start --port 3001
```

### 5. Run Tests
```bash
npm test
```

## Usage Examples

### Command Line
```bash
# Basic start
livingston-mcp-server start

# With custom settings
livingston-mcp-server start --port 3000 --pdf-directory "./docs" --name "My MCP Server"
```

### Programmatic
```typescript
import { LivingstonMCPServer } from 'livingston-mcp-server';

const server = new LivingstonMCPServer({
  server: { port: 8080 },
  pdf: { directory: './resources/livingston pdfs' }
});

await server.start();
```

## Publishing to NPM

When ready to publish:
```bash
# Update version in package.json
npm version patch  # or minor, major

# Build and test
npm run build
npm test

# Publish
npm publish
```

## Migration Notes

- Your original `src/mcpserver.ts` is preserved
- New `src/server.ts` is a refactored class-based version
- All your existing functionality (PDFs, prompts, tools) is maintained
- New structure allows both CLI and programmatic usage
