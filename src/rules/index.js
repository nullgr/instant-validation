// @flow
export const requiredRule = (value: string) => !!value;
export const requiredRuleBool = (value: boolean) => value;
export const lengthRule = (l: number) => (v: string) => !!v && v.length >= l;
