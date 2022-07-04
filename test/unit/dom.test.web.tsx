/**
 * @jest-environment jsdom
 */

import assert from 'assert';
import React, { useRef } from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import contains from 'react-native-contains';

describe('react-dom', function () {
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
                onChange(contains(ref.current, event.target));
              }}
            />
          </div>
          <button
            id="outside"
            onClick={(event) => {
              onChange(contains(ref.current, event.target));
            }}
          />
        </div>
      );
    }

    let value;
    const onChange = function (x) {
      value = x;
    };
    const { container } = render(<Component onChange={onChange} />);
    assert.equal(value, undefined);

    fireEvent.click(container.querySelector('#inside'));
    assert.equal(value, true);

    fireEvent.click(container.querySelector('#outside'));
    assert.equal(value, false);
  });
});
