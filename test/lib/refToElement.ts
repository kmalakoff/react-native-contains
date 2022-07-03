import { ReactTestInstance } from 'react-test-renderer';
import { RefObject } from 'react';

function findByRef(node, ref) {
  // if (node.children && node.children.length === ref.current.children.length) {
  //   if (node.children.every(x => ref.current.children.find(y => x === y))) {
  //     return node;
  //   }
  // }

  for (let index = 0; index < node.children.length; index++) {
    const found = findByRef(node.children[index], ref);
    if (found) return found;
  }
  return null;
}

// TODO: figure out why getByRef fails on react-native-web
export default function refToElement<T>(
  container: ReactTestInstance,
): (id) => ReactTestInstance {
  return function getByRef(ref: RefObject<T>) {
    return ref.current ? findByRef(container, ref) : null;
  };
}
