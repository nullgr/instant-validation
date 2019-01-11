import { FormattedFieldsDescription, InsertedArgs, RuleIdsInFields, ValidationState } from '../types';
declare function validateFieldsByDiff(newDiff: ValidationState, oldValidationState: ValidationState, validationDescription: FormattedFieldsDescription, touched: boolean, insertedArgs: InsertedArgs, ruleIdsInFields: RuleIdsInFields): {};
export { validateFieldsByDiff };
