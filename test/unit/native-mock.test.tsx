import assert from 'assert';
import React, { useRef } from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { View, TouchableOpacity } from 'react-native';
import contains, { NativeElement } from 'react-native-contains';
import ti2ne from '../lib/testInstanceToNativeElement';

describe('react-native', function () {
  it('self', function () {
    const { getByTestId } = render(
      <View>
        <View testID="container" />
      </View>,
    );
    assert.ok(
      contains(
        ti2ne(getByTestId('container')),
        ti2ne(getByTestId('container')),
      ),
    );
  });

  it('inside', function () {
    const { getByTestId } = render(
      <View>
        <View testID="container">
          <View testID="inside" />
        </View>
      </View>,
    );
    assert.ok(
      contains(ti2ne(getByTestId('container')), ti2ne(getByTestId('inside'))),
    );
  });

  it('outside', function () {
    const { getByTestId } = render(
      <View>
        <View testID="container" />
        <View testID="outside" />
      </View>,
    );
    assert.ok(
      !contains(ti2ne(getByTestId('container')), ti2ne(getByTestId('outside'))),
    );
  });

  it('ref', function () {
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
                assert.equal(typeof ref.current._nativeTag, 'number');
                onChange(contains(ref.current, event.target));
              }}
            />
          </View>
          <TouchableOpacity
            testID="outside"
            onPress={(event) => {
              assert.equal(typeof ref.current._nativeTag, 'number');
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
    const { getByTestId } = render(
      <Component onChange={onChange} registerRefValue={registerRefValue} />,
    );
    refValues.forEach(
      ({ ref, value }) =>
        (ref.current = ti2ne(getByTestId(value.props.testID))),
    ); // https://github.com/callstack/react-native-testing-library/issues/1006
    assert.equal(value, undefined);

    value = undefined;
    fireEvent.press(getByTestId('inside'), {
      target: ti2ne(getByTestId('inside')),
    });
    assert.equal(value, true);

    value = undefined;
    fireEvent.press(getByTestId('outside'), {
      target: ti2ne(getByTestId('outside')),
    });
    assert.equal(value, false);
  });

  it('handles target tag', function () {
    const { getByTestId } = render(
      <View>
        <View testID="container" />
      </View>,
    );
    assert.ok(
      contains(
        ti2ne(getByTestId('container')),
        ti2ne(getByTestId('container'))._nativeTag,
      ),
    );
  });
});
