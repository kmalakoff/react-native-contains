const { configureProjects } = require('react-native-test-app');

module.exports = {
  project: configureProjects({
    ios: {
      sourceDir: 'ios',
      automaticPodsInstallation: false,
    },
    android: {
      packageName: 'com.reactnativecontains.smoke',
      sourceDir: 'android',
    },
  }),
};
