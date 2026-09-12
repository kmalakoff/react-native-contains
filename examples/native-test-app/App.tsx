import { type ComponentRef, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import contains from 'react-native-contains';

function App() {
  const containerRef = useRef<ComponentRef<typeof View>>(null);
  const insideRef = useRef<ComponentRef<typeof View>>(null);
  const outsideRef = useRef<ComponentRef<typeof View>>(null);
  const [result, setResult] = useState('CONTAINS_SMOKE_PENDING');

  useEffect(() => {
    const container = containerRef.current as unknown as Element | null;
    const inside = insideRef.current as unknown as Element | null;
    const outside = outsideRef.current as unknown as Element | null;

    if (!container || !inside || !outside) {
      setResult('CONTAINS_SMOKE_FAIL:missing-native-ref');
      return;
    }

    const self = contains(container, container);
    const descendant = contains(container, inside);
    const outsideResult = contains(container, outside);
    setResult(self && descendant && !outsideResult ? 'CONTAINS_SMOKE_PASS' : `CONTAINS_SMOKE_FAIL:self=${self};descendant=${descendant};outside=${outsideResult}`);
  }, []);

  return (
    <View>
      <View ref={containerRef}>
        <Text>container</Text>
        <View ref={insideRef} />
      </View>
      <View ref={outsideRef} />
      <Text testID="containment-result">{result}</Text>
    </View>
  );
}

export default App;
