(function ensureDom() {
  if (typeof window !== 'undefined') return; // running in the browser

  const jsdom = require('jsdom');
  const doc = new jsdom.JSDOM('<!doctype html><html><body></body></html>');
  global.window = doc.window;
  global.document = doc.window.document;
  global.navigator = doc.window.navigator;
  global.ShadowRoot = function ShadowRoot() {
    /* empty */
  };
  global.ResizeObserver = function ResizeObserver() {
    /* empty */
  };
})();
