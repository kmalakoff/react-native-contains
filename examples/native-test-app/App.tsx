import { type ComponentRef, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import contains, { type NativeHost } from 'react-native-contains';

function App() {
  const containerRef = useRef<ComponentRef<typeof View>>(null);
  const insideRef = useRef<ComponentRef<typeof View>>(null);
  const outsideRef = useRef<ComponentRef<typeof View>>(null);
  const [result, setResult] = useState('CONTAINS_TOUCH_PENDING');

  function isNativeEventTarget(value: unknown): value is NativeHost {
    return typeof value === 'object' && value !== null && 'contains' in value && typeof (value as { contains?: unknown }).contains === 'function';
  }

  function checkTouch(label: string, target: ComponentRef<typeof View> | null, eventTarget: unknown, expectedInside: boolean) {
    const container = containerRef.current;
    const outside = outsideRef.current;
    if (!container || !target || !outside) {
      setResult(`CONTAINS_TOUCH_FAIL:${label}:missing-native-ref`);
      return;
    }

    const actualTouchTarget = isNativeEventTarget(eventTarget);
    const eventContains = actualTouchTarget && contains(container, eventTarget);
    const self = contains(container, container);
    const descendant = contains(container, target);
    const outsideResult = contains(container, outside);
    const pass = actualTouchTarget && self && eventContains === expectedInside && descendant === expectedInside && outsideResult === false;
    setResult(pass ? `CONTAINS_TOUCH_${label}_PASS` : `CONTAINS_TOUCH_${label}_FAIL:self=${self};event=${eventContains};descendant=${descendant};outside=${outsideResult};target=${actualTouchTarget}`);
  }

  return (
    <View style={{ flex: 1, paddingTop: 120, paddingHorizontal: 24 }}>
      <View ref={containerRef}>
        <Text>container</Text>
        <View
          testID="inside-target"
          style={{ minHeight: 48, minWidth: 200, backgroundColor: '#ccf' }}
          onStartShouldSetResponder={() => true}
          onResponderRelease={(event) => checkTouch('INSIDE', insideRef.current, event.target, true)}
        >
          <View ref={insideRef}>
            <Text>inside touch target</Text>
          </View>
        </View>
      </View>
      <View
        testID="outside-target"
        style={{ minHeight: 48, minWidth: 200, backgroundColor: '#fcc' }}
        onStartShouldSetResponder={() => true}
        onResponderRelease={(event) => checkTouch('OUTSIDE', outsideRef.current, event.target, false)}
      >
        <View ref={outsideRef}>
          <Text>outside touch target</Text>
        </View>
      </View>
      <Text testID="containment-result">{result}</Text>
    </View>
  );
}

export default App;
