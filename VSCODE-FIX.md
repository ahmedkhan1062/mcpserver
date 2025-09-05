# VS Code MCP Configuration Solutions

Since `aux-mcp --version` works but VS Code can't find it, this is a PATH issue. VS Code often runs with a different environment than your terminal.

## 🎯 **Solution 1: Use npx (RECOMMENDED)**

This is the most reliable approach as it doesn't depend on PATH:

```json
{
  "mcp.servers": {
    "aux": {
      "command": "npx",
      "args": ["aux-mcp", "start", "--port", "8080"],
      "env": {
        "PDF_DIRECTORY": "/Users/ahmed/Documents/AUX/Clients/Livingston/mcpserver/resources/pdfs"
      }
    }
  },
  "mcp.enabled": true
}
```

## 🔧 **Solution 2: Use Absolute Path**

First, find the absolute path:

```bash
which aux-mcp
```

Then use that path in VS Code:

```json
{
  "mcp.servers": {
    "aux": {
      "command": "/usr/local/bin/aux-mcp",
      "args": ["start", "--port", "8080"],
      "env": {
        "PDF_DIRECTORY": "/Users/ahmed/Documents/AUX/Clients/Livingston/mcpserver/resources/pdfs"
      }
    }
  },
  "mcp.enabled": true
}
```

## 🔧 **Solution 3: Use Node Directly**

```json
{
  "mcp.servers": {
    "aux": {
      "command": "node",
      "args": [
        "/usr/local/lib/node_modules/aux-mcp/bin/cli.js",
        "start",
        "--port",
        "8080"
      ],
      "env": {
        "PDF_DIRECTORY": "/Users/ahmed/Documents/AUX/Clients/Livingston/mcpserver/resources/pdfs"
      }
    }
  },
  "mcp.enabled": true
}
```

## 🔧 **Solution 4: Fix VS Code Environment**

Add to VS Code settings.json to fix PATH:

```json
{
  "terminal.integrated.env.osx": {
    "PATH": "/usr/local/bin:${env:PATH}"
  },
  "mcp.servers": {
    "aux": {
      "command": "aux-mcp",
      "args": ["start", "--port", "8080"],
      "env": {
        "PATH": "/usr/local/bin:${env:PATH}",
        "PDF_DIRECTORY": "/Users/ahmed/Documents/AUX/Clients/Livingston/mcpserver/resources/pdfs"
      }
    }
  },
  "mcp.enabled": true
}
```

## 📝 **Steps to Apply:**

1. **Run the diagnostic script:**

   ```bash
   chmod +x diagnose-vscode-issue.sh
   ./diagnose-vscode-issue.sh
   ```

2. **Copy the recommended npx configuration**

3. **Add to VS Code settings.json:**

   - Press `Cmd+,` to open settings
   - Click "Open Settings (JSON)"
   - Add the configuration
   - Restart VS Code

4. **Test in VS Code:**
   - Open Command Palette (`Cmd+Shift+P`)
   - Run: `MCP: Show Server Status`
   - Look for "aux" server

## 🧪 **Quick Test:**

Test npx works in terminal first:

```bash
npx aux-mcp start --port 3001
```

If that works, the npx solution will work in VS Code too.
