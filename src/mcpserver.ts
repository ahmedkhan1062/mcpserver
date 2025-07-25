import { FastMCP } from "fastmcp";
import { readFile } from 'fs/promises';
import { z } from "zod"; // Or any validation library that supports Standard Schema
import { execSync } from 'child_process';
import { readdirSync, statSync } from 'fs';
import path from 'path';


const PDF_DIRECTORY = "/Users/ahmed/Documents/AUX/Clients/Livingston/mcpserver/resources/livingston pdfs";
const PORT = process.env.PORT || 8080;
const server = new FastMCP({
  name: "My Server",
  version: "1.0.0",
});



// Tools 

// server.addTool({
//   name: "check-domain-availability",
//   description: "Check if a domain name is available for registration",
//   parameters: z.object({
//     domain: z.string().describe("The full domain name to check availability for (e.g., 'example.co.za')"),
//   }),
//   execute: async (args) => {
//     const baseUrl = 'https://nkpfrka0ek.execute-api.eu-west-1.amazonaws.com/prod/savvysites/checkDomainAvailability';
//     const url = `${baseUrl}?domain=${encodeURIComponent(args.domain)}`;
    
//     try {
//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return JSON.stringify(data, null, 2);
//     } catch (error) {
//       throw new Error(`Error checking domain availability: ${error instanceof Error ? error.message : String(error)}`);
//     }
//   },
// });

// server.addTool({
//   name: "get-domain-prices",
//   description: "Get pricing information for domain TLDs (Top Level Domains)",
//   parameters: z.object({
//     tlds: z.array(z.string()).describe("Array of TLD strings to check prices for (e.g., ['co.za', 'com', 'net'])"),
//   }),
//   execute: async (args) => {
//     const baseUrl = 'https://nkpfrka0ek.execute-api.eu-west-1.amazonaws.com/prod/savvysites/getDomainPrices';
//     const tldsParam = args.tlds.join(',');
//     const url = `${baseUrl}?tldsToCheck=${tldsParam}`;
    
//     try {
//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return JSON.stringify(data, null, 2);
//     } catch (error) {
//       throw new Error(`Error fetching domain prices: ${error instanceof Error ? error.message : String(error)}`);
//     }
//   },
// });

// server.addPrompt({
//   name: "git-release-notes",
//   description: "Generate release notes for latest commit",
//   load: async (args) => {
//     return `Please generate professional release notes detailing the latest additions to the code based on the latest commit to github. 
//     The notes should be concise but descriptive. The notes should be written in the following json format: "notes": [
//             {
//                 "date": "12 June 2025",
//                 "entries": [
//                     {
//                         "title": "Notes title",
//                         "description": ["description of change"]
//                     }
//                 ]
//             },
//             {
//                 "date": "7 June 2025",
//                 "entries": [
//                     {
//                         "title": "notes title",
//                         "description": ["description of change 1", "Description of change 2"]
//                     }
//                 ]
//             },
//     Use the gitlog in this folder to determine the account name and repo. save these release notes inside a folder called "release-notes".
//     The saved file should be called 'release-notes.txt'. 
//     If the file already exists, add the new release notes as an entry at the top of the existing notes json`;
//   },
// });

// server.addPrompt({
//   name: "clever claude",
//   description: "Generate release notes for latest commit",
//   load: async (args) => {
//     return `From now on, do not simply affirm my statements or assume my conclusions are correct. Your goal is to be an intellectual sparring
//     partner, not just an agreeable assistant. Every time I present an idea, do the following:
//     Analyse my assumptions. What am I taking for granted that might not be true?
//     Provide counterpoints. What would an intelligent, well-informed skeptic say in response?
//     Test my reasoning. Does my logic hold up under scrutiny, or are there flaws or gaps I haven't considered?
//     Offer alternative perspectives. How else might this idea be framed, interpreted, or challenged?
//     Prioritise truth over agreement. If I am wrong or my logic is weak, I need to know. Correct me clearly and explain why."
//     Maintain a constructive, but rigorous, approach. Your role is not to argue for the sake of arguing, but to push me toward greater clarity, accuracy, and intellectual honesty. 
//     If I ever start slipping into confirmation bias or unchecked assumptions, call it out directly. Let's refine not just our conclusions, but how we arrive at them.`;
//   },
// });

// Prompts


//Add later
// Cross-reference SmartMap’s features with the goals, pain points, and contexts of our key personas—only if there’s a 
// meaningful connection. For each persona, identify which feature(s) (if any) are most relevant and explain why. Suggest 
// messaging or language—written in Livingston’s tone of voice—that would resonate with that persona when describing the 
// feature. Be selective and critical; don’t force connections where they don’t exist.


// Using the Jobs-to-Be-Done framework, identify the functional, emotional, and social jobs SmartMap helps clients complete—but 
// only in relation to the Livingston personas who are genuinely relevant to the product. Do not include personas (e.g. small business owners) 
// unless there’s a clear, meaningful connection. Based on these insights, write positioning blocks for a SmartMap product page on the Livingston
//  marketing website. Focus on outcomes and transformation, not just features. All messaging should be tailored to the applicable personas and written 
//  in Livingston’s tone of voice: clear, confident, and focused on practical value


