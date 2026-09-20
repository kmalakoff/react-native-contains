#!/usr/bin/env bash

set -eu

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
FIXTURE_ROOT="$REPO_ROOT/examples/native-test-app"
FLOW_PATH="$REPO_ROOT/test/integration/maestro/native-contains.yaml"

collect_diagnostics() {
  status=$?
  mkdir -p "$REPO_ROOT/.tmp"
  adb devices > "$REPO_ROOT/.tmp/android-devices.txt" || true
  adb logcat -d > "$REPO_ROOT/.tmp/android-logcat.txt" || true
  exit "$status"
}

trap collect_diagnostics EXIT

cd "$FIXTURE_ROOT"
export PATH="$HOME/.maestro/bin:$PATH"
export MAESTRO_DRIVER_STARTUP_TIMEOUT=600000

adb wait-for-device
adb shell getprop sys.boot_completed | grep -m 1 '1'
APP_ID="$(node -p 'require("./app.json").android.package')"
npm run android -- --no-packager --appId "$APP_ID"

ANDROID_DEVICE="${ANDROID_SERIAL:-$(adb devices | awk 'NR > 1 && $2 == "device" { print $1; exit }')}"
test -n "$ANDROID_DEVICE"
maestro --device "$ANDROID_DEVICE" test "$FLOW_PATH"
