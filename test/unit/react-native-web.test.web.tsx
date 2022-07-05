/**
 * @jest-environment jsdom
 */

import assert from 'assert';
import React, { useRef } from 'react';
import { render, fireEvent } from '@testing-library/react';

import { View } from 'react-native-web';
import contains from 'react-native-contains';

describe('react-native-web', function () {
  it('inside', async function () {
    const { findByTestId } = render(
      <View>
        <View testID="root">
          <View testID="inside" />
        </View>
      </View>,
    );

    assert.ok(
      contains(await findByTestId('root'), await findByTestId('inside')),
    );
  });

  it('outside', async function () {
    const { findByTestId } = render(
      <View>
        <View testID="root" />
        <View testID="outside" />
      </View>,
    );
    assert.ok(
      !contains(await findByTestId('root'), await findByTestId('outside')),
    );
  });

  it('ref', async function () {
    function Component({ onChange }) {
      const ref = useRef<View>(null);

      return (
        <View>
          <View ref={ref}>
            <View
              testID="inside"
              onClick={(event) => {
                onChange(contains(ref.current, event.target));
              }}
            />
          </View>
          <View
            testID="outside"
            onClick={(event) => {
              onChange(contains(ref.current, event.target));
            }}
          />
        </View>
      );
    }

    let value;
    const onChange = (x) => (value = x);
    const { findByTestId } = render(<Component onChange={onChange} />);
    assert.equal(value, undefined);

    fireEvent.click(await findByTestId('inside'));
    assert.equal(value, true);

    fireEvent.click(await findByTestId('outside'));
    assert.equal(value, false);
  });
});
