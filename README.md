# react-native-contains

Check whether one element or native view contains another element or native tag.

## Install

```sh
npm install react react-native react-native-contains
```

## Use

```tsx
import { type ComponentRef, useRef } from "react";
import { Pressable, View } from "react-native";
import contains from "react-native-contains";

function Component() {
  const ref = useRef<ComponentRef<typeof View>>(null);
  return (
    <View>
      <View ref={ref}>
        <Pressable onPress={(event) => {
          const container = ref.current;
          if (container) console.log(contains(container, event.target)); // true
        }} />
      </View>
      <Pressable onPress={(event) => {
        const container = ref.current;
        if (container) console.log(contains(container, event.target)); // false
      }} />
    </View>
  );
}
```

Modern native host refs are supported through their public `contains()` method. Numeric targets are supported only with the legacy `NativeElement` tag/tree shape; a numeric first argument is not a supported container.

## Documentation

[API Docs](https://kmalakoff.github.io/react-native-contains/)
