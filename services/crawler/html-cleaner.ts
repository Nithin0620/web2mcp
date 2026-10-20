import * as cheerio from 'cheerio';

/**
 * Strips noise, tracker scripts, stylesheets, and SVGs from raw HTML.
 */
export function cleanHtml(rawHtml: string): string {
  const $ = cheerio.load(rawHtml);

  $('script, style, noscript, iframe, svg, link[rel="stylesheet"]').remove();
  $('meta, head title, head link').remove();

  // Remove comments
  $('*')
    .contents()
    .filter(function () {
      return this.type === 'comment';
    })
    .remove();

  return $.html();
}

/**
 * Converts cleaned HTML into concise, structure-preserving Markdown for LLM analysis.
 */
export function htmlToMarkdown(rawHtml: string): string {
  const $ = cheerio.load(cleanHtml(rawHtml));

  // Transform headings
  $('h1').each((_, el) => {
    $(el).replaceWith(`\n# ${$(el).text().trim()}\n`);
  });
  $('h2').each((_, el) => {
    $(el).replaceWith(`\n## ${$(el).text().trim()}\n`);
  });
  $('h3').each((_, el) => {
    $(el).replaceWith(`\n### ${$(el).text().trim()}\n`);
  });

  // Transform links
  $('a').each((_, el) => {
    const text = $(el).text().trim();
    const href = $(el).attr('href');
    if (text && href) {
      $(el).replaceWith(`[${text}](${href})`);
    }
  });

  // Transform buttons
  $('button, input[type="submit"]').each((_, el) => {
    const text = $(el).text().trim() || $(el).attr('value') || 'Submit';
    $(el).replaceWith(` [Button: ${text}] `);
  });

  // Extract clean text
  const text = $('body').text() || $.text();
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .join('\n');
}
