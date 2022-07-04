import assert from 'assert';
import contains from 'react-native-contains';

describe('exports .mjs', function () {
  it('defaults', function () {
    assert.equal(typeof contains, 'function');
  });
});
