import assert from 'assert';
import React, { useRef } from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { View, TouchableOpacity } from 'react-native';
import contains, { NativeElement } from 'react-native-contains';
import ti2ne from '../lib/testInstanceToNativeElement';

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
    function Component({ onChange, trackRef }) {
      const ref = useRef<NativeElement>(null);

      return (
        <View>
          <View testID="container" ref={() => trackRef(ref, 'container')}>
            <TouchableOpacity
              testID="inside"
              onPress={(event) => {
                onChange(contains(ref.current, event.target));
              }}
            />
          </View>
          <TouchableOpacity
            testID="outside"
            onPress={(event) => {
              onChange(contains(ref.current, event.target));
            }}
          />
        </View>
      );
    }

    let value;
    const onChange = (x) => (value = x);
    const refs = [];
    const trackRef = (ref, testID) => refs.push({ ref, testID });
    const { getByTestId } = render(
      <Component onChange={onChange} trackRef={trackRef} />,
    );
    assert.equal(value, undefined);
    refs.forEach(
      ({ ref, testID }) => (ref.current = ti2ne(getByTestId(testID))),
    ); // https://github.com/callstack/react-native-testing-library/issues/1006

    fireEvent.press(getByTestId('inside'), {
      target: ti2ne(getByTestId('inside')),
    });
    assert.equal(value, true);

    fireEvent.press(getByTestId('outside'), {
      target: ti2ne(getByTestId('outside')),
    });
    assert.equal(value, false);
  });
});
