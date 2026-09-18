import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const tsds = createRequire(import.meta.url).resolve('ts-dev-stack/bin/cli.js');
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('Run the browser matrix through npm test.');

for (const profile of ['minimum', 'current']) {
  execFileSync(process.execPath, [npmCli, 'ci', '--prefix', `test/browser/${profile}`, '--ignore-scripts', '--no-audit', '--no-fund'], { stdio: 'inherit' });
  execFileSync(process.execPath, [tsds, 'test:browser', '--config', 'wtr.config.mjs', 'test/unit/dom.test.tsx', 'test/exports/import.test.ts', 'test/exports/import.test.mjs', 'test/exports/umd-browser.test.ts'], {
    env: { ...process.env, REACT_TEST_PROFILE: profile },
    stdio: 'inherit',
  });
}
