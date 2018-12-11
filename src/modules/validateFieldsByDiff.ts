import { FormattedFieldsDescription, ValidationState } from '../types';
import { validateField } from './validateField';
// TODO add tests here
function validateFieldsByDiff(
  newDiff: ValidationState,
  oldValidationState: ValidationState,
  validationDescription: FormattedFieldsDescription,
  showErrors: boolean
) {
  const newValidationState = { ...oldValidationState };
  Object.keys(newDiff).forEach(fieldName => {
    const validatedStatuses = validateField(
      newDiff[fieldName],
      validationDescription[fieldName]
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