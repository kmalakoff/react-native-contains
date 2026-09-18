import { importMapsPlugin } from '@web/dev-server-import-maps';
import createConfig from 'tsds-web-test-runner/createConfig.mjs';
import { prepareReactProfile } from './test/lib/local-react-bundle.mjs';

const profile = process.env.REACT_TEST_PROFILE || 'current';
if (profile !== 'minimum' && profile !== 'current') throw new Error(`Unknown React browser profile: ${profile}`);

const config = createConfig({
  hostname: '127.0.0.1',
  port: profile === 'minimum' ? 9010 : 9011,
  nodeResolve: {
    modulePaths: [`${process.cwd()}/test/browser/${profile}/node_modules`],
  },
});
const localProfile = await prepareReactProfile(profile);

config.plugins = config.plugins.filter((plugin) => plugin.name !== 'import-map');
config.plugins.push(importMapsPlugin({ inject: { importMap: localProfile } }));
config.browsers = [config.browsers[0]];

export default config;
