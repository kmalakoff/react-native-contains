import assert from 'assert';
import React, { useRef } from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { View, TouchableOpacity } from 'react-native';
import contains, {NativeElement} from 'react-native-contains';

describe('react-native', function () {
  it('ref - workaround', function () {
    function Component({ onChange }) {
      const ref = useRef<View>(null);

      return (
        <View>
          <View testID="container" ref={ref}>
            <TouchableOpacity
              testID="inside"
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
  });

  it('ref - unexpected', function () {
    function Component({ onChange }) {
      const ref = useRef<NativeElement>(null);

      return (
        <View>
          <View testID="container" ref={ref}>
            <TouchableOpacity
              testID="inside"
              onPress={(event) => {
                assert.ok(ref.current === getByTestId('container'))
                onChange(
                  contains(
                    ref.current,
                    event.target,
                  ),
                );
              }}
            />
          </View>
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
  });
});
