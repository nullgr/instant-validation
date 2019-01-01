import { ValidationState } from '../types';

function showAllErrors(
  validationState: ValidationState,
  show: boolean
): ValidationState {
  let newState = {};
  Object.keys(validationState).forEach(
    key => (newState[key] = { ...validationState[key], showError: show })
  );
  return newState;
}
export { showAllErrors };
