'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _validator = require('./validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Represents Public API of library, every method presented there
// may be used by user and should be described in README file
//
// Separating of Public Api and Validator gives next benefits:
//  1) User of library have access only to Public API but not to implementation details
//  2) At the same time inner details of Validator are easy testable
//  3) Also small benefit: in Validator we declare methods on prototype, but not on actual function -
//     this is useful for reducing of initial render time,
//     if project have a lot of forms(therefore a lot of instances of Validator object)
function ValidationPublicApi(fields) {
  var validator = new _validator2.default(fields);

  this.addValidation = function (state) {
    return validator.addValidation(state);
  };

  this.validate = function (stateUpdates) {
    var showErrors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    return validator.validate(stateUpdates, showErrors);
  };

  this.updateRules = function (updatedRules) {
    return validator.updateRules(updatedRules);
  };

  this.fieldsToValidate = function (fieldsList) {
    return validator.fieldsToValidate(fieldsList);
  };

  this.showErrorsOnFields = function (fieldsList) {
    return validator.showErrorsOnFields(fieldsList);
  };

  this.getErrors = function () {
    return validator.getErrors();
  };

  this.isFormValid = function () {
    return validator.isFormValid();
  };

  this.isFieldValid = function (fieldName) {
    return validator.isFieldValid(fieldName);
  };
}
exports.default = ValidationPublicApi;