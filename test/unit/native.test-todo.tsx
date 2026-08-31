import assert from 'assert';
import { useRef } from 'react';
import type { GestureResponderEvent } from 'react-native';

import { TouchableOpacity, View } from 'react-native';
import contains, { type NativeElement } from 'react-native-contains';
import { act, create } from 'react-test-renderer';

describe('react-native', () => {
  it('self', async () => {
    const { root } = await act(() =>
      create(
        <View>
          <View testID="container" />
        </View>
      )
    );
    assert.ok(contains(root.findByProps({ testID: 'container' }) as unknown as NativeElement, root.findByProps({ testID: 'container' }) as unknown as NativeElement));
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
    assert.ok(contains(root.findByProps({ testID: 'container' }) as unknown as NativeElement, root.findByProps({ testID: 'inside' }) as unknown as NativeElement));
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
    assert.ok(!contains(root.findByProps({ testID: 'container' }) as unknown as NativeElement, root.findByProps({ testID: 'outside' }) as unknown as NativeElement));
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
                assert.ok(Array.isArray((ref.current as NativeElement).children));
                onChange(contains(ref.current as NativeElement, event.target as unknown as NativeElement));
              }}
            />
          </View>
          <TouchableOpacity
            testID="outside"
            onPress={(event: GestureResponderEvent) => {
              assert.ok(Array.isArray((ref.current as NativeElement).children));
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
    const refValues: { ref: React.RefObject<NativeElement>; value: { props: { testID: string } } }[] = [];
    const registerRefValue = (refValue: unknown): void => {
      refValues.push(refValue as { ref: React.RefObject<NativeElement>; value: { props: { testID: string } } });
    };
    const { root } = await act(() => create(<Component onChange={onChange} registerRefValue={registerRefValue} />));

    refValues.forEach(({ ref, value }) => {
      ref.current = root.findByProps({ testID: value.props.testID }) as unknown as NativeElement;
    }); // https://github.com/callstack/react-native-testing-library/issues/1006
    assert.equal(value, undefined);

    value = undefined;
    act(() =>
      (root.findByProps({ testID: 'inside' }).props.onPress as (e: unknown) => void)({
        target: root.findByProps({ testID: 'inside' }),
      })
    );
    assert.equal(value, true);

    value = undefined;
    act(() =>
      (root.findByProps({ testID: 'outside' }).props.onPress as (e: unknown) => void)({
        target: root.findByProps({ testID: 'outside' }),
      })
    );
    assert.equal(value, false);
  });
});
