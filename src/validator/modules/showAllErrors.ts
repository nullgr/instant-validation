import { ValidationState } from '../types';

function showAllErrors<ComponentState>(
  validationState: ValidationState<ComponentState>,
  show: boolean
): ValidationState<ComponentState> {
  return Object.keys(validationState).reduce(
    (acc, key) => {
      acc[key] = { ...validationState[key], showError: show };
      return acc;
    },
    {} as ValidationState<ComponentState>
  );
}
export { showAllErrors };
