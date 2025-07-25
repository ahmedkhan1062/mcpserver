import { FastMCP } from "fastmcp";
import { z } from "zod";
import { execSync } from 'child_process';
import { readdirSync, statSync, existsSync } from 'fs';
import path from 'path';

const PDF_DIRECTORY = "./resources/livingston pdfs";
const PORT = process.env.PORT || 8080;

const server = new FastMCP({
  name: "My Server",
  version: "1.0.0",
});


// Resources and PDF processing
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

// Livingston PDFs - Resources
pdfFiles.forEach(pdf => {
  server.addResource({
    uri: `file://${pdf.fullPath}`,
    name: `Livingston - ${createDisplayName(pdf.baseName)}`,
    mimeType: "application/pdf",
    async load() {
      try {
        // Try to use pdftotext if available, otherwise return file info
        try {
          const text = execSync(`pdftotext "${pdf.fullPath}" -`, { 
            encoding: 'utf8',
            maxBuffer: 1024 * 1024 * 10 // 10MB buffer
          });
          
          return {
            text: text || "No text content found in PDF"
          };
        } catch (pdfError) {
          // If pdftotext fails (like on Render), return file information
          return {
            text: `PDF file: ${pdf.filename}\nLocation: ${pdf.fullPath}\nNote: Text extraction not available in this environment.`
          };
        }
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

// Livingston-specific prompts
server.addPrompt({
  name: "Persona-to-Feature Mapping",
  description: "Use to prioritize messaging or UX copy for specific segments",
  load: async (args) => {
    return `Cross-reference SmartMap's features with the goals, pain points, and contexts of 
    our key personas—only if there's a meaningful connection. For each persona, identify which 
    feature(s) (if any) are most relevant and explain why. Suggest messaging or language—written 
    in Livingston's tone of voice—that would resonate with that persona when describing the feature. 
    Be selective and critical; don't force connections where they don't exist`;
  },
});

server.addPrompt({
  name: "Outcome-Based Positioning Framework",
  description: "Use this when you need help avoiding generic feature-description and instead drive home why it matters",
  load: async (args) => {
    return `Using the Jobs-to-Be-Done framework, identify the functional, emotional, and social 
    jobs SmartMap helps clients complete—but only in relation to the Livingston personas who are
    genuinely relevant to the product. Do not include personas (e.g. small business owners) unless
    there's a clear, meaningful connection. Based on these insights, write positioning blocks for
    a SmartMap product page on the Livingston marketing website. Focus on outcomes and transformation,
    not just features. All messaging should be tailored to the applicable personas and written in 
    Livingston's tone of voice: clear, confident, and focused on practical value`;
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
      All in Livingston's tone of voice`;
  },
});

server.start({
  transportType: "httpStream",
  httpStream: {
    port: parseInt(PORT.toString()),
  },
});

console.log(`Server running on port ${PORT}`);