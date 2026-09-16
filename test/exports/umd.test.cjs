const assert = require('assert');

const umd = require('react-native-contains/umd');
const reactNativeContains = umd.default || umd;

describe('exports umd', () => {
  it('defaults', () => {
    assert.equal(typeof reactNativeContains, 'function');
  });
});
