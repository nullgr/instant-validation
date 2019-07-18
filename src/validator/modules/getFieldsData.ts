import { PublicFieldsData, ValidationState } from '../types';

function getFieldsData<ComponentState>(
  validationState: ValidationState<ComponentState>
): PublicFieldsData<ComponentState> {
  // TODO add README desctiption and example for it
  return Object.keys(validationState).reduce(
    (acc, key) => {
      acc[key] = {
        ...validationState[key],
        valid:
          validationState[key].statuses.filter((status: boolean) => !status)
            .length === 0
      };
      return acc;
    },
    {} as PublicFieldsData<ComponentState>
  );
}

export { getFieldsData };
