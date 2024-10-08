import React, { type FC, useCallback, useState } from 'react'
import { View } from 'react-native'
import { Text, TextInput, type TextInputProps, useTheme } from 'react-native-paper'
type InputTextProps = Omit<TextInputProps, 'error'> & {
  error?: string
  secure?: boolean
}

const InputText: FC<InputTextProps> = ({ error = '', secure = false, ...props }) => {
  const theme = useTheme()
  const [isSecure, setIsSecure] = useState(secure)

  const renderIcon = useCallback(() => {
    if (secure) {
      return isSecure ? (
        <TextInput.Icon icon="eye" onPress={() => setIsSecure(false)} />
      ) : (
        <TextInput.Icon icon="eye-off" onPress={() => setIsSecure(true)} />
      )
    }
    return null
  }, [secure, isSecure])
  return (
    <View>
      <TextInput
        {...props}
        error={!!error}
        right={renderIcon()}
        secureTextEntry={!secure ? false : isSecure ? true : false}
      />
      {error ? <Text style={{ fontSize: 12, color: theme.colors.error }}>{error}</Text> : null}
    </View>
  )
}

export default InputText
