export interface NativeElement extends Element {
  _nativeTag: number;
  _children: NativeElement[];
}

function containsNative(node: NativeElement, targetTag: number) {
  if (node._nativeTag === targetTag) {
    return true;
  }
  if (node._children) {
    for (let i = 0; i < node._children.length; i++) {
      if (containsNative(node._children[i], targetTag)) {
        return true;
      }
    }
  }
  return false;
}

function containsDOM(node: Element, target: Element) {
  if (node == target) {
    return true;
  }
  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      if (containsDOM(node.children[i], target)) {
        return true;
      }
    }
  }
  return false;
}

export default function contains(
  element: Element | HTMLElement | NativeElement | number,
  target: Element | HTMLElement | NativeElement | number,
) {
  // dom built-in
  if ((element as HTMLElement).contains) {
    return (element as HTMLElement).contains(target as HTMLElement);
  }

  // dom tree
  else if ((element as Element).children) {
    return containsDOM(element as Element, target as Element);
  }

  // native
  return containsNative(
    element as NativeElement,
    (target as NativeElement)._nativeTag ?? (target as number),
  );
}
