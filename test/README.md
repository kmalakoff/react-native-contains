# Compatibility tests

Use Node 26 for development tooling. Each browser profile is an import map in `wtr.config.mjs` that pins React and ReactDOM CDN URLs, run in one current Chromium through WTR. The profiles vary React versions, not browser versions.

| Command | Coverage |
| --- | --- |
| `npm test` | Isolated consumer types, minimum/current browser assertions, then Node helper/export checks |
| `npm run test:engines` | Already-built package smoke checks on exact Node 16.0.0; no DOM or renderer on old Node |
| `npm run test:browser:checkpoints` | Optional React/ReactDOM 17.0.2 and 18.3.1 checks for compatibility-sensitive changes or releases |

Routine browser endpoints pin React and ReactDOM together at 16.8.0 and 19.3.0. All profiles use the same behavioral assertions. React 16/17 use legacy mounting; React 18/19 use createRoot. React 16.8 loads from jspm because esm.sh does not expose its CommonJS named exports; the other profiles load from esm.sh. Change a version by editing its URLs.

The React 16.8 profile supports synchronous `act` callbacks only, and the current tests use synchronous callbacks. Async callbacks require a React version with async `act` support and are not covered by this matrix.

The Node 16 check loads the packed ESM and CommonJS entries. It also checks plain-tree containment. It does not certify SSR or component rendering in Node.

## Run Android and iOS manually on GitHub Actions

Native testing runs only when requested. On GitHub, open **Actions → CI → Run workflow**, select `worktree-compatibility-matrix`, enable `run_native`, then choose `native_platform` (`android`, `ios`, or `both`) and `native_profile` (`current`, `minimum`, or `all`). Use `master` after these changes are merged.

```sh
# Current React Native on Android
gh workflow run main.yml --repo kmalakoff/react-native-contains --ref worktree-compatibility-matrix -f run_native=true -f native_profile=current -f native_platform=android

# Current React Native on iOS
gh workflow run main.yml --repo kmalakoff/react-native-contains --ref worktree-compatibility-matrix -f run_native=true -f native_profile=current -f native_platform=ios
```

Use `native_profile=all` and `native_platform=both` to run both RN dependency profiles on both platforms. This tests the selected commit of this package together with pinned cooperating candidates. Routine push/PR checks do not start native jobs.

See the [shared native test guide](https://github.com/kmalakoff/react-native-outside/blob/worktree-compatibility-matrix/test/README.md#run-android-and-ios-manually-on-github-actions) for prerequisites, run monitoring, diagnostics, candidate selection and the exact legacy iOS compiler accommodations. Both native profiles passed locally on Android and iOS. The legacy fixture uses installation overrides and does not expand the packages' declared support ranges.
