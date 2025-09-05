# Quick Start Guide for Developers

## Installing AUX MCP Server

### Option 1: Global Installation (Recommended)

```bash
npm install -g aux-mcp
aux-mcp start
```

### Option 2: Local Project Installation

```bash
npm install aux-mcp
npx aux-mcp start
```

### Option 3: Try Before Installing

```bash
npx aux-mcp start --port 3000
```

## Basic Usage

### Start the Server

```bash
# Default settings (port 8080)
aux-mcp start

# Custom port
aux-mcp start --port 3000

# Custom PDF directory
aux-mcp start --pdf-directory "/path/to/your/pdfs"

# All options
aux-mcp start \
  --port 3000 \
  --pdf-directory "./documents" \
  --name "My MCP Server"
```

### Environment Variables

```bash
export PORT=3000
export PDF_DIRECTORY="/path/to/pdfs"
export MCP_NAME="My MCP Server"
aux-mcp start
```

## Integration Examples

### In a Node.js Project

```typescript
import { AuxMCPServer } from "aux-mcp";

const server = new AuxMCPServer({
  server: { port: 3000 },
  pdf: { directory: "./compliance-docs" },
});

await server.start();
```

### With Claude Desktop

Add to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "aux": {
      "command": "aux-mcp",
      "args": ["start", "--port", "8080"],
      "env": {
        "PDF_DIRECTORY": "/Users/yourname/Documents/aux-pdfs"
      }
    }
  }
}
```

### With Docker

```dockerfile
FROM node:18-alpine
RUN npm install -g aux-mcp
COPY ./documents /app/documents
EXPOSE 8080
CMD ["aux-mcp", "start", "--pdf-directory", "/app/documents"]
```

## What You Get

- **Automatic PDF Discovery**: Scans your PDF directory and creates tools for each document
- **Smart Prompts**: Pre-built prompts for persona mapping, positioning, and feature analysis
- **MCP Resources**: Direct access to PDF content through the Model Context Protocol
- **CLI Interface**: Easy configuration and management
- **TypeScript Support**: Full type definitions for programmatic usage

## Requirements

- Node.js 18+
- PDF files in a designated directory
- Optional: `pdftotext` for better text extraction

## Support

- Documentation: [GitHub Repository]
- Issues: [GitHub Issues]
- NPM Package: `npm view aux-mcp`
