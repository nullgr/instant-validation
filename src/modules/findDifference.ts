import { ValidationState } from '../types';

function findDifference<ComponentState>(
  componentStateUpdates: ComponentState,
  actualValidationState: ValidationState
): Partial<ComponentState> {
  let difference = {};
  Object.keys(actualValidationState).forEach(fieldName => {
    if (
      typeof componentStateUpdates[fieldName] === 'undefined' ||
      componentStateUpdates[fieldName] ===
        actualValidationState[fieldName].value
    ) {
      return;
    }

    difference[fieldName] = componentStateUpdates[fieldName];
  });
  return difference;
}

export { findDifference };
