import { Formik } from 'formik'
import React, { type FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

import Stepper from '~components/UI/Stepper/Stepper'
import CompanyStep from '~features/auth/components/CompanyStep'
import InscriptionStep from '~features/auth/components/InscriptionStep'
import ProfileStep from '~features/auth/components/ProfileStep'
import type { RegisterForm } from '~features/auth/types'
import { validateFieldByStep } from '~features/auth/utils'
import { REGISTER_SCHEMA } from '~features/auth/validations'
import storage from '@react-native-firebase/storage'

type RegisterProps = {}

const Register: FC<RegisterProps> = (_props) => {
  const { t } = useTranslation('auth')
  const [step, setStep] = useState(1)

  const nextStep = () => {
    setStep((prev) => prev + 1)
  }

  const previousStep = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmitForm = async (values: RegisterForm) => {
    try {
      if (values.avatar_uri) {
        console.log('here')
        const ref = storage().ref('avatars/' + values.email)
        await ref.putString(values.avatar_uri, 'raw')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 30 }}>
      <View style={{ flex: 1 }}>
        <Text variant="headlineLarge">{t('welcome')},</Text>
        <Text>{t('register_description')}</Text>
        <View style={{ paddingTop: 20, flex: 1 }}>
          {/**  Stepper **/}
          <View style={{ paddingTop: 30, flex: 1 }}>
            <Formik<RegisterForm>
              initialValues={{
                company_license: '',
                company_id: '',
                email: '',
                password: '',
                confirm_password: '',
                firstname: '',
                lastname: '',
                job_id: '',
                avatar_uri: '',
              }}
              onSubmit={handleSubmitForm}
              validationSchema={REGISTER_SCHEMA}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({ validateField, values, dirty, setErrors, setFieldValue, handleSubmit }) => (
                <>
                  <Stepper forceInitialRender={false} value={step} onChange={setStep}>
                    <Stepper.List style={{ paddingHorizontal: 20 }}>
                      <Stepper.Item value={1}>
                        <Text>{t('company')}</Text>
                      </Stepper.Item>
                      <Stepper.Item value={2} disabled={step < 2}>
                        <Text>{t('inscription')}</Text>
                      </Stepper.Item>
                      <Stepper.Item value={3} disabled={step < 3}>
                        <Text>{t('profile')}</Text>
                      </Stepper.Item>
                    </Stepper.List>

                    {/**  Step1 : CompanyId **/}
                    <Stepper.Content value={1}>
                      <CompanyStep />
                    </Stepper.Content>

                    {/**  Step2 : Inscription (email/password, google, apple) **/}
                    <Stepper.Content value={2}>
                      <InscriptionStep />
                    </Stepper.Content>

                    {/**  Step3 : Profile **/}
                    <Stepper.Content value={3}>
                      <ProfileStep />
                    </Stepper.Content>
                  </Stepper>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 20,
                      alignSelf: 'center',
                    }}
                  >
                    {step > 1 ? (
                      <Button mode="contained" style={{ flex: 1 }} onPress={previousStep}>
                        <Text style={{ color: 'white' }}>{t('previous')}</Text>
                      </Button>
                    ) : null}
                    {step < 3 ? (
                      <Button
                        mode="contained"
                        style={{ flex: 1 }}
                        disabled={!dirty}
                        onPress={async () => {
                          if (await validateFieldByStep(step, validateField, values, setErrors, setFieldValue)) {
                            setErrors({})
                            nextStep()
                          }
                        }}
                      >
                        <Text style={{ color: 'white' }}>{t('next')}</Text>
                      </Button>
                    ) : (
                      <Button mode="contained" style={{ flex: 1 }} onPress={() => handleSubmit()}>
                        <Text style={{ color: 'white' }}>{t('register')}</Text>
                      </Button>
                    )}
                  </View>
                </>
              )}
            </Formik>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Register
