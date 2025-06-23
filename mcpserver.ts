import { FastMCP } from "fastmcp";
import { readFile } from 'fs/promises';
import { z } from "zod"; // Or any validation library that supports Standard Schema

const server = new FastMCP({
  name: "My Server",
  version: "1.0.0",
});


// Tools 
server.addTool({
  name: "read_components",
  description: "Read the components list resource",
  parameters: z.object({}),
  execute: async () => {
    try {
      const content = await readFile('/Users/ahmed/Documents/AUX/Clients/Livingston/mcpserver/resources/components.txt', 'utf-8');
      return content;
    } catch (error) {
      return `Error reading file: `;
    }
  },
});

server.addTool({
  name: "add",
  description: "Add two numbers",
  parameters: z.object({
    a: z.number(),
    b: z.number(),
  }),
  execute: async (args) => {
    return String(args.a + args.b);
  },
});


// Prompts 

server.addPrompt({
  name: "find-components",
  description: "Find design system components and write to a file",
  arguments: [
    {
      name: "designSystem",
      description: "Where should i look for components",
      required: true,
    },
  ],
  load: async (args) => {
    return `Please find and document 5 design system components from the following design system: \n\n${args.designSystem}. Once you have found documented them,  please save these descriptions inside a folder called "resources". the saved file should be called '${args.designSystem}.txt'`;
  },
});

server.addPrompt({
  name: "git-release-notes",
  description: "Generate release notes for latest commit",
  load: async (args) => {
    return `Please generate comprehensive and professional release notes based on the latest commits to github. save these release notes inside a folder called "release-notes". the saved file should be called 'release-notes.txt'`;
  },
});


// Resources

server.addResource({
  uri: "file:///Users/ahmed/Documents/AUX/Clients/Livingston/mcpserver/resources/cloudscape.txt",
  name: "Components list",
  mimeType: "text/plain",
  async load() {
    return {
      text: await readFile('/Users/ahmed/Documents/AUX/Clients/Livingston/mcpserver/resources/cloudscape.txt', 'utf-8'),
    };
  },
});




server.start({
  transportType: "stdio",
});