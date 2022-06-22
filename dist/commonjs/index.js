"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = contains;

function containsTag(node, tag) {
  if (!node._nativeTag) {
    return node === tag;
  }

  if (node._nativeTag === tag) {
    return true;
  }

  for (const child of node._children) {
    if (containsTag(child, tag)) {
      return true;
    }
  }

  return false;
}

function contains(element, target) {
  // web
  if (element.contains) {
    return element.contains(target);
  }

  return containsTag(element, target._nativeTag);
}
//# sourceMappingURL=index.js.map