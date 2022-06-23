/**
 * @jest-environment jsdom
 */

import assert from 'assert';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import contains from 'react-native-contains';

let root: Element | null;

describe('native', function () {
  beforeEach(function () {
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(function () {
    document.body.removeChild(root!);
    root = null;
  });

  test('inside', function () {
    act(function () {
      ReactDOM.createRoot(root!).render(
        <div>
          <div id="container">
            <div id="inside" />
          </div>
        </div>,
      );
    });

    const container = document.getElementById('container');
    const inside = document.getElementById('inside');
    assert.ok(contains(container!, inside!));
  });

  test('outside', function () {
    act(function () {
      ReactDOM.createRoot(root!).render(
        <div>
          <div id="container" />
          <div id="outside" />
        </div>,
      );
    });

    const container = document.getElementById('container');
    const outside = document.getElementById('outside');
    assert.ok(!contains(container!, outside!));
  });
});
