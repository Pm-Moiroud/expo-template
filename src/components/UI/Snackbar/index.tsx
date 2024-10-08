import React, {
  createContext,
  type FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  PropsWithChildren,
} from 'react'
import { Portal, Snackbar } from 'react-native-paper'

export const DEFAULT_SNACKBAR_OPTIONS: SnackBarOptions = {
  message: '',
  type: 'info',
  duration: 3000,
}

export type SnackBarOptions = {
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}

export type SnackbarContextReturnType = {
  show: (snackbarOptions: SnackBarOptions) => void
}

const SnackbarContext = createContext<SnackbarContextReturnType>({
  show: () => {},
})

export const SnackbarProvider: FC<PropsWithChildren> = ({ children }) => {
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false)
  const [snackbarOptions, setSnackbarOptions] = useState<SnackBarOptions>(DEFAULT_SNACKBAR_OPTIONS)

  const show = useCallback(
    (snackbarOptions: SnackBarOptions) => {
      setSnackbarOptions((prev) => ({
        ...prev,
        ...snackbarOptions,
      }))
      setSnackbarVisible(true)
    },
    [setSnackbarOptions, setSnackbarVisible]
  )

  useEffect(() => {
    if (snackbarVisible) {
      const timeout = setTimeout(() => {
        setSnackbarVisible(false)
        setSnackbarOptions(DEFAULT_SNACKBAR_OPTIONS)
      }, snackbarOptions.duration)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [show])

  const contextValue = useMemo(() => ({ show }), [show])

  return (
    <SnackbarContext.Provider value={contextValue}>
      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={snackbarOptions.duration}
        >
          {snackbarOptions.message}
        </Snackbar>
      </Portal>
      {children}
    </SnackbarContext.Provider>
  )
}

const useSnackbar = () => useContext(SnackbarContext)

export default useSnackbar
