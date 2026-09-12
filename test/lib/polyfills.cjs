(function ensureDom() {
  if (typeof window !== 'undefined') return; // running in the browser
  try {
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
  } catch (_) {
    // jsdom's own engines floor is above this node; the DOM suite skips where document stays undefined
  }
})();
