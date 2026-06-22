module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@apex/shared': '../shared/src/index.ts',
        },
      },
    ],
  ],
};
