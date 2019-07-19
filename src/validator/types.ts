export type Rule = (val: any, ...insertedArgs: any[]) => boolean;

export interface RuleData {
  rule: Rule;
  message: string;
  ruleId?: string;
}

/**
 * FieldsDescription type for using it in constructor
 * you only can use array of objects with RuleData
 */
export interface FieldsDescription {
  [key: string]: RuleData[];
}

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
export type ValidationState<ComponentState> = {
  [key in keyof ComponentState]: FieldValidationState;
};

/**
 * Public ValidationState type describes whole form validation info
 */
export type PublicFieldsData<ComponentState> = {
  [key in keyof ComponentState]: PublicFieldValidationState;
};

/**
 * ValidatorReturn type describes what exactly validate method returns
 */
export interface ValidateReturn<ComponentState> {
  errors: ErrorMessages<ComponentState>;
  fields: PublicFieldsData<ComponentState>;
}

/**
 * FieldsDescription type for using it in under the hood, each ruleData is 100% an array
 */
export interface FormattedFieldsDescription {
  [key: string]: RuleData[];
}

export interface InsertedArgs {
  [key: string]: any[];
}

export type ErrorMessages<ComponentState> = {
  [key in keyof ComponentState]: string;
};

export interface RuleIdsInFields {
  [ruleId: string]: string[];
}

export type ChangedArgsFields = string[];
