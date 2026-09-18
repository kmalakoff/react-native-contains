import React from 'react';
import ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
import * as ReactDOMTestUtils from 'react-dom/test-utils';

type LegacyReactDOM = {
  render: (children: React.ReactNode, container: Element) => void;
  unmountComponentAtNode: (container: Element) => boolean;
};

type ReactDOMClientModule = typeof ReactDOMClient & {
  createRoot?: (container: Element) => { render: (children: React.ReactNode) => void; unmount: () => void };
};

export type MountedRoot = { render: (children: React.ReactNode) => void; unmount: () => void };

export function act(callback: () => void | Promise<void>): void | Promise<void> {
  const reactAct = (React as typeof React & { act?: (callback: () => void | Promise<void>) => unknown }).act;
  const actImplementation = reactAct ?? ReactDOMTestUtils.act;
  return actImplementation(callback) as void | Promise<void>;
}

export function mount(container: Element, children?: React.ReactNode): MountedRoot {
  const legacyReactDOM = ReactDOM as unknown as LegacyReactDOM;
  if (typeof legacyReactDOM.render === 'function') {
    if (children !== undefined) legacyReactDOM.render(children, container);
    return {
      render: (nextChildren) => legacyReactDOM.render(nextChildren, container),
      unmount: () => legacyReactDOM.unmountComponentAtNode(container),
    };
  }

  const createRoot = (ReactDOMClient as ReactDOMClientModule).createRoot;
  if (!createRoot) throw new Error('ReactDOM client createRoot is unavailable');
  const root = createRoot(container);
  if (children !== undefined) root.render(children);
  return { render: (nextChildren) => root.render(nextChildren), unmount: () => root.unmount() };
}

export function unmount(root: MountedRoot | null): void | Promise<void> {
  if (root)
    act(() => {
      root.unmount();
    });
}
