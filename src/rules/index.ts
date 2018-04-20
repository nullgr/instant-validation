export const requiredRule = (value: string | boolean): boolean => !!value;
export const lengthRule = (l: number) => (v: string): boolean =>
  !!v && v.length >= l;
