import { FieldsDescription, ValidateReturn, InsertedArgs } from './types';
interface ValidationPublicApi<ComponentState> {
    setInitialValues(componentState: ComponentState): void;
    validate(componentState: ComponentState): ValidateReturn;
    isFormValid(): boolean;
    insertArgs(args: InsertedArgs): ValidationPublicApi<ComponentState>;
}
declare const ValidationPublicApi: new <ComponentState>(fields: FieldsDescription) => ValidationPublicApi<ComponentState>;
export default ValidationPublicApi;
