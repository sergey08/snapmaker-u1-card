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
assert(source.includes('this._lastLanguage!==language'), 'Language change must refresh the card');
assert(source.includes('this._lastThemeSignature!==themeSignature'), 'Theme changes must refresh the card');
assert(source.includes('statusMissing(printer)||statusMissing(state)'), 'Missing printer or print status must be treated as offline');
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
// Re-loading the resource must not duplicate the card in the picker.
vm.runInNewContext(source, {
  HTMLElement: HTMLElementMock,
  customElements: context.customElements,
  window: context.window,
  navigator: { language: 'en-US' },
  console
}, { filename: 'snapmaker-u1-card.js', timeout: 3000 });
assert.equal(context.window.customCards.filter(c => c.type === 'snapmaker-u1-card').length, 1, 'Duplicate card picker registration');
for (const locale of ['en', 'es', 'pt', 'fr', 'de', 'it', 'nl']) {
  const actual = vm.runInContext('cardLanguage({language:' + JSON.stringify(locale) + '},{language:"en"})', context);
  assert.equal(actual, locale, 'Language selection failed: ' + locale);
}
assert.equal(vm.runInContext('cardLanguage({language:"auto"},{language:"es-ES"})', context), 'es');
assert.equal(vm.runInContext('cardLanguage({language:"auto"},{language:"xx-XX"})', context), 'en');
console.log('Browser bundle initialization and locale smoke tests passed.');

// Verify disconnection and recovery trigger a fresh render without resetting config.
const CardClass = registered.get('snapmaker-u1-card');
const recoveryCard = new CardClass();
recoveryCard.config = {printer_state: 'sensor.u1_printer', print_state: 'sensor.u1_print', language: 'auto'};
let recoveryRenders = 0;
recoveryCard.render = () => { recoveryRenders++; };
const makeHass = (printer, print) => ({
  language: 'es-ES',
  states: {
    'sensor.u1_printer': {state: printer},
    'sensor.u1_print': {state: print}
  }
});
recoveryCard.hass = makeHass('online', 'printing');
assert.equal(recoveryRenders, 1, 'Initial connection must render');
recoveryCard.hass = makeHass('online', 'unavailable');
assert.equal(recoveryRenders, 2, 'Lost print-state feed must trigger a render');
recoveryCard.hass = makeHass('online', 'printing');
assert.equal(recoveryRenders, 3, 'Recovered print-state feed must trigger a render');
assert.equal(recoveryCard.config.printer_state, 'sensor.u1_printer', 'Recovery must preserve configuration');
console.log('Disconnection and recovery refresh tests passed.');


// Verify that every non-Spanish locale has the essential wizard requirement
// and detection-result translations, rather than silently falling back to English.
for (const locale of ['fr', 'de', 'it', 'pt', 'nl']) {
  const hasPrerequisite = vm.runInContext('Boolean(CARD_WIZARD_EXTRA_I18N[' + JSON.stringify(locale) + ']["Para utilizar todas las funciones necesitas Moonraker y Lava. Spoolman es opcional."])', context);
  const hasDetection = vm.runInContext('Boolean(CARD_WIZARD_EXTRA_I18N[' + JSON.stringify(locale) + ']["Detectadas y aplicadas"])', context);
  assert(hasPrerequisite && hasDetection, 'Wizard translation missing: ' + locale);
}
console.log('Wizard requirements and detection translations verified.');

// UI regression checks for the approved beta layout.
assert(source.includes('const previewHtml="";'), 'Redundant preview panel must remain hidden');
assert(source.includes('.job-summary{background:var(--u1-surface)'), 'Current-job panel must use the theme surface');
assert(source.includes('.filament-check .ok{background:color-mix'), 'Filament status must use the cyan theme');
assert(source.includes('tool-active-label'), 'Active T0-T3 label must remain visible');
console.log('Approved UI regression checks passed.');

// Prevent obsolete preview settings and missing job-label translations from returning.
assert(!source.includes('["preview_open_default","Miniatura abierta por defecto"]'), 'Removed preview toggle must not reappear in the editor');
for (const locale of ['en', 'fr', 'de', 'it', 'pt', 'nl']) {
  for (const label of ['Trabajo actual', 'En este trabajo']) {
    const actual = vm.runInContext('cardTranslate(' + JSON.stringify(label) + ',' + JSON.stringify(locale) + ')', context);
    assert.notEqual(actual, label, 'Untranslated job label: ' + locale + ' / ' + label);
  }
}
console.log('Job labels and obsolete preview setting verified.');

// Validate translated labels and registration with a simulated browser context.
assert.equal(vm.runInContext('cardTranslate("Trabajo actual","en")', context), 'Current job');
assert.equal(vm.runInContext('cardTranslate("En este trabajo","en")', context), 'Used in this job');
assert.equal(vm.runInContext('cardTranslate("Finalización estimada","de")', context), 'Voraussichtliches Ende');
assert(!source.includes('early preview, read-only'), 'Outdated read-only banner');
console.log('Release-candidate copy and translation checks passed.');
