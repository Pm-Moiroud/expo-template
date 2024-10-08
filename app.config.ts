import dotenv from 'dotenv'
import type { ConfigContext, ExpoConfig } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => {
  /** Load env */
  const env = dotenv.config().parsed

  const { version } = require('./package.json')
  const versionAsInt = version.split('.').reduce((acc: number, val: string, index: number) => {
    return acc + parseInt(val) * Math.pow(10, 3 - index)
  }, 0)

  const defaultConfig = {
    ...config,
    name: 'ShiftAlert',
    slug: 'shiftalert',
    version,
    orientation: 'portrait',
    icon: './src/assets/app/icon.png',
    scheme: 'com.mco.shiftalert',
    userInterfaceStyle: 'light',
    splash: {
      image: './src/assets/app/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.mco.shiftalert',
      googleServicesFile: './src/config/firebase/GoogleService-Info.plist',
    },
    extra: env,
    android: {
      versionCode: versionAsInt,
      adaptiveIcon: {
        foregroundImage: './src/assets/app/icon.png',
        backgroundColor: '#ffffff',
      },
      softwareKeyboardLayoutMode: 'pan',
      package: 'com.mco.shiftalert',
      googleServicesFile: './src/config/firebase/google-services.json',
    },
    platforms: ['ios', 'android'],
    plugins: [
      'expo-router',
      '@react-native-firebase/app',
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  } as ExpoConfig

  return defaultConfig
}
