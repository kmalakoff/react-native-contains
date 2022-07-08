/**
 * @jest-environment jsdom
 */

import assert from 'assert';
import React, { useRef } from 'react';
import { render, fireEvent } from '@testing-library/react';

import { View } from 'react-native-web';
import contains from 'react-native-contains';

describe('react-native-web', function () {
  it('self', async function () {
    const { findByTestId } = render(
      <View>
        <View testID="root" />
      </View>,
    );

    assert.ok(contains(await findByTestId('root'), await findByTestId('root')));
  });

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
                assert.equal(typeof ref.current.contains, 'function');
                onChange(contains(ref.current, event.target));
              }}
            />
          </View>
          <View
            testID="outside"
            onClick={(event) => {
              assert.equal(typeof ref.current.contains, 'function');
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

    value = undefined;
    fireEvent.click(await findByTestId('inside'));
    assert.equal(value, true);

    value = undefined;
    fireEvent.click(await findByTestId('outside'));
    assert.equal(value, false);
  });
});
