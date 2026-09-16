#!/usr/bin/env bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
FIXTURE_ROOT="$REPO_ROOT/examples/native-test-app"
SIMULATOR_UDID="${1:?Pass the booted simulator UDID}"
DERIVED_DATA="$REPO_ROOT/.tmp/ios-build"
BUILD_LOG="$REPO_ROOT/.tmp/ios-build.log"

cd "$FIXTURE_ROOT"
APP_NAME="$(node -p 'require("./app.json").name')"
APP_ID="$(node -p 'require("./app.json").ios.bundleIdentifier')"
mkdir -p "$REPO_ROOT/.tmp"
xcrun simctl bootstatus "$SIMULATOR_UDID" -b

# Build and install explicitly: the RN CLI can select the physical-device
# installer for a simulator UDID and still return success after installation fails.
if ! xcodebuild \
  -workspace "$FIXTURE_ROOT/ios/$APP_NAME.xcworkspace" \
  -scheme "$APP_NAME" \
  -configuration Debug \
  -sdk iphonesimulator \
  -destination "id=$SIMULATOR_UDID" \
  -derivedDataPath "$DERIVED_DATA" \
  build > "$BUILD_LOG" 2>&1; then
  tail -n 200 "$BUILD_LOG"
  exit 1
fi

APP_PATH="$DERIVED_DATA/Build/Products/Debug-iphonesimulator/ReactTestApp.app"
BUILT_APP_ID="$(/usr/libexec/PlistBuddy -c Print:CFBundleIdentifier "$APP_PATH/Info.plist")"
if [ "$BUILT_APP_ID" != "$APP_ID" ]; then
  printf 'Expected bundle %s, built %s\n' "$APP_ID" "$BUILT_APP_ID" >&2
  exit 1
fi

xcrun simctl install "$SIMULATOR_UDID" "$APP_PATH"
xcrun simctl get_app_container "$SIMULATOR_UDID" "$APP_ID" app
xcrun simctl launch "$SIMULATOR_UDID" "$APP_ID"
