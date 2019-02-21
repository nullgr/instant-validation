import { ErrorMessages, FieldsDescription, FormattedFieldsDescription, InsertedArgs, RuleIdsInFields, ValidateReturn, ValidationState } from './types';
/**
 * Quck setup. No Dependencies. Framework agnostic validation tool
 * It was created based on react-validation-tools library,
 * Thanks to ideas and participating from
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
    insertedArgs: InsertedArgs;
    ruleIdsInFields: RuleIdsInFields;
    constructor(fields: FieldsDescription);
    setInitialValues(componentState: ComponentState): void;
    validate(componentState: ComponentState): ValidateReturn;
    isFormValid(): boolean;
    insertArgs(args: InsertedArgs): this;
    showAllErrors(show?: boolean): void;
    private refreshState;
}
export default Validator;
