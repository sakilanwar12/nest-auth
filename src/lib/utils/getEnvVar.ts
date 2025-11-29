export function getEnvVar(options: { key: string; type: 'number' }): number;
export function getEnvVar(options: { key: string; type?: 'string' }): string;
export function getEnvVar({
  key,
  type,
}: {
  key: string;
  type?: 'string' | 'number';
}): string | number {
  const value = process.env[key];
  if (type === 'number') {
    return Number(value);
  }
  return String(value);
}
