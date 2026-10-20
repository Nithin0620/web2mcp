import * as cheerio from 'cheerio';
import type { ExtractedForm, ExtractedFormField, ExtractedListContainer } from '../../types/platform';

export function extractForms(html: string): ExtractedForm[] {
  const $ = cheerio.load(html);
  const forms: ExtractedForm[] = [];

  $('form').each((_, formEl) => {
    const $form = $(formEl);
    const formId = $form.attr('id') || undefined;
    const action = $form.attr('action') || undefined;
    const method = ($form.attr('method') || 'GET').toUpperCase();

    const fields: ExtractedFormField[] = [];

    // Inputs & textareas
    $form.find('input, textarea, select').each((_, inputEl) => {
      const $input = $(inputEl);
      const name = $input.attr('name') || $input.attr('id');
      const type = ($input.attr('type') || inputEl.tagName).toLowerCase();

      if (!name || type === 'submit' || type === 'hidden' || type === 'button') {
        return;
      }

      // Check for associated label
      let labelText: string | undefined;
      const inputId = $input.attr('id');
      if (inputId) {
        const label = $(`label[for="${inputId}"]`).first().text().trim();
        if (label) labelText = label;
      }
      if (!labelText) {
        labelText = $input.closest('label').text().trim() || undefined;
      }

      const placeholder = $input.attr('placeholder') || undefined;
      const required = Boolean($input.attr('required') || $input.prop('required'));
      const defaultValue = $input.val() ? String($input.val()) : undefined;

      // Extract options if select
      let options: string[] | undefined;
      if (inputEl.tagName === 'select') {
        options = [];
        $input.find('option').each((_, optEl) => {
          const val = $(optEl).attr('value') ?? $(optEl).text().trim();
          if (val) options?.push(val);
        });
      }

      fields.push({
        name,
        type,
        label: labelText,
        placeholder,
        required,
        options,
        defaultValue,
        selector: inputId ? `#${inputId}` : `[name="${name}"]`,
      });
    });

    const submitBtn = $form.find('button[type="submit"], input[type="submit"], button:not([type="button"])').first();
    const submitButtonText = submitBtn.text().trim() || submitBtn.attr('value') || undefined;

    // Guess purpose
    const allText = ($form.text() + ' ' + (action || '')).toLowerCase();
    let purposeGuess = 'query';
    if (allText.includes('search') || allText.includes('find') || allText.includes('filter')) {
      purposeGuess = 'search';
    } else if (allText.includes('book') || allText.includes('reserve') || allText.includes('checkout')) {
      purposeGuess = 'booking';
    } else if (allText.includes('submit') || allText.includes('contact') || allText.includes('apply')) {
      purposeGuess = 'submission';
    }

    if (fields.length > 0) {
      forms.push({
        id: formId,
        action,
        method,
        fields,
        submitButtonText,
        purposeGuess,
      });
    }
  });

  return forms;
}

export function extractListContainers(html: string): ExtractedListContainer[] {
  const $ = cheerio.load(html);
  const containers: ExtractedListContainer[] = [];

  // Look for potential repeated card containers
  $('div, ul, section, tbody').each((_, el) => {
    const $el = $(el);
    const children = $el.children();

    if (children.length >= 2) {
      // Check if children have same class or tag
      const firstClass = children.first().attr('class');
      if (firstClass && firstClass.trim().length > 0) {
        const sampleClass = firstClass.split(/\s+/)[0];
        const matching = $el.find(`.${sampleClass}`);

        if (matching.length >= 2 && matching.length <= 100) {
          const sampleFields: string[] = [];
          matching.slice(0, 3).each((_, item) => {
            $(item).find('h1, h2, h3, h4, span, p, a, td').each((_, textEl) => {
              const text = $(textEl).text().trim();
              if (text && text.length > 1 && text.length < 80 && !sampleFields.includes(text)) {
                sampleFields.push(text);
              }
            });
          });

          if (sampleFields.length >= 2) {
            const containerSelector = $el.attr('class') ? `.${$el.attr('class')?.split(/\s+/)[0]}` : el.tagName;
            const itemSelector = `.${sampleClass}`;

            containers.push({
              containerSelector,
              itemSelector,
              sampleItemsCount: matching.length,
              extractedFields: sampleFields,
            });
          }
        }
      }
    }
  });

  return containers;
}
