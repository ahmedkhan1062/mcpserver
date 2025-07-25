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

server.addTool({
  name: "check-domain-availability",
  description: "Check if a domain name is available for registration",
  parameters: z.object({
    domain: z.string().describe("The full domain name to check availability for (e.g., 'example.co.za')"),
  }),
  execute: async (args) => {
    const baseUrl = 'https://nkpfrka0ek.execute-api.eu-west-1.amazonaws.com/prod/savvysites/checkDomainAvailability';
    const url = `${baseUrl}?domain=${encodeURIComponent(args.domain)}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return JSON.stringify(data, null, 2);
    } catch (error) {
      throw new Error(`Error checking domain availability: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});

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