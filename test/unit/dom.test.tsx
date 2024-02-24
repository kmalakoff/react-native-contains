// @ts-ignore
global.IS_REACT_ACT_ENVIRONMENT = true;
import '../lib/polyfills.cjs'

import assert from 'assert';
import React, { useRef } from 'react';
import { Root, createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

// @ts-ignore
import contains from 'react-native-contains';

describe('react-dom', () => {
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
        <div>
          <div id="root" />
        </div>
      )
    );
    assert.ok(contains(container.querySelector('#root'), container.querySelector('#root')));
  });

  it('inside', () => {
    act(() =>
      root.render(
        <div>
          <div id="root">
            <div id="inside" />
          </div>
        </div>
      )
    );
    assert.ok(contains(container.querySelector('#root'), container.querySelector('#inside')));
  });

  it('outside', () => {
    act(() =>
      root.render(
        <div>
          <div id="root" />
          <div id="outside" />
        </div>
      )
    );
    assert.ok(!contains(container.querySelector('#root'), container.querySelector('#outside')));
  });

  it('ref', () => {
    function Component({ onChange }) {
      const ref = useRef<HTMLDivElement>(null);

      return (
        <div>
          <div ref={ref}>
            <button
              type="button"
              id="inside"
              onClick={(event) => {
                assert.equal(typeof ref.current.contains, 'function');
                onChange(contains(ref.current, event.target as HTMLElement));
              }}
            />
          </div>
          <button
            type="button"
            id="outside"
            onClick={(event) => {
              assert.equal(typeof ref.current.contains, 'function');
              onChange(contains(ref.current, event.target as HTMLElement));
            }}
          />
        </div>
      );
    }

    let value: unknown;
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    const onChange = (x) => (value = x);
    act(() => root.render(<Component onChange={onChange} />));
    assert.equal(value, undefined);

    value = undefined;
    act(() => (container.querySelector('#inside') as HTMLElement).click());
    assert.equal(value, true);

    value = undefined;
    act(() => (container.querySelector('#outside') as HTMLElement).click());
    assert.equal(value, false);
  });
});
