import { FieldsDescription, FormValidationState, ValidateReturn, FormattedFieldsDescription } from './types';
/**
 * A simle class for fields validation based on their state object (like in React.js local state)
 * @author Chernenko Alexander <ca@nullgr.com>, <akazimirkas@gmail.com>
 * @author Yurii Fediv <y.fediv@nullgr.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 */
declare class Validator<State> {
    validationDescription: FormattedFieldsDescription;
    validationState: FormValidationState | {};
    isInitValidationStateSet: boolean;
    constructor(fields: FieldsDescription);
    private getErrors();
    private updateValidationStatuses(fieldObj);
    private validateField(fieldValue, fieldRules);
    setInitialValues(state: State): State;
    validate(state: State): ValidateReturn;
}
export default Validator;
