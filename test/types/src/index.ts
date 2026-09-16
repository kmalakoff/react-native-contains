import type { ComponentRef } from 'react';
import type { View } from 'react-native';
import contains, { type NativeElement } from 'react-native-contains';

export function checkNativeContains(container: ComponentRef<typeof View>, child: ComponentRef<typeof View>): boolean {
  contains(container, container);
  contains(container, child);
  const domContainer = document.createElement('div');
  contains(domContainer, document.createTextNode('child'));

  const legacy: NativeElement = { _nativeTag: 1, _children: [] };
  contains(legacy, legacy);
  contains(legacy, 1);

  // @ts-expect-error: a numeric tag is a target, never a container
  contains(1, child);

  // @ts-expect-error: modern host methods accept host targets, not numeric tags
  contains(container, 1);
  return true;
}
