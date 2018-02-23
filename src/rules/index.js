// @flow
export const requiredRule = (value: string | boolean) => !!value;
export const lengthRule = (l: number) => (v: string) => !!v && v.length >= l;
