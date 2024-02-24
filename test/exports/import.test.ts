import assert from 'assert';
// @ts-ignore
import contains from 'react-native-contains';

describe('exports .mjs', () => {
  it('defaults', () => {
    assert.equal(typeof contains, 'function');
  });
});
