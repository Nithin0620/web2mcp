import fs from 'fs';
import path from 'path';
import os from 'os';

export function updateCursorConfig(
  currentConfig: any,
  serverName: string,
  url: string,
  apiKey?: string
): any {
  const config = currentConfig && typeof currentConfig === 'object' ? { ...currentConfig } : {};
  config.mcpServers = config.mcpServers || {};

  config.mcpServers[serverName] = {
    url,
    headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
  };

  return config;
}

export function getCursorConfigPath(): string {
  const home = os.homedir();
  // Cursor default config locations
  const globalPath = path.join(home, '.cursor', 'mcp.json');
  return globalPath;
}

export function installToCursor(
  serverName: string,
  url: string,
  apiKey?: string,
  targetPath?: string
): { success: boolean; path: string; error?: string } {
  const resolvedPath = targetPath || getCursorConfigPath();

  try {
    const dir = path.dirname(resolvedPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let existing: any = {};
    if (fs.existsSync(resolvedPath)) {
      try {
        existing = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
      } catch {
        existing = {};
      }
    }

    const updated = updateCursorConfig(existing, serverName, url, apiKey);
    fs.writeFileSync(resolvedPath, JSON.stringify(updated, null, 2), 'utf8');

    return { success: true, path: resolvedPath };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, path: resolvedPath, error: errorMsg };
  }
}
