// @flow
export type Rule = (val: any, state: Object) => boolean;

export type RuleData = {
  rule: Rule,
  message: string,
  id?: string
};

/**
 * FieldsDescription type for using it in constructor
 * you can use both, object or array of objects with RuleData
 */
export type FieldsDescription = {
  [key: string]: RuleData | RuleData[]
};

/**
 * FieldsDescription type for using it in under the hood, each ruleData is 100% an array
 */
export type FormattedFieldsDescription = {
  [key: string]: RuleData[]
};
