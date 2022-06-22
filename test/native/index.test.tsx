import assert from 'assert';
import React from 'react';
import { View } from 'react-native';
import { create } from 'react-test-renderer';
import contains from '../../src/index';
import toNativeElement from '../lib/toNativeElement';

describe('native', function () {
  test('inside', function () {
    const render = create(
      <View>
        <View testID="container">
          <View testID="inside" />
        </View>
      </View>,
    );
    const container = render.root.findByProps({ testID: 'container' });
    const inside = render.root.findByProps({ testID: 'inside' });

    assert.ok(contains(toNativeElement(container), toNativeElement(inside)));
  });

  test('outside', function () {
    const render = create(
      <View>
        <View testID="container" />
        <View testID="outside" />
      </View>,
    );
    const container = render.root.findByProps({ testID: 'container' });
    const outside = render.root.findByProps({ testID: 'outside' });

    assert.ok(!contains(toNativeElement(container), toNativeElement(outside)));
  });
});
