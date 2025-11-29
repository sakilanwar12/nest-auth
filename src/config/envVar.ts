import { getEnvVar } from 'src/lib/utils/getEnvVar';

export const envVar = {
  PORT: getEnvVar({ key: 'PORT', type: 'number' }),
  DATABASE_URL: getEnvVar({ key: 'DATABASE_URL', type: 'string' }),
  PASSWORD_SALT: getEnvVar({ key: 'PASSWORD_SALT', type: 'number' }),
  NEST_AUTH_ACCESS_TOKEN_SECRET: getEnvVar({
    key: 'NEST_AUTH_ACCESS_TOKEN_SECRET',
    type: 'string',
  }),
  NEST_AUTH_REFRESH_TOKEN_SECRET: getEnvVar({
    key: 'NEST_AUTH_REFRESH_TOKEN_SECRET',
    type: 'string',
  }),
  NEST_AUTH_ACCESS_TOKEN_EXPIRES_IN: getEnvVar({
    key: 'NEST_AUTH_ACCESS_TOKEN_EXPIRES_IN',
    type: 'number',
  }),
  NEST_AUTH_REFRESH_TOKEN_EXPIRES_IN: getEnvVar({
    key: 'NEST_AUTH_REFRESH_TOKEN_EXPIRES_IN',
    type: 'string',
  }),
} as const;