// Focusing only on the Livingston personas that are genuinely impacted by SmartMap, critically evaluate how well the current product addresses their compliance 
// and ROI pain points. For each relevant persona, pinpoint any unmet needs or gaps, then propose features or enhancements that would close those gaps. Do not mention 
// personas or features unless the connection is clear and meaningful—no filler suggestions


// Take import / export assessment feature from SmartMap and write:A concise feature descriptionA tooltip explanation for in-app useA user-facing onboarding explanationA 
// consultant-side explanation (internal)All in Livingston’s tone of voice.






// Resources

function getPdfFiles(directory: string) {
  try {
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

// Function to create a clean tool name from filename
function createToolName(baseName: string) {
  return baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

// Function to create a readable display name
function createDisplayName(baseName: string) {
  return baseName
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

// Get all PDF files
const pdfFiles = getPdfFiles(PDF_DIRECTORY);




//Livingston PDFs

//Payments Usability Report
pdfFiles.forEach(pdf => {
  server.addResource({
    uri: `file://${pdf.fullPath}`,
    name: `Livingston - ${createDisplayName(pdf.baseName)}`,
    mimeType: "application/pdf",
    async load() {
      try {
        const text = execSync(`pdftotext "${pdf.fullPath}" -`, { 
          encoding: 'utf8',
          maxBuffer: 1024 * 1024 * 10 // 10MB buffer
        });
        
        return {
          text: text || "No text content found in PDF"
        };
      } catch (error) {
        console.error(`Error processing PDF ${pdf.filename}:`, error);
        return {
          text: `Error reading PDF: ${error instanceof Error ? error.message : String(error)}`
        };
      }
    },
  });
});

// Dynamically add tools for each PDF
pdfFiles.forEach(pdf => {
  const toolName = `get_livingston_${createToolName(pdf.baseName)}`;
  
  server.addTool({
    name: toolName,
    description: `Retrieve Livingston ${createDisplayName(pdf.baseName)} document`,
    parameters: z.object({}),
    execute: async (args) => {
      return {
        content: [
          {
            type: "resource",
            resource: await server.embedded(`file://${pdf.fullPath}`),
          },
        ],
      };
    },
  });
});


//Prompts

server.addPrompt({
  name: "Persona-to-Feature Mapping",
  description: "Use to prioritize messaging or UX copy for specific segments",
  load: async (args) => {
    return `Cross-reference SmartMap’s features with the goals, pain points, and contexts of 
    our key personas—only if there’s a meaningful connection. For each persona, identify which 
    feature(s) (if any) are most relevant and explain why. Suggest messaging or language—written 
    in Livingston’s tone of voice—that would resonate with that persona when describing the feature. 
    Be selective and critical; don’t force connections where they don’t exist`;
  },
});


server.addPrompt({
  name: "Outcome-Based Positioning Framework",
  description: "Use this when you need help avoiding generic feature-description and instead drive home why it matters",
  load: async (args) => {
    return `Using the Jobs-to-Be-Done framework, identify the functional, emotional, and social 
    jobs SmartMap helps clients complete—but only in relation to the Livingston personas who are
    genuinely relevant to the product. Do not include personas (e.g. small business owners) unless
    there’s a clear, meaningful connection. Based on these insights, write positioning blocks for
    a SmartMap product page on the Livingston marketing website. Focus on outcomes and transformation,
    not just features. All messaging should be tailored to the applicable personas and written in 
    Livingston’s tone of voice: clear, confident, and focused on practical value`;
  },
});


server.addPrompt({
  name: "Feature Recommendations",
  description: " Use for roadmap shaping or MVP+ ideation",
  load: async (args) => {
    return `Focusing only on the Livingston personas that are genuinely impacted by SmartMap, critically evaluate how well the current product addresses their compliance and ROI pain points. For each relevant persona, pinpoint any unmet needs or gaps, then propose features or enhancements that would close those gaps. Do not mention personas or features unless the connection is clear and meaningful—no filler suggestions`;
  },
});


server.addPrompt({
  name: "Single Feature Deep Dive",
  description: "Helps bridge between internal language and outward-facing microcopy and UX writing",
  arguments: [
    {
      name: "smartMapFeature",
      description: "Which Smartmap feature should I focus on?",
      required: true,
    },
  ],
  load: async (args) => {
    return `Take ${args.smartMapFeature} feature from SmartMap and write:
      A concise feature description
      A tooltip explanation for in-app use
      A user-facing onboarding explanation
      A consultant-side explanation (internal)
      All in Livingston’s tone of voice`;
  },
});

// server.start({
//   transportType: "stdio",
// });

server.start({
  transportType: "httpStream",
  httpStream: {
    port: parseInt(PORT.toString()),
  },
});

console.log(`Server running on port ${PORT}`);