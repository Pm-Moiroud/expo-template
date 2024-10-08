import NetInfo from '@react-native-community/netinfo'
import { onlineManager } from '@tanstack/react-query'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const NetworkContext = createContext<boolean>(true)

const NetworkProvider: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation('common')
  const [isConnected, setIsConnected] = useState(true)
  const lastNeworkStatus = useRef<'isConnected' | 'isNotConnected'>('isConnected')

  useEffect(() => {
    const unsubscribe = onlineManager.setEventListener((setOnline) => {
      return NetInfo.addEventListener((state) => {
        setOnline(!!state.isConnected)
        if (state.isConnected && lastNeworkStatus.current === 'isConnected') {
          return // do nothing when app starts
        } else if (state.isInternetReachable && lastNeworkStatus.current === 'isNotConnected') {
          setIsConnected(true)
          lastNeworkStatus.current = 'isConnected'
          //   toast.show(t('connected'), { duration: 4000, color: 'success', variant: 'color' })
        } else if (!state.isConnected) {
          setIsConnected(false)
          lastNeworkStatus.current = 'isNotConnected'
          //   toast.show(t('you_need_internet_to_use_app'), { duration: 10000000, color: 'warning', variant: 'color' })
        }
      })
    })

    return () => unsubscribe
  }, [t])

  const NetworkContextValue = useMemo(() => isConnected, [isConnected])

  return <NetworkContext.Provider value={NetworkContextValue}>{children}</NetworkContext.Provider>
}

export default NetworkProvider
