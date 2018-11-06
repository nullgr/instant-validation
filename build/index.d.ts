import { FieldsDescription } from './types';
interface ValidationPublicApi<State> {
    setInitialValues: (state: State) => State;
    validate(state: State): ValidationPublicApi<State>;
}
declare const ValidationPublicApi: new <State>(fields: FieldsDescription) => ValidationPublicApi<State>;
export default ValidationPublicApi;
