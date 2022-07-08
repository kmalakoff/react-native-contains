/**
 * @jest-environment jsdom
 */

import assert from 'assert';
import React, { useRef } from 'react';
import { render, fireEvent } from '@testing-library/react';

import contains from 'react-native-contains';

describe('react-dom', function () {
  it('self', function () {
    const { container } = render(
      <div>
        <div id="root" />
      </div>,
    );
    assert.ok(
      contains(
        container.querySelector('#root'),
        container.querySelector('#root'),
      ),
    );
  });

  it('inside', function () {
    const { container } = render(
      <div>
        <div id="root">
          <div id="inside" />
        </div>
      </div>,
    );
    assert.ok(
      contains(
        container.querySelector('#root'),
        container.querySelector('#inside'),
      ),
    );
  });

  it('outside', function () {
    const { container } = render(
      <div>
        <div id="root" />
        <div id="outside" />
      </div>,
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
      const ref = useRef<HTMLDivElement>(null);

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
    const { container } = render(<Component onChange={onChange} />);
    assert.equal(value, undefined);

    value = undefined;
    fireEvent.click(container.querySelector('#inside'));
    assert.equal(value, true);

    value = undefined;
    fireEvent.click(container.querySelector('#outside'));
    assert.equal(value, false);
  });
});
