import { importMapsPlugin } from '@web/dev-server-import-maps';
import createConfig from 'tsds-web-test-runner/createConfig.mjs';

export default createConfig({
  plugins: [
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            react: `https://esm.sh/react@18.3.1?dev`,
            'react-dom': `https://esm.sh/react-dom@18.3.1?dev`,
            'react-dom/client': `https://esm.sh/react-dom@18.3.1/client.js?dev`,
            'react-native-web': `https://esm.sh/react-native-web@0.19.13`,
            'https://esm.sh/stable/react@18.3.1/esnext/react.mjs': `https://esm.sh/react@18.3.1?dev`,
            'https://esm.sh/stable/react@18.3.1/es2022/react.mjs': `https://esm.sh/react@18.3.1?dev`
          },
        },
      },
    })
  ],
});
