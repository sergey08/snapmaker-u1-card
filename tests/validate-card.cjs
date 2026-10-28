// Lightweight pre-release checks; no Home Assistant instance required.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const source = fs.readFileSync('snapmaker-u1-card.js', 'utf8');
const hacs = JSON.parse(fs.readFileSync('hacs.json', 'utf8'));
assert.equal(hacs.filename, 'snapmaker-u1-card.js');
assert.equal(hacs.content_in_root, true);
for (const tag of ['snapmaker-u1-card', 'snapmaker-u1-card-editor']) {
  assert(source.includes('customElements.define("' + tag + '"'), 'Missing custom element: ' + tag);
}
for (const locale of ['en', 'es', 'pt', 'fr', 'de', 'it', 'nl']) {
  assert(source.includes('"' + locale + '"'), 'Missing locale: ' + locale);
}
assert(source.includes('translateEditor(this.shadowRoot'), 'Editor translation missing');
assert(source.includes('CARD_EDITOR_EXTRA_I18N'), 'Advanced editor translations missing');
assert(source.includes('cardTranslate('), 'Card translation missing');
assert(source.includes('--u1-accent:#00a6d6'), 'EV Builder accent missing');
assert(source.includes('printer-action.emergency'), 'Emergency button styling missing');
console.log('Snapmaker U1 Card pre-release checks passed.');
