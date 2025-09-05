# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-08-22

### Added

- Initial release of AUX MCP Server
- TypeScript implementation with full type support
- CLI interface for easy server management (`aux-mcp start`)
- Automatic PDF discovery and tool generation
- FastMCP integration for Model Context Protocol support
- Pre-configured prompts for consulting use cases:
  - Persona-to-Feature Mapping
  - Outcome-Based Positioning Framework
  - Feature Recommendations
  - Single Feature Deep Dive
- Dynamic resource and tool creation for PDF documents
- Configurable server options (port, PDF directory, server name)
- Environment variable support
- Comprehensive test suite with Jest
- ESLint configuration for code quality
- Build system with TypeScript compilation
- npm package distribution support

### Features

- **PDF Processing**: Automatic text extraction using `pdftotext` when available
- **Graceful Degradation**: Falls back to file information when text extraction fails
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **CLI Flexibility**: Command-line arguments for all major configuration options
- **Modular Architecture**: Clean separation of concerns with config, types, and server logic

### Documentation

- Comprehensive README with installation and usage instructions
- API documentation for programmatic usage
- Development setup and contribution guidelines
- Type definitions for TypeScript users
