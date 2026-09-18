import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { safeRmSync } from 'fs-remove-compat';
import { extract } from 'tar';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const fixtureSource = path.dirname(fileURLToPath(import.meta.url));
const packageName = JSON.parse(readFileSync(path.join(repoRoot, 'package.json'), 'utf8')).name;
const fixtureRoot = mkdtempSync(path.join(repoRoot, '.tmp/engine-fixture-'));
const npmExecutable = process.env.npm_execpath;
if (!npmExecutable) throw new Error('npm_execpath is required to run the engine fixture');
const npmEnvironment = { ...process.env, npm_config_cache: path.join(fixtureRoot, 'npm-cache') };
const require = createRequire(import.meta.url);

try {
  const packOutput = JSON.parse(execFileSync(process.execPath, [npmExecutable, 'pack', '--json', '--pack-destination', fixtureRoot], { cwd: repoRoot, encoding: 'utf8', env: npmEnvironment }));
  const packed = Array.isArray(packOutput) ? packOutput[0] : Object.values(packOutput)[0];
  if (!packed?.filename) throw new Error(`npm pack did not return a tarball: ${JSON.stringify(packOutput)}`);
  const tarball = path.join(fixtureRoot, packed.filename);

  cpSync(path.join(fixtureSource, 'package.json'), path.join(fixtureRoot, 'package.json'));
  cpSync(path.join(fixtureSource, 'package-lock.json'), path.join(fixtureRoot, 'package-lock.json'));
  cpSync(path.join(fixtureSource, 'smoke.mjs'), path.join(fixtureRoot, 'smoke.mjs'));
  execFileSync(process.execPath, [npmExecutable, 'ci', '--ignore-scripts', '--no-audit', '--no-fund', '--no-progress'], { cwd: fixtureRoot, stdio: 'inherit', env: npmEnvironment });
  await extract({ file: tarball, cwd: fixtureRoot });
  mkdirSync(path.join(fixtureRoot, 'node_modules'), { recursive: true });
  cpSync(path.join(fixtureRoot, 'package'), path.join(fixtureRoot, 'node_modules', packageName), { recursive: true });

  execFileSync(process.execPath, [require.resolve('node-version-use/bin/cli.js'), '16.0.0', 'node', 'smoke.mjs', packageName], {
    cwd: fixtureRoot,
    stdio: 'inherit',
    timeout: 120_000,
  });
} finally {
  safeRmSync(fixtureRoot);
}
