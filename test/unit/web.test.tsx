global.IS_REACT_ACT_ENVIRONMENT = true;

import assert from 'assert';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

import { View } from 'react-native-web';
import contains from 'react-native-contains';
import getByTestId from '../lib/getByTestId';

describe('react-native-web', function () {
  this.timeout(20000);

  let container: HTMLDivElement | null = null;
  let root: Root | null = null;
  beforeEach(function () {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(function () {
    act(() => root.unmount());
    root = null;
    container.remove();
    container = null;
  });

  it('self', function () {
    act(() =>
      root.render(
        <View>
          <View testID="root" />
        </View>,
      ),
    );

    assert.ok(
      contains(getByTestId(container, 'root'), getByTestId(container, 'root')),
    );
  });

  it('inside', function () {
    act(() =>
      root.render(
        <View>
          <View testID="root">
            <View testID="inside" />
          </View>
        </View>,
      ),
    );

    assert.ok(
      contains(
        getByTestId(container, 'root'),
        getByTestId(container, 'inside'),
      ),
    );
  });

  it('outside', function () {
    act(() =>
      root.render(
        <View>
          <View testID="root" />
          <View testID="outside" />
        </View>,
      ),
    );
    assert.ok(
      !contains(
        getByTestId(container, 'root'),
        getByTestId(container, 'outside'),
      ),
    );
  });

  it('ref', function () {
    function Component({ onChange }) {
      const ref = React.useRef<View>(null);

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
    act(() => root.render(<Component onChange={onChange} />));
    assert.equal(value, undefined);

    value = undefined;
    act(() => (getByTestId(container, 'inside') as HTMLElement).click());
    assert.equal(value, true);

    value = undefined;
    act(() => (getByTestId(container, 'outside') as HTMLElement).click());
    assert.equal(value, false);
  });
});
