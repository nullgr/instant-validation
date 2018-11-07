import { FormValidationState, FieldValidationState } from '../types';

function findDifference<State>(
  state: State,
  actualValidationState: FormValidationState
): FieldValidationState | {} {
  let difference = {};

  Object.keys(actualValidationState).forEach(fieldName => {
    if (
      typeof state[fieldName] === 'undefined' ||
      state[fieldName] === actualValidationState[fieldName].value
    ) {
      return;
    }

    difference[fieldName] = {
      ...actualValidationState[fieldName],
      value: state[fieldName],
      showError: true
    };
  });

  return difference;
}

export { findDifference };
