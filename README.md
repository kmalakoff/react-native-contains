# react-native-contains

Check whether one element or native view contains another element or native tag.

## Install

```sh
npm install react react-native react-native-contains
```

## Use

```tsx
import { useRef } from "react";
import { Pressable, View } from "react-native";
import contains from "react-native-contains";

function Component() {
  const ref = useRef(null);
  return (
    <View>
      <View ref={ref}>
        <Pressable onPress={(event) => {
          console.log(contains(ref.current, event.target)); // true
        }} />
      </View>
      <Pressable onPress={(event) => {
        console.log(contains(ref.current, event.target)); // false
      }} />
    </View>
  );
}
```

## Documentation

[API Docs](https://kmalakoff.github.io/react-native-contains/)
