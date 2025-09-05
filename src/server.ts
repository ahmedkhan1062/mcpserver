import { FastMCP } from "fastmcp";
import { z } from "zod";
import { execSync } from 'child_process';
import { readdirSync, statSync, existsSync } from 'fs';
import path from 'path';

import defaultConfig from './config/default.js';
import { ServerConfig, PDFFile } from './types/index.js';
import { validateSemanticVersion } from './utils/version.js';

export class AuxMCPServer {
  private server: FastMCP;
  private config: ServerConfig;
  private pdfFiles: PDFFile[] = [];

  constructor(options: Partial<ServerConfig> = {}) {
    this.config = this.mergeConfig(defaultConfig, options);
    
    // Ensure version is in semantic version format
    const version = validateSemanticVersion(this.config.mcp.version);
    
    this.server = new FastMCP({
      name: this.config.mcp.name,
      version: version,
    });

    this.initializePDFs();
    this.setupResources();
    this.setupTools();
    this.setupPrompts();
  }

  private mergeConfig(defaultConf: ServerConfig, options: Partial<ServerConfig>): ServerConfig {
    return {
      server: { ...defaultConf.server, ...options.server },
      pdf: { ...defaultConf.pdf, ...options.pdf },
      mcp: { ...defaultConf.mcp, ...options.mcp },
    };
  }

  private initializePDFs(): void {
    this.pdfFiles = this.getPdfFiles(this.config.pdf.directory);
    console.error(`Found ${this.pdfFiles.length} PDF files in ${this.config.pdf.directory}`);
  }

  private getPdfFiles(directory: string): PDFFile[] {
    try {
      if (!existsSync(directory)) {
        console.error(`PDF directory not found: ${directory}`);
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

  private createToolName(baseName: string): string {
    return baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  private createDisplayName(baseName: string): string {
    return baseName
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  private setupResources(): void {
    this.pdfFiles.forEach(pdf => {
      this.server.addResource({
        uri: `file://${pdf.fullPath}`,
        name: `AUX - ${this.createDisplayName(pdf.baseName)}`,
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
  }

  private setupTools(): void {

    // Domain pricing tool
    this.server.addTool({
      name: "getDomainPrices",
      description: "Get pricing information for domain TLDs (Top Level Domains)",
      parameters: z.object({
        tlds: z.array(z.string()).describe("Array of TLD strings to check prices for (e.g., ['co.za', 'com', 'net'])"),
      }),
      execute: async (args) => {
        console.error(`Executing getDomainPrices tool with TLDs: ${args.tlds.join(', ')}`);
        
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
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(data, null, 2)
              }
            ]
          };
        } catch (error) {
          console.error('Domain prices API error:', error);
          return {
            content: [
              {
                type: "text",
                text: `Error fetching domain prices: ${error instanceof Error ? error.message : String(error)}`
              }
            ]
          };
        }
      },
    });
    
    // Domain availability tool
    this.server.addTool({
      name: "checkDomainAvailability",
      description: "Check if a domain name is available for registration",
      parameters: z.object({
        domain: z.string().describe("The full domain name to check availability for (e.g., 'example.co.za')"),
      }),
      execute: async (args) => {
        console.error(`Executing checkDomainAvailability tool for domain: ${args.domain}`);
        
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
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(data, null, 2)
              }
            ]
          };
        } catch (error) {
          console.error('Domain availability API error:', error);
          return {
            content: [
              {
                type: "text",
                text: `Error checking domain availability: ${error instanceof Error ? error.message : String(error)}`
              }
            ]
          };
        }
      },  
    });

    this.pdfFiles.forEach(pdf => {
      const toolName = `get_aux_${this.createToolName(pdf.baseName)}`;
      
      this.server.addTool({
        name: toolName,
        description: `Retrieve AUX ${this.createDisplayName(pdf.baseName)} document`,
        parameters: z.object({}),
        execute: async (args) => {
          try {
            console.error(`Executing tool: ${toolName} for file: ${pdf.fullPath}`);
            
            // Try to extract text directly
            let content = '';
            try {
              content = execSync(`pdftotext "${pdf.fullPath}" -`, { 
                encoding: 'utf8',
                maxBuffer: 1024 * 1024 * 10 // 10MB buffer
              });
              
              if (!content || content.trim().length === 0) {
                content = `PDF file: ${pdf.filename}\nLocation: ${pdf.fullPath}\nNote: No text could be extracted from this PDF.`;
              }
            } catch (pdfError) {
              console.error(`PDF extraction failed for ${pdf.filename}:`, pdfError);
              content = `PDF file: ${pdf.filename}\nLocation: ${pdf.fullPath}\nNote: Text extraction not available. Error: ${pdfError instanceof Error ? pdfError.message : String(pdfError)}`;
            }
            
            return {
              content: [
                {
                  type: "text",
                  text: content
                },
              ],
            };
          } catch (error) {
            console.error(`Tool execution error for ${toolName}:`, error);
            return {
              content: [
                {
                  type: "text",
                  text: `Error executing tool ${toolName}: ${error instanceof Error ? error.message : String(error)}`
                },
              ],
            };
          }
        },
      });
    });
  }

  private setupPrompts(): void {
    this.server.addPrompt({
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

    this.server.addPrompt({
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

    this.server.addPrompt({
      name: "Feature Recommendations",
      description: " Use for roadmap shaping or MVP+ ideation",
      load: async (args) => {
        return `Focusing only on the Livingston personas that are genuinely impacted by SmartMap, critically evaluate how well the current product addresses their compliance and ROI pain points. For each relevant persona, pinpoint any unmet needs or gaps, then propose features or enhancements that would close those gaps. Do not mention personas or features unless the connection is clear and meaningful—no filler suggestions`;
      },
    });

    this.server.addPrompt({
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
  }

  public async start(): Promise<void> {
    console.error(`Starting ${this.config.mcp.name} v${this.config.mcp.version}`);
    console.error(`PDF Directory: ${this.config.pdf.directory}`);
    console.error(`Found ${this.pdfFiles.length} PDF documents`);
    
    // VS Code MCP typically uses stdio transport, not HTTP
    this.server.start({
      transportType: "stdio",
    });

    console.error(`AUX MCP Server running via stdio`);
  }

  public async stop(): Promise<void> {
    // FastMCP doesn't have a built-in stop method, but we can handle cleanup here
    console.error('AUX MCP Server stopped');
  }

  public getServer(): FastMCP {
    return this.server;
  }
}

// If run directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new AuxMCPServer();

  // Graceful shutdown handlers
  const shutdown = async (signal: string) => {
    console.log(`${signal} received, shutting down gracefully`);
    await server.stop();
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  server.start().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

export default AuxMCPServer;
