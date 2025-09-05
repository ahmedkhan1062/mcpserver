import { ServerConfig } from '../types/index.js';
import { getPackageVersion } from '../utils/version.js';

const config: ServerConfig = {
  server: {
    port: parseInt(process.env.PORT || '8080', 10),
    httpStream: {
      port: parseInt(process.env.PORT || '8080', 10),
    },
  },
  pdf: {
    directory: process.env.PDF_DIRECTORY || "./resources/pdfs",
  },
  mcp: {
    name: process.env.MCP_NAME || "AUX MCP Server",
    version: getPackageVersion(),
  },
};

// Debug logging for environment variables
if (process.env.PDF_DIRECTORY) {
  console.error(`Using PDF_DIRECTORY from env: ${process.env.PDF_DIRECTORY}`);
} else {
  console.error(`No PDF_DIRECTORY env var, using default: ./resources/pdfs`);
}

export default config;
