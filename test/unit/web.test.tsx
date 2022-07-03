/**
 * @jest-environment jsdom
 */

import { describe, it } from '@jest/globals';
import assert from 'assert';
import React, { useRef } from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { View } from 'react-native-web';
import contains from 'react-native-contains';
import getByTestIdFn from '../lib/getByTestIdFn';

describe('react-native-web', function () {
  it('inside', function () {
    const { container } = render(
      <View>
        <View testID="container">
          <View testID="inside" />
        </View>
      </View>,
    );
    const getByTestId = getByTestIdFn(container);
    assert.ok(
      contains(
        getByTestId('container') as unknown as HTMLElement,
        getByTestId('inside') as unknown as HTMLElement,
      ),
    );
  });

  it('outside', function () {
    const { container } = render(
      <View>
        <View testID="container" />
        <View testID="outside" />
      </View>,
    );
    const getByTestId = getByTestIdFn(container);
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
            <View
              testID="inside"
              onPress={(event) => {
                // TODO: try to get refs working - translate from ref to element
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
              // TODO: try to get refs working - translate from ref to element
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
    const { container } = render(<Component onChange={onChange} />);
    const getByTestId = getByTestIdFn(container);
    assert.equal(value, undefined);

    fireEvent.press(getByTestId('inside'), { target: getByTestId('inside') });
    assert.equal(value, true);

    fireEvent.press(getByTestId('outside'), { target: getByTestId('outside') });
    assert.equal(value, false);
  });
});
