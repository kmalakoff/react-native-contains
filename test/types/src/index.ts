import contains, { type ChildrenElement, type NativeElement, type NativeHost } from 'react-native-contains';

export function checkContains(): boolean {
  const nativeHost: NativeHost = { contains: () => true };
  contains(nativeHost, nativeHost);

  const legacy: NativeElement = { _nativeTag: 1, _children: [] };
  contains(legacy, legacy);
  contains(legacy, 1);

  const children: ChildrenElement = { children: [] };
  contains(children, children);

  // @ts-expect-error: a numeric tag is a target, never a container
  contains(1, legacy);

  // @ts-expect-error: a native host target is not a legacy numeric tag
  contains(legacy, nativeHost);
  return true;
}

void checkContains;
