import { Rule, RuleData, FieldsDescription, FormattedFieldsDescription } from './types';
/**
 * A class for fields validation in React.js
 * Use it in your React components for forms,
 * The form should work the classical way,
 * store fields in the local component state and modify fields using this.setState method
 * @author Chernenko Alexander <ca@nullgr.com>, <akazimirkas@gmail.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 */
declare class Validator {
    fields: FormattedFieldsDescription;
    fieldsToValidateList: Array<string>;
    fieldsToShowErrors: Array<string>;
    validationStorage?: object;
    statuses: Array<string>;
    constructor(fields: FieldsDescription);
    addValidation(state: Object, showErrorsOnStart?: boolean): Object;
    /**
     * Validate is a method to use inside the setState function
     */
    validate(stateUpdates: object | Function | null, showErrors?: boolean): (prevState: Object, props?: Object | null | undefined) => any;
    updateRules(updatedRules: {
        [key: string]: {
            [key: string]: Rule;
        };
    }): this;
    fieldsToValidate(fieldsList: Array<string>): this;
    showErrorsOnFields(fieldsList: Array<string>): this;
    getErrors(): Object;
    isFormValid(): boolean;
    isFieldValid(fieldName: string): boolean;
    _convertAllRulesToArrays(fields: FieldsDescription): FormattedFieldsDescription;
    _validateField(fieldValue: any, fieldRules: RuleData[], state: Object, showErrors: boolean): string | string[];
    _checkIfValidationWasAdded(): void;
}
export default Validator;
