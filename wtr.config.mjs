import { importMapsPlugin } from '@web/dev-server-import-maps';
import createConfig from 'tsds-web-test-runner/createConfig.mjs';

// esm.sh cannot detect React 16.8's CommonJS named exports, so the floor loads from jspm.
// No CDN exposes react-dom 16.8's named exports; test/lib/react-dom-16.8.mjs re-exports them from jspm's default.
const JSPM = 'https://ga.jspm.io/npm:';
const ESM_SH = 'https://esm.sh/';

// React 16/17 have no react-dom/client; mapping it to react-dom leaves createRoot undefined for the legacy mount path.
const PROFILES = {
  minimum: {
    port: 9010,
    imports: {
      react: `${JSPM}react@16.8.0/dev.index.js`,
      'react-dom': '/test/lib/react-dom-16.8.mjs',
      'react-dom/client': '/test/lib/react-dom-16.8.mjs',
      'react-dom/test-utils': `${JSPM}react-dom@16.8.0/dev.test-utils.js`,
      'object-assign': `${JSPM}object-assign@4.1.1/index.js`,
      'prop-types/checkPropTypes': `${JSPM}prop-types@15.8.1/dev.checkPropTypes.js`,
      scheduler: `${JSPM}scheduler@0.13.6/dev.index.js`,
      'scheduler/tracing': `${JSPM}scheduler@0.13.6/dev.tracing.js`,
    },
  },
  react17: {
    port: 9012,
    imports: {
      react: `${ESM_SH}react@17.0.2?dev`,
      'react-dom': `${ESM_SH}react-dom@17.0.2?dev`,
      'react-dom/client': `${ESM_SH}react-dom@17.0.2?dev`,
      'react-dom/test-utils': `${ESM_SH}react-dom@17.0.2/test-utils?dev`,
    },
  },
  react18: {
    port: 9013,
    imports: {
      react: `${ESM_SH}react@18.3.1?dev`,
      'react-dom': `${ESM_SH}react-dom@18.3.1?dev`,
      'react-dom/client': `${ESM_SH}react-dom@18.3.1/client?dev`,
      'react-dom/test-utils': `${ESM_SH}react-dom@18.3.1/test-utils?dev`,
    },
  },
  current: {
    port: 9011,
    imports: {
      react: `${ESM_SH}react@19.3.0?dev`,
      'react-dom': `${ESM_SH}react-dom@19.3.0?dev`,
      'react-dom/client': `${ESM_SH}react-dom@19.3.0/client?dev`,
      'react-dom/test-utils': `${ESM_SH}react-dom@19.3.0/test-utils?dev`,
    },
  },
};

export function profileConfig(profile) {
  const { port, imports } = PROFILES[profile];
  const config = createConfig({ hostname: '127.0.0.1', port, plugins: [importMapsPlugin({ inject: { importMap: { imports } } })] });
  config.browsers = [config.browsers[0]];
  return config;
}

export default profileConfig('current');
