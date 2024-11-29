## react-native-contains

Universal element contains for react, react-native, and react-native web

### Example 1

```tsx
import { useRef } from "react",
import { View } from "react-native",
import contains from "react-native-contains";

function Component() {
  const ref = useRef();
  return (
    <View>
      <View ref={ref}>
        <View onPress={((event) => {
          contains(ref.current, event.target); // true
        })}/>
      </View>
      <View onPress={((event) => {
        contains(ref.current, event.target); // false
      })}/>
    </View>
  )
}
```

### Documentation

[API Docs](https://kmalakoff.github.io/react-native-contains/)
