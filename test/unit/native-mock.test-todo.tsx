import assert from 'assert';
import { useRef } from 'react';
import type { GestureResponderEvent } from 'react-native';

import { TouchableOpacity, View } from 'react-native';
import contains, { type NativeElement } from 'react-native-contains';
import { act, create } from 'react-test-renderer';
import ti2ne from '../lib/testInstanceToNativeElement';

describe('react-native-mock', () => {
  it('self', async () => {
    const { root } = await act(() =>
      create(
        <View>
          <View testID="container" />
        </View>
      )
    );
    assert.ok(contains(ti2ne(root.findByProps({ testID: 'container' })), ti2ne(root.findByProps({ testID: 'container' }))));
  });

  it('inside', async () => {
    const { root } = await act(() =>
      create(
        <View>
          <View testID="container">
            <View testID="inside" />
          </View>
        </View>
      )
    );
    assert.ok(contains(ti2ne(root.findByProps({ testID: 'container' })), ti2ne(root.findByProps({ testID: 'inside' }))));
  });

  it('outside', async () => {
    const { root } = await act(() =>
      create(
        <View>
          <View testID="container" />
          <View testID="outside" />
        </View>
      )
    );
    assert.ok(!contains(ti2ne(root.findByProps({ testID: 'container' })), ti2ne(root.findByProps({ testID: 'outside' }))));
  });

  // TODO: fix rn usig web shim
  it.skip('ref', async () => {
    function Component({ onChange, registerRefValue }: { onChange: (value: boolean) => void; registerRefValue: (refValue: unknown) => void }) {
      const ref = useRef<NativeElement>(null);

      return (
        <View>
          <View testID="container" ref={(value) => registerRefValue({ ref, value })}>
            <TouchableOpacity
              testID="inside"
              onPress={(event: GestureResponderEvent) => {
                assert.equal(typeof (ref.current as NativeElement)._nativeTag, 'number');
                onChange(contains(ref.current as NativeElement, event.target as unknown as NativeElement));
              }}
            />
          </View>
          <TouchableOpacity
            testID="outside"
            onPress={(event: GestureResponderEvent) => {
              assert.equal(typeof (ref.current as NativeElement)._nativeTag, 'number');
              onChange(contains(ref.current as NativeElement, event.target as unknown as NativeElement));
            }}
          />
        </View>
      );
    }

    let value: unknown;
    const onChange = (x: boolean) => {
      value = x;
    };
    const refValues: { ref: { current: NativeElement | null }; value: { props: { testID: string } } }[] = [];
    const registerRefValue = (refValue: unknown): void => {
      refValues.push(refValue as { ref: { current: NativeElement | null }; value: { props: { testID: string } } });
    };
    const { root } = await act(() => create(<Component onChange={onChange} registerRefValue={registerRefValue} />));

    refValues.forEach(({ ref, value }) => {
      (ref as { current: NativeElement | null }).current = ti2ne(root.findByProps({ testID: value.props.testID }));
    }); // https://github.com/callstack/react-native-testing-library/issues/1006
    assert.equal(value, undefined);

    value = undefined;
    act(() => {
      (root.findByProps({ testID: 'inside' }).props.onPress as (e: unknown) => void)({
        target: ti2ne(root.findByProps({ testID: 'inside' })),
      });
    });
    assert.equal(value, true);

    value = undefined;
    act(() => {
      (root.findByProps({ testID: 'outside' }).props.onPress as (e: unknown) => void)({
        target: ti2ne(root.findByProps({ testID: 'outside' })),
      });
    });
    assert.equal(value, false);
  });

  it('handles target tag', async () => {
    const { root } = await act(() =>
      create(
        <View>
          <View testID="container" />
        </View>
      )
    );

    assert.ok(contains(ti2ne(root.findByProps({ testID: 'container' })), ti2ne(root.findByProps({ testID: 'container' }))._nativeTag));
  });
});
