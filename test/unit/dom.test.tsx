/**
 * @jest-environment jsdom
 */

global.IS_REACT_ACT_ENVIRONMENT = true;

import assert from 'assert';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

import contains from 'react-native-contains';

describe('react-dom', function () {
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
        <div>
          <div id="root" />
        </div>,
      ),
    );
    assert.ok(
      contains(
        container.querySelector('#root'),
        container.querySelector('#root'),
      ),
    );
  });

  it('inside', function () {
    act(() =>
      root.render(
        <div>
          <div id="root">
            <div id="inside" />
          </div>
        </div>,
      ),
    );
    assert.ok(
      contains(
        container.querySelector('#root'),
        container.querySelector('#inside'),
      ),
    );
  });

  it('outside', function () {
    act(() =>
      root.render(
        <div>
          <div id="root" />
          <div id="outside" />
        </div>,
      ),
    );
    assert.ok(
      !contains(
        container.querySelector('#root'),
        container.querySelector('#outside'),
      ),
    );
  });

  it('ref', function () {
    function Component({ onChange }) {
      const ref = React.useRef<HTMLDivElement>(null);

      return (
        <div>
          <div ref={ref}>
            <button
              id="inside"
              onClick={(event) => {
                assert.equal(typeof ref.current.contains, 'function');
                onChange(contains(ref.current, event.target as HTMLElement));
              }}
            />
          </div>
          <button
            id="outside"
            onClick={(event) => {
              assert.equal(typeof ref.current.contains, 'function');
              onChange(contains(ref.current, event.target as HTMLElement));
            }}
          />
        </div>
      );
    }

    let value;
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
