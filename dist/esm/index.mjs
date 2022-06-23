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

export default function contains(element, target) {
  // web
  if (element.contains) {
    return element.contains(target);
  }

  return containsTag(element, target._nativeTag);
}
//# sourceMappingURL=index.mjs.map