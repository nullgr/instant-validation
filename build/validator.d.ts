import { FieldsDescription, Statuses, ShowErrorMessagesOn, ErrorMessages, FormattedFieldsDescription } from './types';
/**
 * A class for fields validation in React.js
 * Use it in your React components for forms,
 * The form should work the classical way,
 * store fields in the local component state and modify fields using this.setState method
 * @author Chernenko Alexander <ca@nullgr.com>, <akazimirkas@gmail.com>
 * @author Yurii Fediv <y.fediv@nullgr.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 */
declare class Validator<State> {
    fields: FormattedFieldsDescription;
    values: Partial<State>;
    valuesAreSet: boolean;
    statuses: Statuses;
    showErrorMessagesOn: ShowErrorMessagesOn;
    fieldsToValidateList: Array<string>;
    constructor(fields: FieldsDescription);
    private convertAllRulesToArrays(fields);
    private updateValidationStatuses(updatedValues);
    private validateField(fieldValue, fieldRules);
    private countDiff(state);
    setInitialValues(state: State): State;
    validate(state: State): State;
    getStatuses(forEveryRule?: boolean): Statuses;
    getErrors(): ErrorMessages;
    showErrors(fieldsNames?: Array<string>, show?: boolean): void;
    isFormValid(): boolean;
}
export default Validator;
