import { useFormikContext } from 'formik';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import InputText from '~components/UI/InputText';

import type { RegisterForm } from '../types';

type InscriptionStepProps = {};

const InscriptionStep: FC<InscriptionStepProps> = _props => {
  const { t } = useTranslation('auth');
  const { handleChange, handleBlur, errors, values } =
    useFormikContext<RegisterForm>();

  return (
    <View style={{ paddingTop: 20, gap: 20 }}>
      <InputText
        mode='outlined'
        label={t('email')}
        inputMode='email'
        autoComplete='email'
        autoCorrect={false}
        value={values.email}
        onChangeText={handleChange('email')}
        onBlur={handleBlur('email')}
        error={errors.email}
      />
      <InputText
        mode='outlined'
        label={t('password')}
        autoComplete='password'
        secure
        autoCorrect={false}
        value={values.password}
        onChangeText={handleChange('password')}
        onBlur={handleBlur('password')}
        error={errors.password}
      />
      <InputText
        mode='outlined'
        label={t('confirm_password')}
        autoComplete='password'
        secure
        autoCorrect={false}
        value={values.confirm_password}
        onChangeText={handleChange('confirm_password')}
        onBlur={handleBlur('confirm_password')}
        error={errors.confirm_password}
      />
    </View>
  );
};

export default InscriptionStep;
