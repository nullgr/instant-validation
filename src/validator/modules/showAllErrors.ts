import { ValidationState } from '../types';

function showAllErrors(
  validationState: ValidationState,
  show: boolean
): ValidationState {
  return Object.keys(validationState)
    .reduce((acc, key) => {
      acc[key] = { ...validationState[key], showError: show };
      return acc
    }
  , {});
}
export { showAllErrors };
