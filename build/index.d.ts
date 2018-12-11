import { FieldsDescription, ValidateReturn } from './types';
interface ValidationPublicApi<ComponentState> {
    setInitialValues(componentState: ComponentState): void;
    validate(componentState: ComponentState): ValidateReturn;
    isFormValid(): boolean;
}
declare const ValidationPublicApi: new <ComponentState>(fields: FieldsDescription) => ValidationPublicApi<ComponentState>;
export default ValidationPublicApi;
