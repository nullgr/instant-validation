import { FormattedFieldsDescription, ValidationState, RuleData } from '../types';
function findFirstFailedRuleMessage(
  fieldDescripton: RuleData[],
  statuses: boolean[]
) {
  return statuses.indexOf(false) === -1
    ? ''
    : fieldDescripton[statuses.indexOf(false)].message;
}
// TODO add tests here
function getErrorMessages(
  validationState: ValidationState,
  validationDescription: FormattedFieldsDescription
) {
  let errors = {};
  Object.keys(validationState).forEach(fieldName => {
    errors[fieldName] = validationState[fieldName].showError ?
    findFirstFailedRuleMessage(
      validationDescription[fieldName],
      validationState[fieldName].statuses
    ) : ''
  });
  return errors;
}
export { getErrorMessages };