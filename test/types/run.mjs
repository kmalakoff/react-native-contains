import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { safeRmSync } from 'fs-remove-compat';
import resolveBin from 'resolve-bin-sync';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
mkdirSync(path.join(repoRoot, '.tmp'), { recursive: true });
const fixtureRoot = mkdtempSync(path.join(repoRoot, '.tmp/type-fixture-'));
const fixtureSource = path.dirname(fileURLToPath(import.meta.url));
const packageName = JSON.parse(readFileSync(path.join(repoRoot, 'package.json'), 'utf8')).name;
const nodeModules = path.join(fixtureRoot, 'node_modules');

try {
  cpSync(path.join(fixtureSource, 'package.json'), path.join(fixtureRoot, 'package.json'));
  cpSync(path.join(fixtureSource, 'tsconfig.json'), path.join(fixtureRoot, 'tsconfig.json'));
  cpSync(path.join(fixtureSource, 'src'), path.join(fixtureRoot, 'src'), { recursive: true });
  mkdirSync(nodeModules);
  symlinkSync(repoRoot, path.join(nodeModules, packageName), 'junction');
  for (const peer of ['react', 'react-native']) {
    symlinkSync(path.join(repoRoot, 'node_modules', peer), path.join(nodeModules, peer), 'junction');
  }

  const tsds = resolveBin('ts-dev-stack', 'tsds');
  if (!existsSync(tsds)) throw new Error(`Missing repository tsds executable: ${tsds}`);
  execFileSync(process.execPath, [tsds, 'build'], { cwd: fixtureRoot, stdio: 'inherit' });
  if (!existsSync(path.join(fixtureRoot, 'dist', 'cjs', 'index.js'))) throw new Error('Type fixture did not build its public-name import');

  const fixtureEntry = path.join(fixtureRoot, 'src', 'index.ts');
  const fixtureSourceText = readFileSync(fixtureEntry, 'utf8');
  writeFileSync(fixtureEntry, `${fixtureSourceText}\n// @ts-expect-error: this valid declaration must report an unused directive\nconst validDeclaration: true = true;\n`);
  let unusedDirectiveOutput = '';
  try {
    execFileSync(process.execPath, [tsds, 'build'], { cwd: fixtureRoot, encoding: 'utf8' });
  } catch (error) {
    unusedDirectiveOutput = `${error.stdout ?? ''}${error.stderr ?? ''}`;
  }
  if (!/TS2578/.test(unusedDirectiveOutput)) throw new Error('Type fixture did not verify unused @ts-expect-error reporting');

  const fixtureWithErrors = fixtureSourceText.replaceAll(/\s*\/\/ @ts-expect-error[^\n]*/g, '');
  writeFileSync(fixtureEntry, fixtureWithErrors);
  const negative = spawnSync(process.execPath, [tsds, 'build'], { cwd: fixtureRoot, encoding: 'utf8' });
  if (negative.error) throw negative.error;
  const output = `${negative.stdout}\n${negative.stderr}`;
  if (negative.status === 0 || !output.includes('TS2769')) throw new Error(`Type fixture did not reject invalid numeric arguments:\n${output}`);
} finally {
  safeRmSync(fixtureRoot);
}
