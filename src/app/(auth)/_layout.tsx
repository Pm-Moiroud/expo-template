import { Stack } from 'expo-router'
import type { FC, PropsWithChildren } from 'react'

const AuthLayout: FC<PropsWithChildren> = () => {
  // const user = useAuthStore((state) => state.user)

  // if (user) {
  //   return <Redirect href={`/${SCREEN_NAME.ROOT}`} />;
  // }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#fff' },
      }}
    />
  )
}

export default AuthLayout
