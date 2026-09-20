export interface NativeElement {
  readonly _nativeTag: number;
  readonly _children?: readonly NativeElement[];
}

export interface NativeHost {
  contains(target: NativeHost): boolean;
}

export type ContainsElement = Node | NativeHost | NativeElement | ChildrenElement;
export type ContainsTarget = Node | NativeHost | NativeElement | ChildrenElement | number;

type PublicContains = { contains(target: unknown): boolean };

function hasPublicContains(value: unknown): value is PublicContains {
  return typeof value === 'object' && value !== null && typeof (value as { contains?: unknown }).contains === 'function';
}

function isLegacyNativeElement(value: ContainsElement | ContainsTarget): value is NativeElement {
  return typeof value === 'object' && value !== null && '_nativeTag' in value && typeof value._nativeTag === 'number';
}

function containsNative(node: NativeElement, targetTag: number): boolean {
  if (node._nativeTag === targetTag) {
    return true;
  }
  for (const child of node._children ?? []) {
    if (containsNative(child, targetTag)) {
      return true;
    }
  }
  return false;
}

function nativeTargetTag(target: ContainsTarget): number | undefined {
  if (typeof target === 'number') {
    return target;
  }
  return isLegacyNativeElement(target) ? target._nativeTag : undefined;
}

export interface ChildrenElement {
  readonly children: ArrayLike<ChildrenElement>;
}

function containsDOM(node: ChildrenElement, target: ChildrenElement): boolean {
  if (node === target) {
    return true;
  }
  for (const child of Array.from(node.children)) {
    if (containsDOM(child, target)) {
      return true;
    }
  }
  return false;
}

function hasChildren(value: unknown): value is ChildrenElement {
  return typeof value === 'object' && value !== null && 'children' in value && typeof (value as { children?: { length?: unknown } }).children?.length === 'number';
}

function contains(element: Node, target: Node): boolean;
function contains(element: NativeHost, target: NativeHost): boolean;
function contains(element: NativeElement, target: NativeElement | number): boolean;
function contains(element: ChildrenElement, target: ChildrenElement): boolean;
function contains(element: ContainsElement, target: ContainsTarget): boolean {
  const publicContains: PublicContains | undefined = hasPublicContains(element) ? element : undefined;
  if (publicContains) {
    return publicContains.contains(target);
  }

  if (hasChildren(element) && hasChildren(target)) {
    return containsDOM(element, target);
  }

  if (!isLegacyNativeElement(element)) {
    return false;
  }

  const targetTag = nativeTargetTag(target);
  return targetTag === undefined ? false : containsNative(element, targetTag);
}

export default contains;
