import { describe, it, expect } from 'vitest';
import { cleanHtml, htmlToMarkdown } from '../services/crawler/html-cleaner';
import { extractForms, extractListContainers } from '../services/crawler/form-extractor';

describe('HTML Sanitizer & Extractor', () => {
  const sampleHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Flight Finder Portal</title>
        <style>body { background: #000; }</style>
        <script>console.log("analytics tracking");</script>
      </head>
      <body>
        <nav><a href="/home">Home</a> <a href="/deals">Deals</a></nav>
        <main>
          <h1>Book Cheap Flights</h1>
          <form id="search-flights-form" action="/search" method="GET">
            <label for="origin-input">Departure City</label>
            <input type="text" id="origin-input" name="origin" placeholder="e.g. NYC" required />

            <label for="dest-input">Arrival City</label>
            <input type="text" id="dest-input" name="destination" placeholder="e.g. LON" required />

            <label for="trip-type">Class</label>
            <select id="trip-type" name="cabinClass">
              <option value="economy" selected>Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>

            <button type="submit">Search Flights</button>
          </form>

          <div class="results-container">
            <div class="flight-card">
              <h3 class="airline">Delta Airlines</h3>
              <span class="price">$350</span>
              <span class="flight-id" data-id="FL-101">FL-101</span>
            </div>
            <div class="flight-card">
              <h3 class="airline">British Airways</h3>
              <span class="price">$420</span>
              <span class="flight-id" data-id="FL-202">FL-202</span>
            </div>
          </div>
        </main>
      </body>
    </html>
  `;

  it('cleanHtml strips script and style tags while preserving structure', () => {
    const cleaned = cleanHtml(sampleHtml);
    expect(cleaned).not.toContain('console.log');
    expect(cleaned).not.toContain('body { background: #000; }');
    expect(cleaned).toContain('Book Cheap Flights');
    expect(cleaned).toContain('search-flights-form');
  });

  it('htmlToMarkdown produces clean semantic text for LLMs', () => {
    const md = htmlToMarkdown(sampleHtml);
    expect(md).toContain('# Book Cheap Flights');
    expect(md).toContain('Search Flights');
  });

  it('extractForms accurately detects form fields, types, options, and actions', () => {
    const forms = extractForms(sampleHtml);
    expect(forms.length).toBe(1);
    const form = forms[0];
    expect(form.id).toBe('search-flights-form');
    expect(form.action).toBe('/search');
    expect(form.method.toUpperCase()).toBe('GET');
    expect(form.submitButtonText).toBe('Search Flights');

    const originField = form.fields.find(f => f.name === 'origin');
    expect(originField).toBeDefined();
    expect(originField?.required).toBe(true);

    const selectField = form.fields.find(f => f.name === 'cabinClass');
    expect(selectField).toBeDefined();
    expect(selectField?.options).toEqual(['economy', 'business', 'first']);
  });

  it('extractListContainers detects repeated entity card patterns', () => {
    const containers = extractListContainers(sampleHtml);
    expect(containers.length).toBeGreaterThan(0);
    const flightContainer = containers.find(c => c.sampleItemsCount === 2);
    expect(flightContainer).toBeDefined();
    expect(flightContainer?.extractedFields).toContain('Delta Airlines');
    expect(flightContainer?.extractedFields).toContain('$350');
  });
});
