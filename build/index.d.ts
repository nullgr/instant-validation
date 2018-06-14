import { FieldsDescription, ErrorMessages, Statuses } from './types';
interface ValidationPublicApi<State> {
    setInitialValues: (state: State) => State;
    validate(state: State): ValidationPublicApi<State>;
    getErrors(): ErrorMessages;
    showErrors(fieldsNames?: Array<string>, show?: boolean): void;
    isFormValid(): boolean;
    getStatuses(forEveryRule?: boolean): Statuses;
}
declare const ValidationPublicApi: new <State>(fields: FieldsDescription) => ValidationPublicApi<State>;
export default ValidationPublicApi;
