const assert = require('assert');
const contains = require('react-native-contains/dist/umd/react-native-contains.min.cjs');

describe('exports react-native-contains/dist/umd/react-native-contains.min.cjs', () => {
  it('defaults', () => {
    assert.equal(typeof contains, 'function');
  });
});
