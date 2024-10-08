import '~config/i18n/i18nextConfig'
import 'react-native-reanimated'

import { QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { queryClient } from '~config/react-query'
import NetworkProvider from '~providers/NetworkProvider'
import { PaperProvider } from 'react-native-paper'
import { SnackbarProvider } from '~components/UI/Snackbar'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

const RootLayout = () => {
  const [loaded] = useFonts({})

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <SnackbarProvider>
          <NetworkProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </NetworkProvider>
        </SnackbarProvider>
      </PaperProvider>
    </QueryClientProvider>
  )
}

export default RootLayout
