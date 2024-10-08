import { Link } from 'expo-router'
import { Formik } from 'formik'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { Button, Divider, Text, useTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

import Apple from '~components/svg/Apple'
import Google from '~components/svg/Google'
import InputText from '~components/UI/InputText'
import { LOGIN_INITIAL_STATE } from '~features/auth/constants'
import type { LoginForm } from '~features/auth/types'
import { LOGIN_SCHEMA } from '~features/auth/validations'

const Login = () => {
  const theme = useTheme()
  const { t } = useTranslation('auth')

  const onSubmit = useCallback((values: LoginForm) => {
    console.info(values)
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 30 }}>
      <View style={styles.container}>
        <Text variant="headlineLarge">{t('welcome')},</Text>
        <Text>{t('login_description')} </Text>
        <View style={styles.formContainer}>
          <Formik<LoginForm>
            initialValues={LOGIN_INITIAL_STATE}
            validationSchema={LOGIN_SCHEMA}
            onSubmit={onSubmit}
            validateOnChange={false}
            validateOnBlur={false}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <View style={styles.form}>
                <InputText
                  mode="outlined"
                  label={t('email')}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  error={errors.email}
                />
                <InputText
                  mode="outlined"
                  label={t('password')}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  error={errors.password}
                />
                <View style={styles.forgotPassword}>
                  <Link style={[styles.link, { color: theme.colors.primary }]} href={'/(auth)/register'}>
                    {t('forgot_password')}
                  </Link>
                </View>
                <View style={styles.buttonContainer}>
                  <Button mode="contained" onPress={() => handleSubmit()}>
                    <Text style={styles.buttonText}>{t('signin')}</Text>
                  </Button>
                  <Text style={styles.centerText}>
                    {t('no_account_yet')}{' '}
                    <Link style={[styles.link, { color: theme.colors.primary }]} href={'/(auth)/register'}>
                      {t('register')}
                    </Link>
                  </Text>
                </View>
              </View>
            )}
          </Formik>
          <View style={styles.socialContainer}>
            <Divider />
            <Text style={styles.centerText}>{t('or_continue_with')} :</Text>
            <View style={styles.socialButtons}>
              <Button mode="outlined" icon={({ size }) => <Google width={size} height={size} />}>
                <Text>{t('google')}</Text>
              </Button>
              <Button mode="outlined" icon={({ size }) => <Apple width={size} height={size} />}>
                <Text>{t('apple')}</Text>
              </Button>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  form: {
    gap: 10,
    height: '50%',
  },
  forgotPassword: {
    alignItems: 'flex-end',
  },
  link: {
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    gap: 20,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
  },
  centerText: {
    textAlign: 'center',
  },
  socialContainer: {
    gap: 20,
  },
  socialButtons: {
    gap: 10,
  },
})

export default Login
