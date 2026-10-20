import * as cheerio from 'cheerio';
import type { PageExplorationResult } from '../../types/platform';
import { cleanHtml, htmlToMarkdown } from './html-cleaner';
import { extractForms, extractListContainers } from './form-extractor';

export class FallbackDriver {
  private userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Web2MCP/1.0';

  async fetchUrl(url: string, timeoutMs: number = 10000): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      return await response.text();
    } finally {
      clearTimeout(timeout);
    }
  }

  async parseHtmlContent(url: string, html: string): Promise<PageExplorationResult> {
    const $ = cheerio.load(html);

    const title = $('title').first().text().trim() ||
                  $('h1').first().text().trim() ||
                  new URL(url).hostname;

    // Navigation links
    const navigationLinks: { text: string; href: string }[] = [];
    $('nav a, header a').each((_, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr('href');
      if (text && href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        try {
          const resolved = new URL(href, url).toString();
          if (!navigationLinks.some(l => l.href === resolved)) {
            navigationLinks.push({ text, href: resolved });
          }
        } catch {
          // ignore malformed URLs
        }
      }
    });

    const clean = cleanHtml(html);
    const cleanMarkdown = htmlToMarkdown(html);
    const forms = extractForms(clean);
    const listContainers = extractListContainers(clean);

    // Inferred site type
    let inferredSiteType = 'general_portal';
    const lowerText = cleanMarkdown.toLowerCase();
    if (lowerText.includes('flight') || lowerText.includes('airline') || lowerText.includes('departure')) {
      inferredSiteType = 'travel_flight_booking';
    } else if (lowerText.includes('job') || lowerText.includes('career') || lowerText.includes('salary')) {
      inferredSiteType = 'careers_job_board';
    } else if (lowerText.includes('tender') || lowerText.includes('bid') || lowerText.includes('procurement')) {
      inferredSiteType = 'tender_procurement_portal';
    } else if (lowerText.includes('auction') || lowerText.includes('property') || lowerText.includes('real estate')) {
      inferredSiteType = 'property_auction';
    } else if (lowerText.includes('price') && lowerText.includes('cart')) {
      inferredSiteType = 'ecommerce_catalog';
    }

    return {
      url,
      title,
      cleanMarkdown,
      forms,
      listContainers,
      navigationLinks: navigationLinks.slice(0, 10),
      inferredSiteType,
    };
  }

  async explore(url: string): Promise<PageExplorationResult> {
    const html = await this.fetchUrl(url);
    return this.parseHtmlContent(url, html);
  }
}
