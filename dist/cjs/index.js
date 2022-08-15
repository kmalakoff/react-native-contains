"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return contains;
    }
});
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
    if (node == target) {
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
    } else if (element.children) {
        return containsDOM(element, target);
    }
    var __nativeTag;
    // native
    return containsNative(element, (__nativeTag = target._nativeTag) !== null && __nativeTag !== void 0 ? __nativeTag : target);
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}