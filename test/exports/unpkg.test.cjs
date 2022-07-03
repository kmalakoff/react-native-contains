/* eslint-disable @typescript-eslint/no-var-requires */
const { describe, it } = require('@jest/globals');
const assert = require('assert');
const contains = require('react-native-contains/dist/umd/react-native-contains.js');

describe('exports react-native-contains/dist/umd/react-native-contains.js', function () {
  it('defaults', function () {
    assert.equal(typeof contains, 'function');
  });
});
