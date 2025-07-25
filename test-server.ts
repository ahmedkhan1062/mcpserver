// Create: /Users/ahmed/Documents/AUX/Clients/Livingston/mcpserver/test-server.ts
import { FastMCP } from "fastmcp";
import { z } from "zod";

const server = new FastMCP( {
    name: 'test',
  version: "1.0.0",
});

server.addTool({
  name: "hello",
  description: "Say hello",
  parameters: z.object({}),
  execute: async () => {
    return "Hello World!";
  },
});

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

server.start({
  transportType: "stdio",
});