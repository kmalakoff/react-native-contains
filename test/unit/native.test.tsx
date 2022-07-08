import assert from 'assert';
import React, { useRef } from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { View, TouchableOpacity } from 'react-native';
import contains from 'react-native-contains';

describe('react-native', function () {
  it('self', function () {
    const { getByTestId } = render(
      <View>
        <View testID="container" />
      </View>,
    );
    assert.ok(
      contains(
        getByTestId('container') as unknown as HTMLElement,
        getByTestId('container') as unknown as HTMLElement,
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
      contains(
        getByTestId('container') as unknown as HTMLElement,
        getByTestId('inside') as unknown as HTMLElement,
      ),
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
      !contains(
        getByTestId('container') as unknown as HTMLElement,
        getByTestId('outside') as unknown as HTMLElement,
      ),
    );
  });

  it('ref', async function () {
    function Component({ onChange, registerRefValue }) {
      const ref = useRef<Element>(null);

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
    const { getByTestId } = await render(
      <Component onChange={onChange} registerRefValue={registerRefValue} />,
    );
    refValues.forEach(
      ({ ref, value }) => (ref.current = getByTestId(value.props.testID)),
    ); // https://github.com/callstack/react-native-testing-library/issues/1006
    assert.equal(value, undefined);

    value = undefined;
    fireEvent.press(getByTestId('inside'), { target: getByTestId('inside') });
    assert.equal(value, true);

    value = undefined;
    fireEvent.press(getByTestId('outside'), { target: getByTestId('outside') });
    assert.equal(value, false);
  });
});
