#!/usr/bin/env node
import { addCommand } from './commands/add';
import { testCommand } from './commands/test';
import { installCommand } from './commands/install';
import { listCommand } from './commands/list';
import { serveCommand } from './commands/serve';

function printHelp() {
  console.log(`
Web2MCP CLI — Turn Any Website into Live MCP Tools

Usage:
  web2mcp <command> [options]

Commands:
  add <url>                 Explore a website, infer schemas, and generate MCP tools
                            Options:
                              --goal <text>   Operational intent (e.g. "search flights")
                              --name <text>   Custom project name

  list                      List all registered projects and generated tools
                            Options:
                              --project <id>  Show tools for a specific project

  test <tool_name>          Execute a live probe test against a generated tool
                            Options:
                              --params <json> Custom JSON parameter payload

  install <ide>             Auto-configure an IDE client (cursor, claude, vscode)
                            Options:
                              --project <id>  Target project ID
                              --name <name>   Custom server identifier

  serve                     Run local stdio Model Context Protocol server
                            Options:
                              --project <id>  Project ID to serve

Examples:
  web2mcp add https://example.com/flights --goal "Search flights and fares"
  web2mcp install cursor --project proj-1234
  web2mcp test search_flights --params '{"origin":"NYC"}'
  web2mcp serve --project proj-1234
`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  // Parse key-value options
  const options: Record<string, string> = {};
  for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].replace(/^--/, '');
      const val = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : 'true';
      options[key] = val;
    }
  }

  try {
    switch (command) {
      case 'add': {
        const url = args[1];
        if (!url || url.startsWith('--')) {
          console.error('❌ Error: Target URL is required: web2mcp add <url>');
          process.exit(1);
        }
        await addCommand(url, {
          goal: options.goal,
          name: options.name,
        });
        break;
      }

      case 'test': {
        const toolName = args[1];
        if (!toolName || toolName.startsWith('--')) {
          console.error('❌ Error: Tool identifier is required: web2mcp test <tool_name>');
          process.exit(1);
        }
        await testCommand(toolName, {
          project: options.project,
          params: options.params,
        });
        break;
      }

      case 'install': {
        const ide = args[1];
        if (!ide || ide.startsWith('--')) {
          console.error('❌ Error: Target IDE required: web2mcp install <cursor|claude|vscode>');
          process.exit(1);
        }
        await installCommand(ide, {
          project: options.project,
          name: options.name,
        });
        break;
      }

      case 'list': {
        await listCommand({ project: options.project });
        break;
      }

      case 'serve': {
        await serveCommand({ project: options.project });
        break;
      }

      default:
        console.error(`❌ Unknown command: ${command}`);
        printHelp();
        process.exit(1);
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`\n❌ Error: ${errorMsg}`);
    process.exit(1);
  }
}

main();
