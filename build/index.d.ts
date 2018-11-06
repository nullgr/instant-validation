import { FieldsDescription, ValidatorReturn } from './types';
interface ValidationPublicApi<State> {
    setInitialValues: (state: State) => State;
    validate(state: State): ValidatorReturn;
}
declare const ValidationPublicApi: new <State>(fields: FieldsDescription) => ValidationPublicApi<State>;
export default ValidationPublicApi;
