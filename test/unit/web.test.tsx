// @ts-ignore
global.IS_REACT_ACT_ENVIRONMENT = true;
import '../lib/polyfills.cjs';

import assert from 'assert';
import React, { useRef } from 'react';
import { type Root, createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

// @ts-ignore
import contains from 'react-native-contains';
import { View } from 'react-native-web';
import getByTestId from '../lib/getByTestId';

describe('react-native-web', () => {
  let container: HTMLDivElement | null = null;
  let root: Root | null = null;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    root = null;
    container.remove();
    container = null;
  });

  it('self', () => {
    act(() =>
      root.render(
        <View>
          <View testID="root" />
        </View>
      )
    );

    assert.ok(contains(getByTestId(container, 'root'), getByTestId(container, 'root')));
  });

  it('inside', () => {
    act(() =>
      root.render(
        <View>
          <View testID="root">
            <View testID="inside" />
          </View>
        </View>
      )
    );

    assert.ok(contains(getByTestId(container, 'root'), getByTestId(container, 'inside')));
  });

  it('outside', () => {
    act(() =>
      root.render(
        <View>
          <View testID="root" />
          <View testID="outside" />
        </View>
      )
    );
    assert.ok(!contains(getByTestId(container, 'root'), getByTestId(container, 'outside')));
  });

  it('ref', () => {
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

    let value: unknown;
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
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
