import { requiredRule, lengthRule } from "../../src/rules";

export const LENGTH_ERROR = "Length should be minimum 5 characters";
export const ERROR_EMPTY = "This field should be filled";

export function createValidator(publicApi) {
  const Validator = publicApi
    ? require("../../src/index").default
    : require("../../src/validator").default;
  // return new Validator(3);
  return new Validator({
    login: [
      {
        rule: requiredRule,
        message: ERROR_EMPTY
      },
      {
        rule: lengthRule(5),
        message: LENGTH_ERROR
      }
    ],
    password: [
      {
        rule: lengthRule(8),
        message: LENGTH_ERROR
      },
      {
        id: "repeatRule",
        rule: (val, state) =>
          state.repeatPass === val || !val || !state.repeatPass,
        message: ""
      }
    ],
    repeatPass: [
      {
        rule: lengthRule(8),
        message: LENGTH_ERROR
      },
      {
        id: "repeatRule",
        rule: (val, state) => val === state.newPass || !val || !state.newPass,
        message: ""
      }
    ],
    accept: {
      rule: requiredRule,
      message: ERROR_EMPTY
    }
  });
}
