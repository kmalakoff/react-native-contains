# Compatibility tests

Use Node 26 for development tooling. Each browser profile installs its own lockfile with npm ci and uses one current Chromium through WTR. The profiles vary React dependencies, not browser versions.

| Command | Coverage |
| --- | --- |
| `npm test` | Isolated consumer types, minimum/current browser assertions, then Node helper/export checks |
| `npm run test:engines` | Already-built package smoke checks on exact Node 16.0.0; no DOM or renderer on old Node |
| `npm run test:browser:checkpoints` | Optional React/ReactDOM 17.0.2 and 18.3.1 checks for compatibility-sensitive changes or releases |

Routine browser endpoints pin React and ReactDOM together at 16.8.0 and 19.3.0. All profiles use the same behavioral assertions. React 16/17 use legacy mounting; React 18/19 use createRoot. Local bundled bridges keep one React instance and avoid CDN conversion.

The Node 16 check loads the packed ESM and CommonJS entries. It also checks plain-tree containment. It does not certify SSR or component rendering in Node.
