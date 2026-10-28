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

// Execute the complete browser bundle in a minimal DOM-like VM to catch
// top-level initialization errors and verify the public card registration.
const vm = require('node:vm');
const registered = new Map();
class HTMLElementMock {}
const context = vm.createContext({
  HTMLElement: HTMLElementMock,
  customElements: {
    get: name => registered.get(name),
    define: (name, klass) => {
      assert(!registered.has(name), 'Duplicate custom element: ' + name);
      registered.set(name, klass);
    }
  },
  window: { customCards: [] },
  navigator: { language: 'en-US' },
  console
});
vm.runInContext(source, context, { filename: 'snapmaker-u1-card.js', timeout: 3000 });
assert(registered.has('snapmaker-u1-card'), 'Card did not register');
assert(registered.has('snapmaker-u1-card-editor'), 'Editor did not register');
assert(context.window.customCards.some(c => c.type === 'snapmaker-u1-card'), 'Card picker registration missing');
for (const locale of ['en', 'es', 'pt', 'fr', 'de', 'it', 'nl']) {
  const actual = vm.runInContext('cardLanguage({language:' + JSON.stringify(locale) + '},{language:"en"})', context);
  assert.equal(actual, locale, 'Language selection failed: ' + locale);
}
assert.equal(vm.runInContext('cardLanguage({language:"auto"},{language:"es-ES"})', context), 'es');
assert.equal(vm.runInContext('cardLanguage({language:"auto"},{language:"xx-XX"})', context), 'en');
console.log('Browser bundle initialization and locale smoke tests passed.');

// Verify that every non-Spanish locale has the essential wizard requirement
// and detection-result translations, rather than silently falling back to English.
for (const locale of ['fr', 'de', 'it', 'pt', 'nl']) {
  const hasPrerequisite = vm.runInContext('Boolean(CARD_WIZARD_EXTRA_I18N[' + JSON.stringify(locale) + ']["Para utilizar todas las funciones necesitas Moonraker y Lava. Spoolman es opcional."])', context);
  const hasDetection = vm.runInContext('Boolean(CARD_WIZARD_EXTRA_I18N[' + JSON.stringify(locale) + ']["Detectadas y aplicadas"])', context);
  assert(hasPrerequisite && hasDetection, 'Wizard translation missing: ' + locale);
}
console.log('Wizard requirements and detection translations verified.');
