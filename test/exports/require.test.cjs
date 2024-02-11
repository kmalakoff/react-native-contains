const assert = require('assert');
const contains = require('react-native-contains');

describe('exports .ts', () => {
  it('defaults', () => {
    assert.equal(typeof contains, 'function');
  });
});
