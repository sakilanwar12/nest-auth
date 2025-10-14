import { getEnvVar } from 'src/lib/utils/getEnvVar';

export const envVar = {
  PORT: getEnvVar({ key: 'PORT', type: 'number' }),
  DATABASE_URL: getEnvVar({ key: 'DATABASE_URL', type: 'string' }),
  PASSWORD_SALT: getEnvVar({ key: 'PASSWORD_SALT', type: 'number' }),
};
