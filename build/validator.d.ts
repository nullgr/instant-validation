import { FieldsDescription, Statuses, ShowErrorMessagesOn, ErrorMessages, FormattedFieldsDescription } from './types';
/**
 * A simle class for fields validation based on their state object (like in React.js local state)
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
