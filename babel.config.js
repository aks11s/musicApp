module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // must stay last — the reanimated plugin has to run after every other transform
  plugins: ['react-native-reanimated/plugin'],
};
