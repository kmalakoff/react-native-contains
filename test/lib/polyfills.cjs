(function ensureDom() {
  if (typeof window !== 'undefined') return; // running in the browser

  const jsdom = require('jsdom');
  const doc = new jsdom.jsdom('<!doctype html><html><body></body></html>');
  global.document = doc;
  global.window = doc.defaultView;
  global.navigator = doc.defaultView.navigator;
  global.ShadowRoot = function ShadowRoot() {
    /* empty */
  };
  global.ResizeObserver = function ResizeObserver() {
    /* empty */
  };
})();

if (!Array.prototype.includes)
  Array.prototype.includes = function (x) {
    this.indexOf(x) >= 0;
  };
