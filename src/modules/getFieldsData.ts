import { PublicFieldsData, ValidationState } from '../types';

function getFieldsData(validationState: ValidationState): PublicFieldsData {
    // TODO add README desctiption and example for it
    let result = Object.keys(validationState).reduce((acc, key) => {
      acc[key] = {
        ...validationState[key],
        valid: validationState[key].statuses.filter((status: boolean) => !status).length === 0
      };
      return acc;
    }, {})
    return result;
  }
export { getFieldsData };
