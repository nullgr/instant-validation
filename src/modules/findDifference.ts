import { FormValidationState, FieldValidationState } from '../types';

function findDifference<State>(
  state: State,
  actualValidationState: FormValidationState
): FieldValidationState | {} {
  let diff = {};

  Object.keys(actualValidationState).forEach(fieldName => {
    if (
      typeof state[fieldName] === 'undefined' ||
      state[fieldName] === actualValidationState[fieldName].value
    ) {
      return;
    }

    diff[fieldName] = {
      ...actualValidationState[fieldName],
      value: state[fieldName],
      showError: true
    };
  });

  console.log(diff);
  return diff;
}

export { findDifference };
