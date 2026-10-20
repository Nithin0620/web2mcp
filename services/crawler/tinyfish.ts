import type { PageExplorationResult } from '../../types/platform';

export interface TinyFishConfig {
  apiKey?: string;
  apiUrl?: string;
}

export class TinyFishClient {
  private apiKey: string | null;
  private apiUrl: string;

  constructor(config?: TinyFishConfig) {
    this.apiKey = config?.apiKey || process.env.TINYFISH_API_KEY || null;
    this.apiUrl = config?.apiUrl || process.env.TINYFISH_API_URL || 'https://agent.tinyfish.io/v1';
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async explore(url: string, goal?: string): Promise<PageExplorationResult | null> {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const response = await fetch(`${this.apiUrl}/explore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'User-Agent': 'Web2MCP/1.0',
        },
        body: JSON.stringify({
          url,
          goal: goal || 'Discover all interactive forms, search filters, detail endpoints and listing structures',
          depth: 2,
          renderJs: true,
          captureEvidence: true,
        }),
      });

      if (!response.ok) {
        console.warn(`[TinyFish] Agent returned ${response.status}: ${response.statusText}, falling back to built-in driver.`);
        return null;
      }

      const data = await response.json();
      return {
        url,
        title: data.title || new URL(url).hostname,
        cleanMarkdown: data.cleanMarkdown || data.text || '',
        forms: data.forms || [],
        listContainers: data.listContainers || [],
        navigationLinks: data.navigationLinks || [],
        inferredSiteType: data.inferredSiteType || 'spa_portal',
      };
    } catch (err) {
      console.warn('[TinyFish] Connection failed, switching to local fallback driver:', err);
      return null;
    }
  }
}
