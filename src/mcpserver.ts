import { FastMCP } from "fastmcp";
import { readFile } from 'fs/promises';
import { z } from "zod";
import { execSync } from 'child_process';
import { readdirSync, statSync, existsSync } from 'fs'; // Add existsSync
import path from 'path';

const PDF_DIRECTORY = "./resources/livingston pdfs";
const PORT = process.env.PORT || 8080;

// Keep your original constructor - it was correct!
const server = new FastMCP({
  name: "My Server",
  version: "1.0.0",
});

// Add test tool
server.addTool({
  name: "test-connection",
  description: "Test if server is working",
  parameters: z.object({}),
  execute: async () => {
    return "Livingston MCP Server is working!";
  },
});

// Updated getPdfFiles function with better error handling
function getPdfFiles(directory: string) {
  try {
    if (!existsSync(directory)) {
      console.warn(`PDF directory not found: ${directory}`);
      return [];
    }
    return readdirSync(directory)
      .filter(file => file.toLowerCase().endsWith('.pdf'))
      .map(file => ({
        filename: file,
        fullPath: path.join(directory, file),
        baseName: path.basename(file, '.pdf')
      }));
  } catch (error) {
    console.error('Error reading PDF directory:', error);
    return [];
  }
}

// Rest of your code stays the same...
const pdfFiles = getPdfFiles(PDF_DIRECTORY);

// Your existing PDF processing, prompts, etc.

server.start({
  transportType: "httpStream",
  httpStream: {
    port: parseInt(PORT.toString()),
  },
});

console.log(`Server running on port ${PORT}`);