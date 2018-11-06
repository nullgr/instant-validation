import { FieldsDescription, ValidateReturn } from './types';
interface ValidationPublicApi<State> {
    setInitialValues: (state: State) => State;
    validate(state: State): ValidateReturn;
}
declare const ValidationPublicApi: new <State>(fields: FieldsDescription) => ValidationPublicApi<State>;
export default ValidationPublicApi;
