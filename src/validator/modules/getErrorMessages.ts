import {
  ErrorMessages,
  FormattedFieldsDescription,
  RuleData,
  ValidationState
} from '../types';

function findFirstFailedRuleMessage(
  fieldDescripton: RuleData[],
  statuses: boolean[]
): string {
  const searchIndex = statuses.indexOf(false);
  return searchIndex === -1 ? '' : fieldDescripton[searchIndex].message;
}

// TODO add tests here
function getErrorMessages<ComponentState>(
  validationState: ValidationState<ComponentState>,
  validationDescription: FormattedFieldsDescription
): ErrorMessages<ComponentState> {
  return Object.keys(validationState).reduce(
    (acc, fieldName) => {
      acc[fieldName] = validationState[fieldName].showError
        ? findFirstFailedRuleMessage(
            validationDescription[fieldName],
            validationState[fieldName].statuses
          )
        : '';
      return acc;
    },
    {} as ErrorMessages<ComponentState>
  );
}

export { getErrorMessages };
