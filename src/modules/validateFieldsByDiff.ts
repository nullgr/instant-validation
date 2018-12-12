import { FormattedFieldsDescription, ValidationState, InsertedArgs } from '../types';
import { validateField } from './validateField';
// TODO add tests here
function validateFieldsByDiff(
  newDiff: ValidationState,
  oldValidationState: ValidationState,
  validationDescription: FormattedFieldsDescription,
  showErrors: boolean,
  insertedArgs: InsertedArgs
) {
  const newValidationState = { ...oldValidationState };
  Object.keys(newDiff).forEach(fieldName => {
    const validatedStatuses = validateField(
      newDiff[fieldName],
      validationDescription[fieldName],
      insertedArgs
    );
    newValidationState[fieldName] = {
      showError: showErrors,
      value: newDiff[fieldName],
      statuses: validatedStatuses
    };
  });
  return newValidationState;
}
export { validateFieldsByDiff };