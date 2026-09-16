# Native contains smoke app

This fixture uses React 19.2.3, React Native 0.87.1, Fabric, and
react-native-test-app 5.4.9.

From `examples/native-test-app`, install and validate the fixture:

```sh
npm ci
npm run validate
```

Build and run the iOS fixture on a selected simulator:

```sh
npm run build:ios
pod install --project-directory=ios
npm run ios -- --no-packager --udid <simulator-udid>
```

Build and run the Android fixture on an API 35 emulator:

```sh
npm run build:android
bash ../../test/integration/run-android.sh
```

The Android command expects an already running emulator, adb, and Maestro
2.7.0. The iOS flow uses the same parent-level Maestro device option:

```sh
maestro --device <simulator-udid> test ../../test/integration/maestro/native-contains.yaml
```

The CI workflow uses the same Android runner script and device commands.
