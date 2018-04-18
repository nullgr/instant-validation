// @flow
import Validator from './validator';
import { Rule, FieldsDescription } from './types';

// Represents Public API of library, every method presented there
// may be used by user and should be described in README file
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
