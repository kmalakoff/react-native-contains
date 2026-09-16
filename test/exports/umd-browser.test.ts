import assert from 'assert';

declare global {
  interface Window {
    reactNativeContains?: typeof import('react-native-contains').default;
  }
}

describe('browser UMD global', () => {
  it('loads the classic script and exposes the default export on window', async () => {
    const script = document.createElement('script');
    script.src = new URL('../../dist/umd/react-native-contains.cjs', import.meta.url).href;
    script.async = false;
    try {
      await new Promise<void>((resolve, reject) => {
        script.addEventListener('load', () => resolve(), { once: true });
        script.addEventListener('error', () => reject(new Error(`Failed to load ${script.src}`)), { once: true });
        document.head.append(script);
      });
      assert.equal(typeof window.reactNativeContains, 'function');
    } finally {
      script.remove();
      delete window.reactNativeContains;
    }
  });
});
