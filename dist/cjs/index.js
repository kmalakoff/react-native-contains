"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = contains;

function containsNative(node, target) {
  if (!node._nativeTag) {
    return node === target._nativeTag;
  }

  if (node._nativeTag === target._nativeTag) {
    return true;
  }

  for (var i = 0; i < node._children.length; i++) {
    if (containsNative(node._children[i], target)) {
      return true;
    }
  }

  return false;
}

function containsDOM(node, target) {
  if (node == target) {
    return true;
  }

  for (var i = 0; i < node.children.length; i++) {
    if (containsDOM(node.children[i], target)) {
      return true;
    }
  }

  return false;
}

function contains(element, target) {
  // dom built-in
  if (element.contains) {
    return element.contains(target);
  } // native
  else if (target._nativeTag) {
    return containsNative(element, target);
  } // dom
  else {
    return containsDOM(element, target);
  }
}

module.exports = exports.default;
//# sourceMappingURL=index.js.map