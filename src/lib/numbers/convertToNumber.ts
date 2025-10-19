interface IConvertToNumber {
  value: string | number;
  digit?: number;
  fallback?: number;
}

const convertToNumber = ({
  value,
  digit = 1,
  fallback = 0,
}: IConvertToNumber): number => {
  let num: number;

  if (typeof value === 'number') {
    num = value;
  } else if (typeof value === 'string') {
    const parsed = parseFloat(value);
    num = isNaN(parsed) ? fallback : parsed;
  } else {
    return fallback;
  }

  return parseFloat(num.toFixed(digit));
};

export default convertToNumber;
