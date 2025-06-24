import { FastMCP } from "fastmcp";
import { readFile } from 'fs/promises';
import { z } from "zod"; // Or any validation library that supports Standard Schema

const server = new FastMCP({
  name: "My Server",
  version: "1.0.0",
});


// Tools 

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

server.addTool({
  name: "get-domain-prices",
  description: "Get pricing information for domain TLDs (Top Level Domains)",
  parameters: z.object({
    tlds: z.array(z.string()).describe("Array of TLD strings to check prices for (e.g., ['co.za', 'com', 'net'])"),
  }),
  execute: async (args) => {
    const baseUrl = 'https://nkpfrka0ek.execute-api.eu-west-1.amazonaws.com/prod/savvysites/getDomainPrices';
    const tldsParam = args.tlds.join(',');
    const url = `${baseUrl}?tldsToCheck=${tldsParam}`;
    
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
      throw new Error(`Error fetching domain prices: ${error instanceof Error ? error.message : String(error)}`);
    }
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
    return `Please generate professional release notes detailing the latest additions to the code based on the latest commit to github. 
    The notes should be concise but descriptive. The notes should be written in the following json format: "notes": [
            {
                "date": "12 June 2025",
                "entries": [
                    {
                        "title": "Notes title",
                        "description": ["description of change"]
                    }
                ]
            },
            {
                "date": "7 June 2025",
                "entries": [
                    {
                        "title": "notes title",
                        "description": ["description of change 1", "Description of change 2"]
                    }
                ]
            },
    Use the gitlog in this folder to determine the account name and repo. save these release notes inside a folder called "release-notes".
    The saved file should be called 'release-notes.txt'. 
    If the file already exists, add the new release notes as an entry at the top of the existing notes json`;
  },
});

server.addPrompt({
  name: "clever claude",
  description: "Generate release notes for latest commit",
  load: async (args) => {
    return `From now on, do not simply affirm my statements or assume my conclusions are correct. Your goal is to be an intellectual sparring
    partner, not just an agreeable assistant. Every time I present an idea, do the following:
    Analyse my assumptions. What am I taking for granted that might not be true?
    Provide counterpoints. What would an intelligent, well-informed skeptic say in response?
    Test my reasoning. Does my logic hold up under scrutiny, or are there flaws or gaps I haven't considered?
    Offer alternative perspectives. How else might this idea be framed, interpreted, or challenged?
    Prioritise truth over agreement. If I am wrong or my logic is weak, I need to know. Correct me clearly and explain why."
    Maintain a constructive, but rigorous, approach. Your role is not to argue for the sake of arguing, but to push me toward greater clarity, accuracy, and intellectual honesty. 
    If I ever start slipping into confirmation bias or unchecked assumptions, call it out directly. Let's refine not just our conclusions, but how we arrive at them.`;
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