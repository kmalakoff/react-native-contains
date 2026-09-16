(function ensureDom() {
  if (typeof window !== 'undefined') return;
  // Real browsers cover DOM behavior on Node versions below jsdom's floor.
  const { satisfies } = require('semver');
  if (!satisfies(process.versions.node, require('jsdom/package.json').engines.node)) return;
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  global.window = dom.window;
  global.document = dom.window.document;
  Object.defineProperty(global, 'navigator', { configurable: true, value: dom.window.navigator });
})();
