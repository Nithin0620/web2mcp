import { TinyFish, RunStatus } from '@tiny-fish/sdk';
import type { PageExplorationResult } from '../../types/platform';
import { extractForms, extractListContainers } from './form-extractor';
import { htmlToMarkdown, cleanHtml } from './html-cleaner';

export interface TinyFishConfig {
  apiKey?: string;
}

export class TinyFishClient {
  private client: TinyFish | null = null;
  private apiKey: string | null = null;

  constructor(config?: TinyFishConfig) {
    this.apiKey = config?.apiKey || process.env.TINYFISH_API_KEY || null;
    if (this.apiKey && this.apiKey.trim().length > 0) {
      this.client = new TinyFish({
        apiKey: this.apiKey,
      });
    }
  }

  isConfigured(): boolean {
    return Boolean(this.client && this.apiKey && this.apiKey.trim().length > 0);
  }

  async explore(url: string, goal?: string): Promise<PageExplorationResult | null> {
    if (!this.client) {
      return null;
    }

    try {
      // 1. Try TinyFish Autonomous Agent Run
      const agentGoal = goal || `
        Explore this website at ${url}.
        Discover all interactive forms, search filters, pagination, and data listing collections.
        Extract form input names, search parameters, action endpoints, and sample listing items.
      `.trim();

      const run = await this.client.agent.run({
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
      const fetchResult = await this.client.fetch.getContents({
        url,
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
