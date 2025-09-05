export interface ServerConfig {
  server: {
    port: number;
    httpStream?: {
      port: number;
    };
  };
  pdf: {
    directory: string;
  };
  mcp: {
    name: string;
    version: string;
  };
}

export interface PDFFile {
  filename: string;
  fullPath: string;
  baseName: string;
}

export interface CLIArguments {
  port: number;
  pdfDirectory: string;
  name: string;
}

export interface PromptArgument {
  name: string;
  description: string;
  required: boolean;
}

export interface PromptDefinition {
  name: string;
  description: string;
  arguments?: PromptArgument[];
  load: (args: Record<string, any>) => Promise<string>;
}
