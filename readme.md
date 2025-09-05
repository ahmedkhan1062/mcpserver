# AUX MCP Server

A Model Context Protocol (MCP) server that provides access to AUX documentation2. **Feature Recommendations** - Roadmap shaping and MVP+ ideation 3. **Single Feature Deep Dive** - Bridge internal language to user-facing copy

### PDF Requirements

- Place PDF files in the configured directory (default: `./resources/pdfs/`)
- Supported file extension: `.pdf`
- The server will attempt to extract text using `pdftotext` if available
- Files are automatically discovered and made available as both resources and toolses, and consulting materials for AI models like Claude.

## Features

- **PDF Document Access**: Automatically discovers and provides access to PDF documents in the resources directory
- **Dynamic Tool Generation**: Creates tools for each PDF document for easy retrieval
- **Smart Prompts**: Pre-configured prompts for persona mapping, positioning, and feature analysis
- **TypeScript Support**: Fully typed with comprehensive type definitions
- **CLI Interface**: Easy-to-use command line interface for starting the server

## Installation

### Global Installation

```bash
npm install -g aux-mcp
```

### Local Installation

```bash
npm install aux-mcp
```

### From Source

```bash
git clone <repository-url>
cd aux-mcp
npm install
npm run build
```

## Usage

### Command Line Interface

Start the server with default settings:

```bash
aux-mcp start
```

Start with custom configuration:

```bash
# Custom port
aux-mcp start --port 3000

# Custom PDF directory
aux-mcp start --pdf-directory "/path/to/pdfs"

# Custom server name
aux-mcp start --name "My Custom MCP Server"

# All options together
aux-mcp start --port 3000 --pdf-directory "./docs" --name "Custom Server"
```

### Programmatic Usage

```typescript
import { AuxMCPServer } from "aux-mcp";

const server = new AuxMCPServer({
  server: {
    port: 8080,
    httpStream: { port: 8080 },
  },
  pdf: {
    directory: "./resources/pdfs",
  },
  mcp: {
    name: "My AUX MCP Server",
    version: "1.0.0",
  },
});

await server.start();
```

### Environment Variables

You can configure the server using environment variables:

- `PORT` - Server port (default: 8080)
- `PDF_DIRECTORY` - Directory containing PDF files (default: "./resources/pdfs")
- `MCP_NAME` - Server name (default: "AUX MCP Server")

### Available Tools

The server automatically generates tools for each PDF file found in the PDF directory:

- `get_aux_[filename]` - Retrieves content from specific PDF documents
- Tools are named based on the PDF filename with special characters converted to underscores

### Available Prompts

1. **Persona-to-Feature Mapping** - Cross-reference SmartMap features with key personas
2. **Outcome-Based Positioning Framework** - Jobs-to-be-done framework for positioning
3. **Feature Recommendations** - Roadmap shaping and MVP+ ideation
4. **Single Feature Deep Dive** - Bridge internal language to user-facing copy

### PDF Requirements

- Place PDF files in the configured directory (default: `./resources/livingston pdfs/`)
- Supported file extension: `.pdf`
- The server will attempt to extract text using `pdftotext` if available
- Files are automatically discovered and made available as both resources and tools

## API Endpoints

When running as an HTTP server, the following endpoints are available:

- **Tools**: Access to dynamically generated PDF retrieval tools
- **Resources**: Direct access to PDF documents as MCP resources
- **Prompts**: Pre-configured prompts for Livingston-specific use cases

## Development

### Setup

```bash
git clone <repository-url>
cd aux-mcp
npm install
```

### Development Commands

```bash
# Start in development mode with hot reload
npm run dev:watch

# Build the project
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Test CLI during development
npm run cli start --port 3001
```

### Project Structure

```
aux-mcp/
├── bin/
│   └── cli.js              # Compiled CLI entry point
├── src/
│   ├── bin/
│   │   └── cli.ts          # CLI source code
│   ├── config/
│   │   └── default.ts      # Default configuration
│   ├── types/
│   │   └── index.ts        # TypeScript type definitions
│   ├── server.ts           # Main server class
│   └── mcpserver.ts        # Legacy server file
├── dist/                   # Compiled JavaScript
├── resources/              # PDF documents directory
├── test/                   # Test files
├── package.json
├── tsconfig.json
└── README.md
```

## Publishing

To publish as an npm package:

1. Update version in `package.json`
2. Build and test:
   ```bash
   npm run build
   npm test
   ```
3. Publish:
   ```bash
   npm publish
   ```

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run tests and linting
6. Submit a pull request

## Support

For issues and questions, please create an issue in the GitHub repository.
