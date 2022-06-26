import { describe, test } from '@jest/globals';
import assert from 'assert';
import React, { useRef } from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { View } from 'react-native';
import contains from 'react-native-contains';

describe('react-native', function () {
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
        getByTestId('container') as unknown as HTMLElement,
        getByTestId('inside') as unknown as HTMLElement,
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
        getByTestId('container') as unknown as HTMLElement,
        getByTestId('outside') as unknown as HTMLElement,
      ),
    );
  });

  test('ref', function () {
    function Component({ onChange }) {
      const ref = useRef();

      return (
        <View>
          <View testID="container" ref={ref}>
            <View
              testID="inside"
              onPress={(event) => {
                // TODO: try to get refs working - translate from ref to element?
                onChange(
                  contains(
                    getByTestId('container') as unknown as HTMLElement,
                    event.target,
                  ),
                );
              }}
            />
          </View>
          <View
            testID="outside"
            onPress={(event) => {
              // TODO: try to get refs working - translate from ref to element?
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
