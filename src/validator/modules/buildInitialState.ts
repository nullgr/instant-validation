import {
  FormattedFieldsDescription,
  InsertedArgs,
  ValidationState
} from '../types';
import { validateFieldsByDiff } from './validateFieldsByDiff';
function buildInitialState<ComponentState>(
  componentState: ComponentState,
  validationDescription: FormattedFieldsDescription,
  insertedArgs: InsertedArgs,
  ruleIdsInFields: any
): ValidationState<ComponentState> {
  let initialDiff = {} as Partial<ComponentState>;
  let initialState = {} as ValidationState<ComponentState>;
  Object.keys(validationDescription).forEach(fieldName => {
    if (typeof componentState[fieldName] === 'undefined') {
      throw new Error(
        `It seems that you didn't passed a field '${fieldName}' value`
      );
    }
    initialDiff[fieldName] = componentState[fieldName];
    initialState[fieldName] = {
      value: componentState[fieldName],
      showError: false,
      touched: false,
      statuses: []
    };
  });
  return validateFieldsByDiff(
    initialDiff,
    initialState,
    validationDescription,
    false,
    insertedArgs,
    ruleIdsInFields
  );
}
export { buildInitialState };
