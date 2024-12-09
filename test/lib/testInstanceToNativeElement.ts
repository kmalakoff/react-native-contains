import type { ReactTestInstance } from 'react-test-renderer';
import type { NativeElement } from '../../src/index';

let _nativeTag = 1;
const map = new Map();

export default function testInstanceToNativeElement(node: ReactTestInstance): NativeElement {
  const found = map.get(node);
  if (found) return found;

  const element = {
    _nativeTag: _nativeTag++,
    _children: node.children.map(testInstanceToNativeElement),
  } as NativeElement;
  map.set(node, element);
  return element;
}
