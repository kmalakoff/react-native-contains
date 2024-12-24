const assert = require('assert');
const contains = require('react-native-contains/dist/umd/react-native-contains.min.js');

describe('exports react-native-contains/dist/umd/react-native-contains.min.js', () => {
  it('defaults', () => {
    assert.equal(typeof contains, 'function');
  });
});
