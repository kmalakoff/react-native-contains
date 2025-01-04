const assert = require('assert');
const contains = require('react-native-contains/dist/umd/react-native-contains.cjs');

describe('exports react-native-contains/dist/umd/react-native-contains.cjs', () => {
  it('defaults', () => {
    assert.equal(typeof contains, 'function');
  });
});
