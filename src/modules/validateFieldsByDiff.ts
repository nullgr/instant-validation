import {
  FormattedFieldsDescription,
  InsertedArgs,
  RuleIdsInFields,
  ValidationState
} from '../types';
import { validateField } from './validateField';
function validateFieldsByDiff(
  newDiff: ValidationState,
  oldValidationState: ValidationState,
  validationDescription: FormattedFieldsDescription,
  showErrors: boolean,
  insertedArgs: InsertedArgs,
  ruleIdsInFields: RuleIdsInFields
) {
  const newValidationState = { ...oldValidationState };
  // validate fields by diff
  Object.keys(newDiff).forEach(fieldName => {
    const validatedStatuses = validateField(
      newDiff[fieldName],
      validationDescription[fieldName],
      insertedArgs
    );
    newValidationState[fieldName] = {
      showError: showErrors,
      value: newDiff[fieldName],
      statuses: validatedStatuses,
      touched: true
    };
  });

  // validate fields, that uses additional arguments
  Object.keys(insertedArgs).forEach(arg => {
    if (!ruleIdsInFields[arg]) {
      return;
    }
    ruleIdsInFields[arg].forEach(field => {
      if (newDiff[field]) {
        return;
      }

      const validatedStatuses = validateField(
        newValidationState[field].value,
        validationDescription[field],
        insertedArgs
      );
      newValidationState[field] = {
        ...newValidationState[field],
        statuses: validatedStatuses
      };
    });
  });
  return newValidationState;
}
export { validateFieldsByDiff };
