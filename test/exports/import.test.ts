import { describe, it } from '@jest/globals';
import assert from 'assert';
import contains from 'react-native-contains';

describe('exports .ts', function () {
  it('defaults', function () {
    assert.equal(typeof contains, 'function');
  });
});
