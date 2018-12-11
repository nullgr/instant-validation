import { FieldsDescription, ValidationState, ValidateReturn, ErrorMessages, FormattedFieldsDescription } from './types';
/**
 * A simple class for fields validation based on their state object (like in React.js local state)
 * @author Chernenko Alexander <ca@nullgr.com>, <akazimirkas@gmail.com>
 * @author Yurii Fediv <y.fediv@nullgr.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 * @author Igor Ivanov <i.ivanov@nullgr.com>
 */
declare class Validator<ComponentState> {
    errors: ErrorMessages;
    validationDescription: FormattedFieldsDescription;
    validationState: ValidationState;
    isInitValidationStateSet: boolean;
    constructor(fields: FieldsDescription);
    private refreshState;
    setInitialValues(componentState: ComponentState): void;
    validate(componentState: ComponentState): ValidateReturn;
    isFormValid(): boolean;
}
export default Validator;
