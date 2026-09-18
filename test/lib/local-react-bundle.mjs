import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const esbuild = require('esbuild');
const root = fileURLToPath(new URL('../..', import.meta.url));

function profileRequire(profile) {
  return createRequire(path.join(root, 'test/browser', profile, 'package.json'));
}

function resolver(profile, entryPackage) {
  const profileRequireFor = profileRequire(profile);
  return {
    name: `react-profile-${profile}`,
    setup(build) {
      build.onResolve({ filter: /^react$/ }, ({ namespace, path: specifier }) => {
        if (namespace === 'react-bridge') return { path: specifier, external: true };
        if (entryPackage === 'react') return { path: profileRequireFor.resolve('react') };
        return { path: specifier, namespace: 'react-bridge' };
      });
      build.onResolve({ filter: /^react-dom(?:\/client|\/test-utils)?$/ }, ({ namespace, path: specifier }) => {
        if (namespace === 'react-dom-bridge') return { path: specifier, external: true };
        if (specifier === entryPackage) return { path: profileRequireFor.resolve(specifier) };
        return { path: specifier, namespace: 'react-dom-bridge' };
      });
      build.onLoad({ filter: /.*/, namespace: 'react-bridge' }, () => ({ contents: "export { default } from 'react'; export * from 'react';", loader: 'js' }));
      build.onLoad({ filter: /.*/, namespace: 'react-dom-bridge' }, () => ({ contents: "export { default } from 'react-dom'; export * from 'react-dom';", loader: 'js' }));
      build.onResolve({ filter: /^assert$/ }, () => ({ path: require.resolve('assert/') }));
    },
  };
}

async function bundle(profile, packageName, output) {
  const entry = `import value from ${JSON.stringify(packageName)}; export default value;`;
  await esbuild.build({
    stdin: { contents: entry, resolveDir: root, sourcefile: `${packageName}.mjs`, loader: 'js' },
    absWorkingDir: root,
    bundle: true,
    define: { 'process.env.NODE_ENV': JSON.stringify('development') },
    format: 'esm',
    logLevel: 'silent',
    outfile: path.join(root, output),
    platform: 'browser',
    plugins: [resolver(profile, packageName)],
  });
}

export async function prepareReactProfile(profile) {
  const profileRoot = path.join(root, '.tmp/react-browser', profile);
  await mkdir(profileRoot, { recursive: true });
  await bundle(profile, 'react', `.tmp/react-browser/${profile}/react-impl.js`);
  await writeBridge(profile, 'react', 'react-impl.js', profileRequire(profile)('react'));
  await bundle(profile, 'react-dom', `.tmp/react-browser/${profile}/react-dom-impl.js`);
  await writeBridge(profile, 'react-dom', 'react-dom-impl.js', profileRequire(profile)('react-dom'));
  await bundle(profile, 'react-dom/test-utils', `.tmp/react-browser/${profile}/react-dom-test-utils-impl.js`);
  await writeBridge(profile, 'react-dom/test-utils', 'react-dom-test-utils-impl.js', ['act']);
  if (profile === 'current') {
    await bundle(profile, 'react-dom/client', `.tmp/react-browser/${profile}/react-dom-client-impl.js`);
    await writeBridge(profile, 'react-dom/client', 'react-dom-client-impl.js', profileRequire(profile)('react-dom/client'));
  } else {
    await writeFile(path.join(profileRoot, 'react-dom-client.js'), 'export const createRoot = undefined;\n');
  }
  await bundleAssert(profile, `.tmp/react-browser/${profile}/assert.js`);
  return {
    imports: {
      react: `/.tmp/react-browser/${profile}/react.js`,
      'react-dom': `/.tmp/react-browser/${profile}/react-dom.js`,
      'react-dom/client': `/.tmp/react-browser/${profile}/react-dom-client.js`,
      'react-dom/test-utils': `/.tmp/react-browser/${profile}/react-dom-test-utils.js`,
      assert: `/.tmp/react-browser/${profile}/assert.js`,
    },
  };
}

const RESERVED_WORDS = new Set([
  'await',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'else',
  'enum',
  'export',
  'extends',
  'false',
  'finally',
  'for',
  'function',
  'if',
  'implements',
  'import',
  'in',
  'instanceof',
  'interface',
  'let',
  'new',
  'null',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'static',
  'super',
  'switch',
  'this',
  'throw',
  'true',
  'try',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  'yield',
]);

async function writeBridge(profile, packageName, implementation, values) {
  const names = (Array.isArray(values) ? values : Object.keys(values)).filter((name) => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) && !RESERVED_WORDS.has(name) && name !== 'default');
  const runtime = `/.tmp/react-browser/${profile}/${implementation}`;
  const exports = names.map((name) => `export const ${name} = value[${JSON.stringify(name)}];`).join('\n');
  await writeFile(path.join(root, `.tmp/react-browser/${profile}/${packageName.replaceAll('/', '-')}.js`), `import value from '${runtime}';\nexport default value;\n${exports}\n`);
}

async function bundleAssert(profile, output) {
  const entry = "export { default } from 'assert'; export * from 'assert';";
  await esbuild.build({ stdin: { contents: entry, resolveDir: root, sourcefile: 'assert.mjs', loader: 'js' }, absWorkingDir: root, bundle: true, define: { global: 'globalThis' }, format: 'esm', logLevel: 'silent', outfile: path.join(root, output), platform: 'browser', plugins: [resolver(profile, 'assert')] });
}
