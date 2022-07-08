const assert = require('assert');
const contains = require('react-native-contains');

describe('exports .ts', function () {
  it('defaults', function () {
    assert.equal(typeof contains, 'function');
  });
});
