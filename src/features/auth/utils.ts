import { checkLicenseValidity } from '~features/licenses/api/checkLicenseValidity';
import type { RegisterForm } from './types';
import { REGISTER_SCHEMA } from './validations';
import { axios } from '~config/axios';
import { FormikErrors } from 'formik';
import { AxiosError } from 'axios';

export const validateFieldByStep = async (
  step: number,
  validateField: (field: string) => Promise<void> | Promise<string | undefined>,
  values: RegisterForm,
  setErrors: (errors: FormikErrors<RegisterForm>) => void,
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<RegisterForm>>
): Promise<boolean> => {
  switch (step) {
    case 1: {
      try {
        // Check if the field is valid according to the schema
        await REGISTER_SCHEMA.validateAt('company_license', {
          company_license: values.company_license,
        });

        // Check if the license is valid
        const licenseValidity = await axios.post('/licenses/validity', {
          company_license: values.company_license,
        });

        if (licenseValidity.status === 200) {
          setFieldValue('company_id', licenseValidity.data.company.id);
          return true;
        }
      } catch (e) {
        if (e instanceof AxiosError) {
          setErrors({
            company_license: e.response?.data.message,
          });
        }

        return false;
      }
    }
    case 2: {
      const fields = ['email', 'password', 'confirm_password'];
      const errors = await Promise.all(
        fields.map(async field => {
          try {
            validateField(field);
            await REGISTER_SCHEMA.validateAt(field, {
              ...values,
              [field]: values[field as keyof RegisterForm],
            });
            return undefined;
          } catch (e) {
            return false;
          }
        })
      );
      return !errors.some(f => f === false);
    }
    case 3: {
      return false;
    }
    default: {
      return false;
    }
  }
};
