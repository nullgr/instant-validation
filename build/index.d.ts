import { FieldsDescription, InsertedArgs, ValidateReturn } from './types';
interface ValidationPublicApi<ComponentState> {
    setInitialValues(componentState: ComponentState): void;
    validate(componentState: ComponentState): ValidateReturn;
    isFormValid(): boolean;
    insertArgs(args: InsertedArgs): ValidationPublicApi<ComponentState>;
    showAllErrors(show?: boolean): void;
}
declare const ValidationPublicApi: new <ComponentState>(fields: FieldsDescription) => ValidationPublicApi<ComponentState>;
export default ValidationPublicApi;
