import { FieldsDescription, FormValidationState, ValidateReturn, ErrorMessages, FormattedFieldsDescription } from './types';
/**
 * A simle class for fields validation based on their state object (like in React.js local state)
 * @author Chernenko Alexander <ca@nullgr.com>, <akazimirkas@gmail.com>
 * @author Yurii Fediv <y.fediv@nullgr.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 */
declare class Validator<State> {
    errors: ErrorMessages;
    validationDescription: FormattedFieldsDescription;
    validationState: FormValidationState;
    isInitValidationStateSet: boolean;
    constructor(fields: FieldsDescription);
    private updateValidationStatuses(partialValidationState);
    private findFirstFailedRuleMessage(fieldDescripton, statuses);
    private validateField(fieldValue, fieldRules);
    setInitialValues(state: State): State;
    validate(state: State): ValidateReturn;
    isFormValid(): boolean;
}
export default Validator;
