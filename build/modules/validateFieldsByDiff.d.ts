import { FormattedFieldsDescription, InsertedArgs, RuleIdsInFields, ValidationState } from '../types';
declare function validateFieldsByDiff(newDiff: ValidationState, oldValidationState: ValidationState, validationDescription: FormattedFieldsDescription, showErrors: boolean, insertedArgs: InsertedArgs, ruleIdsInFields: RuleIdsInFields): {};
export { validateFieldsByDiff };
