import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { safeRmSync } from 'fs-remove-compat';
import { extract } from 'tar';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const fixtureSource = path.dirname(fileURLToPath(import.meta.url));
const packageManifest = JSON.parse(readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
const packageName = packageManifest.name;
mkdirSync(path.join(repoRoot, '.tmp'), { recursive: true });
const fixtureRoot = mkdtempSync(path.join(repoRoot, '.tmp/type-fixture-'));
const npmEnvironment = { ...process.env, npm_config_cache: path.join(fixtureRoot, 'npm-cache') };
const npmExecutable = process.env.npm_execpath;
if (!npmExecutable) throw new Error('npm_execpath is required to run the type fixture');

function runCompiler(cwd) {
  return spawnSync(process.execPath, [path.join(cwd, 'node_modules', 'typescript', 'bin', 'tsc'), '--noEmit', '--pretty', 'false'], {
    cwd,
    encoding: 'utf8',
  });
}

try {
  const packOutput = JSON.parse(execFileSync(process.execPath, [npmExecutable, 'pack', '--json', '--pack-destination', fixtureRoot], { cwd: repoRoot, encoding: 'utf8', env: npmEnvironment }));
  const packed = Array.isArray(packOutput) ? packOutput[0] : Object.values(packOutput)[0];
  if (!packed?.filename) throw new Error(`npm pack did not return a tarball: ${JSON.stringify(packOutput)}`);
  const tarball = path.join(fixtureRoot, packed.filename);
  const source = readFileSync(path.join(fixtureSource, 'src/index.ts'), 'utf8');

  for (const profile of ['legacy', 'current']) {
    const profileRoot = path.join(fixtureRoot, profile);
    mkdirSync(path.join(profileRoot, 'src'), { recursive: true });
    const profileManifest = JSON.parse(readFileSync(path.join(fixtureSource, 'profiles', profile, 'package.json'), 'utf8'));
    writeFileSync(path.join(profileRoot, 'package.json'), `${JSON.stringify(profileManifest, null, 2)}\n`);
    cpSync(path.join(fixtureSource, 'profiles', profile, 'package-lock.json'), path.join(profileRoot, 'package-lock.json'));
    cpSync(path.join(fixtureSource, 'tsconfig.json'), path.join(profileRoot, 'tsconfig.json'));
    writeFileSync(path.join(profileRoot, 'src/index.ts'), source);

    execFileSync(process.execPath, [npmExecutable, 'ci', '--ignore-scripts', '--no-audit', '--no-fund', '--no-progress'], { cwd: profileRoot, stdio: 'inherit', env: npmEnvironment });
    await extract({ file: tarball, cwd: profileRoot });
    cpSync(path.join(profileRoot, 'package'), path.join(profileRoot, 'node_modules', packageName), { recursive: true });

    const passing = runCompiler(profileRoot);
    if (passing.status !== 0) throw new Error(`${profile} consumer declaration check failed:\n${passing.stdout}${passing.stderr}`);

    const negativeSource = source.replaceAll(/\s*\/\/ @ts-expect-error[^\n]*/g, '');
    writeFileSync(path.join(profileRoot, 'src/index.ts'), negativeSource);
    const negative = runCompiler(profileRoot);
    const output = `${negative.stdout}\n${negative.stderr}`;
    if (negative.status === 0 || !output.includes('TS2769')) {
      throw new Error(`${profile} negative declaration check did not reject invalid usage:\n${output}`);
    }
  }
} finally {
  safeRmSync(fixtureRoot);
}
