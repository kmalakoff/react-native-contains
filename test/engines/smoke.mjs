import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const packageName = process.argv[2];
if (!packageName) throw new Error('Missing package name');

const imported = await import(packageName);
const required = createRequire(import.meta.url)(packageName);
const contains = imported.default;
const requiredContains = required.default ?? required;
const target = { children: [] };
const root = { children: [target] };

assert.equal(typeof contains, 'function');
assert.equal(typeof requiredContains, 'function');
assert.equal(contains(root, target), true);
assert.equal(requiredContains(root, target), true);
