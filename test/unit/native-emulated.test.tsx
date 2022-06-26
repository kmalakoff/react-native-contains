import { describe, test } from '@jest/globals';
import assert from 'assert';
import React from 'react';
import { render } from '@testing-library/react-native';

import { View } from 'react-native';
import contains from 'react-native-contains';
import toNativeElement from '../lib/toNativeElement';

describe('react-native emulated', function () {
  test('inside', function () {
    const { getByTestId } = render(
      <View>
        <View testID="container">
          <View testID="inside" />
        </View>
      </View>,
    );
    assert.ok(
      contains(
        toNativeElement(getByTestId('container')),
        toNativeElement(getByTestId('inside')),
      ),
    );
  });

  test('outside', function () {
    const { getByTestId } = render(
      <View>
        <View testID="container" />
        <View testID="outside" />
      </View>,
    );
    assert.ok(
      !contains(
        toNativeElement(getByTestId('container')),
        toNativeElement(getByTestId('outside')),
      ),
    );
  });
});
