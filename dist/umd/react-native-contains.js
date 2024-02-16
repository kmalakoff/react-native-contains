(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.reactNativeContains = factory());
})(this, (function () { 'use strict';

  function containsNative(node, targetTag) {
      if (node._nativeTag === targetTag) {
          return true;
      }
      if (node._children) {
          for(var i = 0; i < node._children.length; i++){
              if (containsNative(node._children[i], targetTag)) {
                  return true;
              }
          }
      }
      return false;
  }
  function containsDOM(node, target) {
      if (node === target) {
          return true;
      }
      if (node.children) {
          for(var i = 0; i < node.children.length; i++){
              if (containsDOM(node.children[i], target)) {
                  return true;
              }
          }
      }
      return false;
  }
  function contains(element, target) {
      // dom built-in
      if (element.contains) {
          return element.contains(target);
      }
      // dom tree
      if (element.children) {
          return containsDOM(element, target);
      }
      var _target__nativeTag;
      // native
      return containsNative(element, (_target__nativeTag = target._nativeTag) !== null && _target__nativeTag !== void 0 ? _target__nativeTag : target);
  }

  return contains;

}));
//# sourceMappingURL=react-native-contains.js.map
