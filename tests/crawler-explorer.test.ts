import { describe, it, expect } from 'vitest';
import { exploreWebsite } from '../services/crawler/explorer';
import { FallbackDriver } from '../services/crawler/fallback-driver';

describe('Web Exploration Engine', () => {
  it('FallbackDriver accurately parses mock HTML content directly', async () => {
    const driver = new FallbackDriver();
    const mockHtml = `
      <html>
        <head><title>Remote Jobs Portal</title></head>
        <body>
          <h1>Find Tech Jobs</h1>
          <form id="job-search" action="/search" method="GET">
            <input name="role" placeholder="Software Engineer" required />
            <input name="location" placeholder="Remote" />
            <button type="submit">Search Jobs</button>
          </form>
          <div class="jobs-list">
            <div class="job-item"><h3>Frontend Developer</h3><p>$120k</p></div>
            <div class="job-item"><h3>Backend Developer</h3><p>$135k</p></div>
          </div>
        </body>
      </html>
    `;

    const result = await driver.parseHtmlContent('https://mockjobs.com', mockHtml);
    expect(result.title).toBe('Remote Jobs Portal');
    expect(result.forms.length).toBe(1);
    expect(result.forms[0].fields[0].name).toBe('role');
    expect(result.listContainers.length).toBeGreaterThan(0);
    expect(result.cleanMarkdown).toContain('# Find Tech Jobs');
  });

  it('exploreWebsite successfully runs with progress events', async () => {
    const steps: string[] = [];
    const result = await exploreWebsite('https://httpbin.org/html', 'Explore articles', {
      onProgress: (step) => steps.push(step.message),
    });

    expect(steps.length).toBeGreaterThan(0);
    expect(result.url).toBe('https://httpbin.org/html');
    expect(result.title).toBeDefined();
  });
});
