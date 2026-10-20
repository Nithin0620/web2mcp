import type { PageExplorationResult } from '../../types/platform';
import { extractForms, extractListContainers } from './form-extractor';
import { htmlToMarkdown, cleanHtml } from './html-cleaner';

export interface TinyFishConfig {
  apiKey?: string;
}

export class TinyFishClient {
  private client: any = null;
  private apiKey: string | null = null;

  constructor(config?: TinyFishConfig) {
    const rawKey = config?.apiKey || process.env.TINYFISH_API_KEY || null;
    if (rawKey) {
      this.apiKey = rawKey.replace(/^[=\s"']+/, '').replace(/[\s"']+$/, '');
    }
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  private async getClient(): Promise<any> {
    if (this.client) return this.client;
    if (!this.apiKey) return null;
    try {
      const { TinyFish } = await import('@tiny-fish/sdk');
      this.client = new TinyFish({
        apiKey: this.apiKey,
      });
      return this.client;
    } catch (err) {
      console.warn('[TinyFish] Failed to initialize TinyFish SDK:', err);
      return null;
    }
  }

  async explore(url: string, goal?: string): Promise<PageExplorationResult | null> {
    const client = await this.getClient();
    if (!client) {
      return null;
    }

    try {
      const { RunStatus } = await import('@tiny-fish/sdk');
      // 1. Try TinyFish Autonomous Agent Run
      const agentGoal = goal || `
        Explore this website at ${url}.
        Discover all interactive forms, search filters, pagination, and data listing collections.
        Extract form input names, search parameters, action endpoints, and sample listing items.
      `.trim();

      const run = await client.agent.run({
        url,
        goal: agentGoal,
      });

      if (run.status === RunStatus.COMPLETED && run.result) {
        let resultObj: any = run.result;
        if (typeof run.result === 'string') {
          try {
            resultObj = JSON.parse(run.result);
          } catch {
            resultObj = { markdown: run.result };
          }
        }

        const title = resultObj.title || new URL(url).hostname;
        const markdown = resultObj.markdown || resultObj.text || '';
        const rawHtml = resultObj.html || '';

        return {
          url,
          title,
          cleanMarkdown: markdown || htmlToMarkdown(rawHtml),
          forms: resultObj.forms || (rawHtml ? extractForms(rawHtml) : []),
          listContainers: resultObj.listContainers || (rawHtml ? extractListContainers(rawHtml) : []),
          navigationLinks: resultObj.navigationLinks || [],
          inferredSiteType: resultObj.inferredSiteType || 'spa_portal',
        };
      }

      // 2. Fallback to TinyFish Direct Fetch if agent run did not return completed structured data
      const fetchResult = await client.fetch.getContents({
        urls: [url],
      });

      if (fetchResult && (fetchResult as any).result) {
        const res = (fetchResult as any).result;
        const html = res.html || res.content || '';
        const markdown = res.markdown || htmlToMarkdown(html);

        return {
          url,
          title: res.title || new URL(url).hostname,
          cleanMarkdown: markdown,
          forms: extractForms(html),
          listContainers: extractListContainers(html),
          navigationLinks: [],
          inferredSiteType: 'spa_portal',
        };
      }

      return null;
    } catch (err) {
      console.warn('[TinyFish] Autonomous agent call failed, engaging fallback driver:', err);
      return null;
    }
  }
}
