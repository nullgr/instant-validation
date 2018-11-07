export type Rule = (val: any, state?: Object) => boolean;

export type RuleData = {
  rule: Rule;
  message: string;
  id?: string;
};

/**
 * FieldsDescription type for using it in constructor
 * you only can use array of objects with RuleData
 */
export type FieldsDescription = {
  [key: string]: RuleData[];
};

/**
 * FieldValidationState type describes each field validation info
 */
export type FieldValidationState = {
  value: string;
  showError: boolean;
  statuses: boolean[];
};

/**
 * FormValidationState type describes whole form validation info
 */
export type FormValidationState =
  | {
      [key: string]: FieldValidationState;
    }
  | {};

/**
 * ValidatorReturn type describes what exactly validate method returns
 */
export type ValidateReturn = {
  [key: string]: ErrorMessages;
};

/**
 * FieldsDescription type for using it in under the hood, each ruleData is 100% an array
 */
export type FormattedFieldsDescription = {
  [key: string]: RuleData[];
};

export type ErrorMessages =
  | {
      [key: string]: string;
    }
  | {};
