import * as Clipboard from 'expo-clipboard';
import { useFormikContext } from 'formik';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

import InputText from '~components/UI/InputText';
import useSnackbar from '~components/UI/Snackbar';

import type { RegisterForm } from '../types';

type CompanyStepProps = {};

const CompanyStep: FC<CompanyStepProps> = () => {
  const { handleChange, handleBlur, errors, values } =
    useFormikContext<RegisterForm>();

  const { show } = useSnackbar();

  const { t } = useTranslation('auth');

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 20,
        gap: 20,
      }}
    >
      <InputText
        mode='outlined'
        label={t('company_license')}
        value={values.company_license}
        onChangeText={handleChange('company_license')}
        onBlur={handleBlur('company_license')}
        error={errors.company_license}
      />
      <Button
        mode='text'
        onPress={async () => {
          const content = await Clipboard.getStringAsync();
          if (content) {
            handleChange('company_license')(content);
          } else {
            show({
              message: t('no_content_to_paste'),
              type: 'error',
            });
          }
        }}
      >
        {t('paste_company_license')}
      </Button>
    </View>
  );
};

export default CompanyStep;
