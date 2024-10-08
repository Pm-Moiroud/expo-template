import type { InferType } from 'yup';

import type { LOGIN_SCHEMA, REGISTER_SCHEMA } from './validations';

export type LoginForm = InferType<typeof LOGIN_SCHEMA>;

export type RegisterForm = InferType<typeof REGISTER_SCHEMA>;
