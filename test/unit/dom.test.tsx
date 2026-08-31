((typeof global === 'undefined' ? window : global) as unknown as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

import '../lib/polyfills.cjs';

import assert from 'assert';
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import contains from 'react-native-contains';

const suite = typeof document === 'undefined' ? describe.skip : describe;

suite('react-dom', () => {
  let container: HTMLDivElement | null = null;
  let root: Root | null = null;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => (root as Root).unmount());
    root = null;
    (container as HTMLDivElement).remove();
    container = null;
  });

  it('self', () => {
    act(() =>
      (root as Root).render(
        <div>
          <div id="root" />
        </div>
      )
    );
    assert.ok(contains((container as HTMLDivElement).querySelector('#root') as Element, (container as HTMLDivElement).querySelector('#root') as Element));
  });

  it('inside', () => {
    act(() =>
      (root as Root).render(
        <div>
          <div id="root">
            <div id="inside" />
          </div>
        </div>
      )
    );
    assert.ok(contains((container as HTMLDivElement).querySelector('#root') as Element, (container as HTMLDivElement).querySelector('#inside') as Element));
  });

  it('outside', () => {
    act(() =>
      (root as Root).render(
        <div>
          <div id="root" />
          <div id="outside" />
        </div>
      )
    );
    assert.ok(!contains((container as HTMLDivElement).querySelector('#root') as Element, (container as HTMLDivElement).querySelector('#outside') as Element));
  });

  it('ref', () => {
    function Component({ onChange }: { onChange: (value: boolean) => void }) {
      const ref = React.useRef<HTMLDivElement>(null);

      return (
        <div>
          <div ref={ref}>
            <button
              type="button"
              id="inside"
              onClick={(event) => {
                assert.equal(typeof (ref.current as HTMLDivElement).contains, 'function');
                onChange(contains(ref.current as HTMLDivElement, event.target as HTMLElement));
              }}
            />
          </div>
          <button
            type="button"
            id="outside"
            onClick={(event) => {
              assert.equal(typeof (ref.current as HTMLDivElement).contains, 'function');
              onChange(contains(ref.current as HTMLDivElement, event.target as HTMLElement));
            }}
          />
        </div>
      );
    }

    let value: unknown;
    const onChange = (x: boolean) => {
      value = x;
    };
    act(() => (root as Root).render(<Component onChange={onChange} />));
    assert.equal(value, undefined);

    value = undefined;
    act(() => ((container as HTMLDivElement).querySelector('#inside') as HTMLElement).click());
    assert.equal(value, true);

    value = undefined;
    act(() => ((container as HTMLDivElement).querySelector('#outside') as HTMLElement).click());
    assert.equal(value, false);
  });
});
