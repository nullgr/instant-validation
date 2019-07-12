export type Rule = (val: any, ...insertedArgs: any[]) => boolean;

export type RuleData = {
  rule: Rule;
  message: string;
  ruleId?: string;
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
export interface FieldValidationState {
  value: string;
  touched: boolean;
  showError: boolean;
  statuses: boolean[];
}

export interface PublicFieldValidationState extends FieldValidationState {
  valid: boolean;
}

/**
 * ValidationState type describes whole form validation info
 */
export type ValidationState =
  | {
      [key: string]: FieldValidationState;
    }
  | {};

/**
 * Public ValidationState type describes whole form validation info
 */
export type PublicFieldsData =
  | {
      [key: string]: PublicFieldValidationState;
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

export type InsertedArgs = {
  [key: string]: any[];
};

export type ErrorMessages =
  | {
      [key: string]: string;
    }
  | {};

export type RuleIdsInFields = {
  [ruleId: string]: string[];
};

export type ChangedArgsFields = string[];
