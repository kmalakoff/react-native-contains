const assert = require('assert');

let umd = null;
try {
  umd = require('react-native-contains/umd');
} catch (_) {
  umd = require('react-native-contains/dist/umd/react-native-contains.cjs');
}
const reactNativeContains = typeof window !== 'undefined' ? window.reactNativeContains : umd.default || umd;

describe('exports umd', () => {
  it('defaults', () => {
    assert.equal(typeof reactNativeContains, 'function');
  });
});
