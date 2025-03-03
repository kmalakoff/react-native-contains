import assert from 'assert';
import React, { useRef } from 'react';
import { act, create } from 'react-test-renderer';

import { TouchableOpacity, View } from 'react-native';
import type { GestureResponderEvent } from 'react-native';
// @ts-ignore
import contains, { type NativeElement } from 'react-native-contains';
import ti2ne from '../lib/testInstanceToNativeElement';

describe('react-native-mock', () => {
  it('self', async () => {
    const { root } = await act(() =>
      create(
        <View>
          <View testID="container" />
        </View>
      )
    );
    assert.ok(contains(ti2ne(root.findByProps({ testID: 'container' })), ti2ne(root.findByProps({ testID: 'container' }))));
  });

  it('inside', async () => {
    const { root } = await act(() =>
      create(
        <View>
          <View testID="container">
            <View testID="inside" />
          </View>
        </View>
      )
    );
    assert.ok(contains(ti2ne(root.findByProps({ testID: 'container' })), ti2ne(root.findByProps({ testID: 'inside' }))));
  });

  it('outside', async () => {
    const { root } = await act(() =>
      create(
        <View>
          <View testID="container" />
          <View testID="outside" />
        </View>
      )
    );
    assert.ok(!contains(ti2ne(root.findByProps({ testID: 'container' })), ti2ne(root.findByProps({ testID: 'outside' }))));
  });

  // TODO: fix rn usig web shim
  it.skip('ref', async () => {
    function Component({ onChange, registerRefValue }) {
      const ref = useRef<NativeElement>(null);

      return (
        <View>
          <View testID="container" ref={(value) => registerRefValue({ ref, value })}>
            <TouchableOpacity
              testID="inside"
              onPress={(event: GestureResponderEvent) => {
                assert.equal(typeof ref.current._nativeTag, 'number');
                onChange(contains(ref.current, event.target as unknown as NativeElement));
              }}
            />
          </View>
          <TouchableOpacity
            testID="outside"
            onPress={(event: GestureResponderEvent) => {
              assert.equal(typeof ref.current._nativeTag, 'number');
              onChange(contains(ref.current, event.target as unknown as NativeElement));
            }}
          />
        </View>
      );
    }

    let value: unknown;
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    const onChange = (x) => (value = x);
    const refValues = [];
    const registerRefValue = (refValue) => refValues.push(refValue);
    const { root } = await act(() => create(<Component onChange={onChange} registerRefValue={registerRefValue} />));

    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    refValues.forEach(({ ref, value }) => (ref.current = ti2ne(root.findByProps({ testID: value.props.testID })))); // https://github.com/callstack/react-native-testing-library/issues/1006
    assert.equal(value, undefined);

    value = undefined;
    act(() =>
      root.findByProps({ testID: 'inside' }).props.onPress({
        target: ti2ne(root.findByProps({ testID: 'inside' })),
      })
    );
    assert.equal(value, true);

    value = undefined;
    act(() =>
      root.findByProps({ testID: 'outside' }).props.onPress({
        target: ti2ne(root.findByProps({ testID: 'outside' })),
      })
    );
    assert.equal(value, false);
  });

  it('handles target tag', async () => {
    const { root } = await act(() =>
      create(
        <View>
          <View testID="container" />
        </View>
      )
    );

    assert.ok(contains(ti2ne(root.findByProps({ testID: 'container' })), ti2ne(root.findByProps({ testID: 'container' }))._nativeTag));
  });
});
