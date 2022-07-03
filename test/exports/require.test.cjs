/* eslint-disable @typescript-eslint/no-var-requires */
const { describe, it } = require('@jest/globals');
const assert = require('assert');
const contains = require('react-native-contains');

describe('exports .cjs', function () {
  it('defaults', function () {
    assert.equal(typeof contains, 'function');
  });
});
