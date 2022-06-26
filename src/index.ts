export interface NativeElement {
  _nativeTag: number;
  _children: NativeElement[];
}

function containsNative(node: NativeElement, target: NativeElement) {
  if (!node._nativeTag) {
    return (node as unknown as number) === target._nativeTag;
  }
  if (node._nativeTag === target._nativeTag) {
    return true;
  }
  for (let i = 0; i < node._children.length; i++) {
    if (containsNative(node._children[i], target)) {
      return true;
    }
  }
  return false;
}

function containsDOM(node: Element, target: HTMLElement) {
  if (node == target) {
    return true;
  }
  for (let i = 0; i < node.children.length; i++) {
    if (containsDOM(node.children[i], target)) {
      return true;
    }
  }
  return false;
}

export default function contains(
  element: HTMLElement | NativeElement,
  target: HTMLElement | NativeElement,
) {
  // dom built-in
  if ((element as HTMLElement).contains) {
    return (element as HTMLElement).contains(target as HTMLElement);
  }

  // native
  else if ((target as NativeElement)._nativeTag) {
    return containsNative(element as NativeElement, target as NativeElement);
  }

  // dom
  else {
    return containsDOM(element as Element, target as HTMLElement);
  }
}
