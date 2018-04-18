// @flow
import Validator from './validator';
import type { Rule, FieldsDescription } from './types';

// Represents Public API of library, every method presented there
// may be used by user and should be described in README file
//
// Separating of Public Api and Validator gives next benefits:
//  1) User of library have access only to Public API but not to implementation details
//  2) At the same time inner details of Validator are easy testable
//  3) Also small benefit: in Validator we declare methods on prototype, but not on actual function -
//     this is useful for reducing of initial render time,
//     if project have a lot of forms(therefore a lot of instances of Validator object)
function ValidationPublicApi(fields: FieldsDescription) {
  const validator = new Validator(fields);

  this.addValidation = function(state: Object) {
    return validator.addValidation(state);
  };

  this.validate = function(
    stateUpdates: ?Object | Function,
    showErrors: boolean = true
  ) {
    return validator.validate(stateUpdates, showErrors);
  };

  this.updateRules = function(updatedRules: {
    [key: string]: { [key: string]: Rule }
  }) {
    return validator.updateRules(updatedRules);
  };

  this.fieldsToValidate = function(fieldsList: Array<string>) {
    return validator.fieldsToValidate(fieldsList);
  };

  this.showErrorsOnFields = function(fieldsList: Array<string>) {
    return validator.showErrorsOnFields(fieldsList);
  };

  this.getErrors = function() {
    return validator.getErrors();
  };

  this.isFormValid = function(): boolean {
    return validator.isFormValid();
  };

  this.isFieldValid = function(fieldName: string): boolean {
    return validator.isFieldValid(fieldName);
  };
}
export default ValidationPublicApi;
