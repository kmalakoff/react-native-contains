import assert from 'assert';
import React, { useRef } from 'react';
import { create, act } from 'react-test-renderer';

import * as RN from 'react-native';
import contains, { NativeElement } from 'react-native-contains';

const { View, TouchableOpacity } = RN;

describe('react-native', function () {
  this.timeout(20000);

  it('self', async function () {
    const { root } = await act(() =>
      create(
        <View>
          <View testID="container" />
        </View>,
      ),
    );
    assert.ok(
      contains(
        root.findByProps({ testID: 'container' }),
        root.findByProps({ testID: 'container' }),
      ),
    );
  });

  it('inside', async function () {
    const { root } = await act(() =>
      create(
        <View>
          <View testID="container">
            <View testID="inside" />
          </View>
        </View>,
      ),
    );
    assert.ok(
      contains(
        root.findByProps({ testID: 'container' }),
        root.findByProps({ testID: 'inside' }),
      ),
    );
  });

  it('outside', async function () {
    const { root } = await act(() =>
      create(
        <View>
          <View testID="container" />
          <View testID="outside" />
        </View>,
      ),
    );
    assert.ok(
      !contains(
        root.findByProps({ testID: 'container' }),
        root.findByProps({ testID: 'outside' }),
      ),
    );
  });

  it('ref', async function () {
    function Component({ onChange, registerRefValue }) {
      const ref = useRef<NativeElement>(null);

      return (
        <View>
          <View
            testID="container"
            ref={(value) => registerRefValue({ ref, value })}
          >
            <TouchableOpacity
              testID="inside"
              onPress={(event) => {
                assert.ok(Array.isArray(ref.current.children));
                onChange(contains(ref.current, event.target));
              }}
            />
          </View>
          <TouchableOpacity
            testID="outside"
            onPress={(event) => {
              assert.ok(Array.isArray(ref.current.children));
              onChange(contains(ref.current, event.target));
            }}
          />
        </View>
      );
    }

    let value;
    const onChange = (x) => (value = x);
    const refValues = [];
    const registerRefValue = (refValue) => refValues.push(refValue);
    const { root } = await act(() =>
      create(
        <Component onChange={onChange} registerRefValue={registerRefValue} />,
      ),
    );
    refValues.forEach(
      ({ ref, value }) =>
        (ref.current = root.findByProps({ testID: value.props.testID })),
    ); // https://github.com/callstack/react-native-testing-library/issues/1006
    assert.equal(value, undefined);

    value = undefined;
    act(() =>
      root.findByProps({ testID: 'inside' }).props.onPress({
        target: root.findByProps({ testID: 'inside' }),
      }),
    );
    assert.equal(value, true);

    value = undefined;
    act(() =>
      root.findByProps({ testID: 'outside' }).props.onPress({
        target: root.findByProps({ testID: 'outside' }),
      }),
    );
    assert.equal(value, false);
  });
});
