import * as yup from 'yup';

export const LOGIN_SCHEMA = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const REGISTER_SCHEMA = yup.object().shape({
  company_license: yup.string().required('Company code is required'),
  company_id: yup.string().required('Company ID is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm password is required'),
  firstname: yup.string().required('Firstname is required'),
  lastname: yup.string().required('Lastname is required'),
  job_id: yup.string().required('Role is required'),
  avatar_uri: yup.string(),
});
