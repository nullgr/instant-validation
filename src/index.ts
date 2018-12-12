import Validator from './validator';
import { FieldsDescription, ValidateReturn, InsertedArgs } from './types';

interface ValidationPublicApi<ComponentState> {
  setInitialValues(componentState: ComponentState): void;
  validate(componentState: ComponentState): ValidateReturn;
  isFormValid(): boolean;
  insertArgs(args: InsertedArgs): ValidationPublicApi<ComponentState>;
}

// Represents Public API of library, every method presented there
// may be used by user and should be described in README file
//
// Separating of Public Api and Validator gives next benefits:
//  1) User of library have access only to Public API but not to implementation details
//  2) At the same time inner details of Validator are easy testable
//  3) Also small benefit: in Validator we declare methods on prototype, but not on actual function -
//     this is useful for reducing of initial render time,
//     if project have a lot of forms(therefore a lot of instances of Validator object)

const ValidationPublicApi = (function<ComponentState>(
  this: ValidationPublicApi<ComponentState>,
  fields: FieldsDescription
) {
  const validator = new Validator<ComponentState>(fields);

  this.setInitialValues = function(componentState) {
    return validator.setInitialValues(componentState);
  };

  this.validate = function(componentState) {
    return validator.validate(componentState);
  };

  this.isFormValid = function() {
    return validator.isFormValid();
  };

  this.insertArgs = function(args) {
    return validator.insertArgs(args);
  };
} as any) as {
  new <ComponentState>(fields: FieldsDescription): ValidationPublicApi<ComponentState>;
};

export default ValidationPublicApi;
