import assert from 'assert';
import React, { useRef } from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { View, TouchableOpacity } from 'react-native';
import contains from 'react-native-contains';

describe('react-native', function () {
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

  it('ref', function () {
    function Component({ onChange }) {
      const ref = useRef<View>(null);

      return (
        <View>
          <View testID="container" ref={ref}>
            <TouchableOpacity
              testID="inside"
              onPress={(event) => {
                // assert.ok(ref.current === getByTestId('container'))
                onChange(
                  contains(
                    // ref.current,
                    getByTestId('container') as unknown as HTMLElement,
                    event.target,
                  ),
                );
              }}
            />
          </View>
          <TouchableOpacity
            testID="outside"
            onPress={(event) => {
              onChange(
                contains(
                  getByTestId('container') as unknown as HTMLElement,
                  event.target,
                ),
              );
            }}
          />
        </View>
      );
    }

    let value;
    const onChange = function (x) {
      value = x;
    };
    const { getByTestId } = render(<Component onChange={onChange} />);
    assert.equal(value, undefined);

    fireEvent.press(getByTestId('inside'), { target: getByTestId('inside') });
    assert.equal(value, true);

    fireEvent.press(getByTestId('outside'), { target: getByTestId('outside') });
    assert.equal(value, false);
  });
});
