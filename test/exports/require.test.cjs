/* eslint-disable @typescript-eslint/no-var-requires */
const { describe, test } = require('@jest/globals');
const assert = require('assert');
const contains = require('react-native-contains');

describe('exports .cjs', function () {
  test('defaults', function () {
    assert.equal(typeof contains, 'function');
  });
});
