import { importMapsPlugin } from '@web/dev-server-import-maps';
import createConfig from 'tsds-web-test-runner/createConfig.mjs';

export default createConfig({
  port: 9010,
  plugins: [
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            react: 'https://esm.sh/react@19.3.0?dev',
            'react-dom': 'https://esm.sh/react-dom@19.3.0?dev',
            'react-dom/client': 'https://esm.sh/react-dom@19.3.0/client.js?dev',
          },
        },
      },
    }),
  ],
});
