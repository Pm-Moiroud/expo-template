import { useFormikContext } from 'formik'
import React, { useCallback, useMemo, useRef, useState, type FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import InputText from '~components/UI/InputText'
import * as ImagePicker from 'expo-image-picker'
import { Image } from 'expo-image'
import type { RegisterForm } from '../types'
import { Picker } from '@react-native-picker/picker'
import { useGetRoles } from '~features/roles/api/useGetRoles'
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { BottomSheetRef } from '~components/UI/BottomSheet'
import SelectSheet from '~components/UI/SelectSheet/SelectSheet'

type ProfileStepProps = {}

const ProfileStep: FC<ProfileStepProps> = (_props) => {
  const [isImageLoading, setIsImageLoading] = useState(false)
  const theme = useTheme()
  const { t } = useTranslation('auth')

  const { handleChange, handleBlur, errors, values, setFieldValue } = useFormikContext<RegisterForm>()

  const { data } = useGetRoles({
    companyId: values.company_id,
  })

  const jobs = useMemo(
    () =>
      data?.data.map((job: any) => ({
        value: job.id,
        label: job.name,
      })) ?? [],
    [data]
  )

  const sheetRef = useRef<BottomSheetRef>(null)

  const pickImageAsync = useCallback(async () => {
    setIsImageLoading(true)
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        quality: 1,
      })

      if (!result.canceled) {
        setFieldValue('avatar_uri', result.assets[0].uri)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsImageLoading(false)
    }
  }, [])

  console.log('avatar_uri', values.avatar_uri)
  return (
    <View style={{ paddingTop: 20, gap: 20 }}>
      <Pressable
        onPress={pickImageAsync}
        style={{
          position: 'relative',
          width: 75,
          height: 75,
          borderRadius: 50,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          backgroundColor: theme.colors.elevation.level1,
          shadowColor: 'black',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
        }}
      >
        {isImageLoading ? (
          <ActivityIndicator />
        ) : values.avatar_uri ? (
          <>
            <Pressable
              onPress={() => setFieldValue('avatar_uri', '')}
              style={{
                position: 'absolute',
                zIndex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                width: 75,
                height: 75,
              }}
            >
              <FontAwesome6 name="circle-xmark" size={24} color="white" />
            </Pressable>
            <Image source={{ uri: values.avatar_uri }} style={{ width: 75, height: 75, borderRadius: 50 }} />
          </>
        ) : (
          <Text style={{ color: theme.colors.primary, fontWeight: 500 }}>{t('avatar')}</Text>
        )}
      </Pressable>
      <InputText
        mode="outlined"
        label={t('firstname')}
        inputMode="text"
        autoComplete="name"
        autoCorrect={false}
        value={values.firstname}
        onChangeText={handleChange('firstname')}
        onBlur={handleBlur('firstname')}
        error={errors.firstname}
      />
      <InputText
        mode="outlined"
        label={t('lastname')}
        inputMode="text"
        autoComplete="family-name"
        autoCorrect={false}
        value={values.lastname}
        onChangeText={handleChange('lastname')}
        onBlur={handleBlur('lastname')}
        error={errors.lastname}
      />
      <Button
        mode="elevated"
        style={{ alignSelf: 'flex-start', marginTop: 20 }}
        onPress={() => sheetRef.current?.open()}
      >
        {values.job_id ? jobs.find((job) => job.value === values.job_id)?.label : t('select_your_job')}
      </Button>

      <SelectSheet
        ref={sheetRef}
        selectedValue={values.job_id}
        onValueChange={(value) => setFieldValue('job_id', value)}
        items={jobs}
      />
    </View>
  )
}

export default ProfileStep
