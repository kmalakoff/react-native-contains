import { describe, test } from '@jest/globals';
import assert from 'assert';
import contains from 'react-native-contains';

describe('exports .mjs', function () {
  test('defaults', function () {
    assert.equal(typeof contains, 'function');
  });
});
