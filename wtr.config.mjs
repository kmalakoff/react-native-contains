import { importMapsPlugin } from '@web/dev-server-import-maps';
import createConfig from 'tsds-web-test-runner/createConfig.mjs';

export default createConfig({
  port: 9010,
  plugins: [
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            react: 'https://esm.sh/react?dev',
            'react-dom': 'https://esm.sh/react-dom?dev',
            'react-dom/client': 'https://esm.sh/react-dom/client.js?dev',
            'react-test-renderer': 'https://esm.sh/react-test-renderer?dev',
          },
        },
      },
    }),
  ],
});
