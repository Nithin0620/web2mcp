#!/usr/bin/env node
import 'dotenv/config';
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
                              --goal <text>     Operational intent (e.g. "search flights")
                              --name <text>     Custom project name
                              --host <url>      Web2MCP host domain (default: https://web2mcp.ssh.net.in)
                              --skip-probe      Skip live probe validation

  list                      List all registered projects and generated tools
                            Options:
                              --project <id>    Show tools for a specific project
                              --host <url>      Custom host domain

  test <tool_name>          Execute a live probe test against a generated tool
                            Options:
                              --project <id>    Filter by project ID
                              --params <json>   Custom JSON parameter payload

  install <ide>             Auto-configure an IDE client (cursor, claude, vscode)
                            Options:
                              --project <id>    Target project ID
                              --name <name>     Custom server identifier
                              --host <url>      Host domain (default: https://web2mcp.ssh.net.in)
                              --endpoint <url>  Explicit MCP endpoint URL
                              --apiKey <key>    Bearer API key

  serve                     Run local stdio Model Context Protocol server
                            Options:
                              --project <id>    Project ID to serve

Examples:
  web2mcp add https://example.com/flights --goal "Search flights and fares"
  web2mcp install cursor --project proj-84bd028d
  web2mcp install claude --project proj-84bd028d --host https://web2mcp.ssh.net.in
  web2mcp test search_flights --params '{"origin":"NYC"}'
  web2mcp serve --project proj-84bd028d
`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  // Parse key-value options supporting --flag, --key=val, and --key val
  const options: Record<string, string> = {};
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const eqIdx = arg.indexOf('=');
      if (eqIdx !== -1) {
        const key = arg.slice(2, eqIdx);
        const val = arg.slice(eqIdx + 1);
        options[key] = val;
      } else {
        const key = arg.slice(2);
        if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
          options[key] = args[i + 1];
          i++;
        } else {
          options[key] = 'true';
        }
      }
    } else if (arg.startsWith('-') && arg.length === 2) {
      const key = arg.slice(1);
      if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
        options[key] = args[i + 1];
        i++;
      } else {
        options[key] = 'true';
      }
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
          host: options.host,
          skipProbe: options.skipProbe === 'true' || options['skip-probe'] === 'true',
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
          host: options.host,
          endpoint: options.endpoint,
          apiKey: options.apiKey || options.key,
        });
        break;
      }

      case 'list': {
        await listCommand({ project: options.project, host: options.host });
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
