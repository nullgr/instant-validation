import { PublicFieldsData, ValidationState } from '../types';

function getFieldsData(validationState: ValidationState): PublicFieldsData {
    // TODO add README desctiption and example for it
    let result = {};
    Object.keys(validationState).forEach(key => {
      result[key] = {
        ...validationState[key],
        valid: validationState[key].statuses.filter((status: boolean) => !status).length === 0
      }
    })
    return result;
  }
export { getFieldsData };
