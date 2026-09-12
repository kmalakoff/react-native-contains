import assert from 'assert';

import contains, { type NativeElement } from 'react-native-contains';

const element = (tag: number, children: NativeElement[] = []): NativeElement =>
  ({
    _nativeTag: tag,
    _children: children,
  }) as NativeElement;

describe('native legacy fallback', () => {
  it('contains the same native tag', () => {
    const container = element(1);

    assert.equal(contains(container, container), true);
  });

  it('recursively contains a descendant native tag', () => {
    const descendant = element(3);
    const container = element(1, [element(2, [descendant])]);

    assert.equal(contains(container, descendant._nativeTag), true);
  });

  it('does not contain a native tag from another tree', () => {
    const container = element(1, [element(2)]);
    const outside = element(3);

    assert.equal(contains(container, outside._nativeTag), false);
  });
});
