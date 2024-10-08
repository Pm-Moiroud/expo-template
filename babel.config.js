module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '~app': './src/app',
            '~assets': './src/assets',
            '~components': './src/components',
            '~config': './src/config',
            '~features': './src/features',
            '~hooks': './src/hooks',
            '~providers': './src/providers',
          },
        },
      ],
    ],
  }
}
