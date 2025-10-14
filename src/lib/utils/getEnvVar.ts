type TGetEnvVar = {
  key: string;
  type?: number | string;
};
type TGetEnvVarReturn = string | number;
export const getEnvVar = ({ key, type }: TGetEnvVar): TGetEnvVarReturn => {
  const value = process.env[key];
  if (type === 'number') {
    return Number(value);
  }
  return String(value);
};
