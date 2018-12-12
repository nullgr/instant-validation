import {
  FormattedFieldsDescription,
  RuleData,
  ValidationState
} from '../types';
function findFirstFailedRuleMessage(
  fieldDescripton: RuleData[],
  statuses: boolean[]
) {
  const searchIndex = statuses.indexOf(false);
  return searchIndex === -1 ? '' : fieldDescripton[searchIndex].message;
}
// TODO add tests here
function getErrorMessages(
  validationState: ValidationState,
  validationDescription: FormattedFieldsDescription
) {
  let errors = {};
  Object.keys(validationState).forEach(fieldName => {
    errors[fieldName] = validationState[fieldName].showError
      ? findFirstFailedRuleMessage(
          validationDescription[fieldName],
          validationState[fieldName].statuses
        )
      : '';
  });
  return errors;
}
export { getErrorMessages };
