import { FieldsDescription, FormattedFieldsDescription } from './types';
/**
 * A simle class for fields validation based on their state object (like in React.js local state)
 * @author Chernenko Alexander <ca@nullgr.com>, <akazimirkas@gmail.com>
 * @author Yurii Fediv <y.fediv@nullgr.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 */
declare class Validator<State> {
    validationDescription: FormattedFieldsDescription;
    validationState: Partial<State>;
    isInitValidationStateSet: boolean;
    constructor(fields: FieldsDescription);
    private updateValidationStatuses(fieldObj);
    private validateField(fieldValue, fieldRules);
    private countDiff(state);
    setInitialValues(state: State): State;
    validate(state: State): State;
}
export default Validator;
