import { importMapsPlugin } from '@web/dev-server-import-maps';
import createConfig from 'tsds-web-test-runner/createConfig.mjs';
import { prepareReactProfile } from './test/lib/local-react-bundle.mjs';

const profileSettings = {
  minimum: { port: 9010 },
  current: { port: 9011 },
  react17: { port: 9012 },
  react18: { port: 9013 },
};
const profile = process.env.REACT_TEST_PROFILE || 'current';
const settings = profileSettings[profile];
if (!settings) throw new Error(`Unknown React browser profile: ${profile}`);

const config = createConfig({
  hostname: '127.0.0.1',
  port: settings.port,
  nodeResolve: {
    modulePaths: [`${process.cwd()}/test/browser/${profile}/node_modules`],
  },
});
const localProfile = await prepareReactProfile(profile);

config.plugins = config.plugins.filter((plugin) => plugin.name !== 'import-map');
config.plugins.push(importMapsPlugin({ inject: { importMap: localProfile } }));
config.browsers = [config.browsers[0]];

export default config;
