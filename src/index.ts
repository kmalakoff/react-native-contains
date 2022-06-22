export interface NativeElement {
  _nativeTag: number;
  _children: NativeElement[];
}

function containsTag(node: NativeElement, tag: number) {
  if (!node._nativeTag) {
    return (node as unknown as number) === tag;
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

export default function contains(
  element: HTMLElement | NativeElement,
  target: HTMLElement | NativeElement,
) {
  // web
  if ((element as HTMLElement).contains) {
    return (element as HTMLElement).contains(target as HTMLElement);
  }
  return containsTag(
    element as NativeElement,
    (target as NativeElement)._nativeTag,
  );
}
