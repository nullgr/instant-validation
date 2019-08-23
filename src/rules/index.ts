export const requiredRule = (value: string | boolean): boolean => !!value;
export const lengthRule = (l: number) => (v: string): boolean =>
  !!v && v.length >= l;

export const minLengthRule: (l: number) => (v: string) => boolean = function (l) {
  return function (v) {
    return !!v && v.length >= l;
  };
};


export const maxLengthRule: (l: number) => (v: string) => boolean = function (l) {
  return function (v) {
    return !!v && v.length <= l;
  };
};
