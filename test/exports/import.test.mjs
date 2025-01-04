import assert from 'assert';
import contains from 'react-native-contains';

describe('exports .ts', () => {
  it('defaults', () => {
    assert.equal(typeof contains, 'function');
  });
});
