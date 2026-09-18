import assert from 'assert';

import contains, { type ChildrenElement } from 'react-native-contains';

describe('plain children fallback', () => {
  it('traverses plain legacy trees without a public contains method', () => {
    const target: ChildrenElement = { children: [] };
    const nested: ChildrenElement = { children: [target] };
    const root: ChildrenElement = { children: [{ children: [] }, nested] };

    assert.equal(contains(root, target), true);
    assert.equal(contains(root, root), true);
    assert.equal(contains(root, { children: [] }), false);
  });
});
