'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FieldsDescription = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _types = require('./types');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* eslint-disable */
var log = console.log;

/**
 * A class for fields validation in React.js
 * Use it in your React components for forms,
 * The form should work the classical way,
 * store fields in the local component state and modify fields using this.setState method
 * @author Chernenko Alexander <ca@nullgr.com>, <akazimirkas@gmail.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 */
//   fields: FormattedFieldsDescription;
//   fieldsToValidateList: Array<string>;
//   fieldsToShowErrors: Array<string>;
//   statuses: Array<string>;
//   validationStorage: Object;

function Validator(fields) {
  if ((typeof fields === 'undefined' ? 'undefined' : _typeof(fields)) !== 'object') {
    throw new Error('Invalid fields parameter for fields, must be object');
  }

  this.fields = this._convertAllRulesToArrays(fields);
  this.fieldsToValidateList = [];
  this.fieldsToShowErrors = [];
  this.validationStorage = undefined;
  this.statuses = ['validation-passed', 'prevalidation-failed', 'validation-failed'];
}

Validator.prototype = {
  addValidation: function addValidation(state) {
    var _this = this;

    var showErrorsOnStart = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if ((typeof state === 'undefined' ? 'undefined' : _typeof(state)) !== 'object') {
      throw new Error('Invalid state parameter for fields, must be object');
    }
    this.validationStorage = {};
    Object.keys(this.fields).map(function (key) {
      return _this.validationStorage[key] = _this._validateField(state[key], _this.fields[key], state, showErrorsOnStart);
    });

    return state;
  },

  /**
   * Validate is a method to use inside the setState function
   */
  validate: function validate(stateUpdates) {
    var _this2 = this;

    var showErrors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    this._checkIfValidationWasAdded();

    var showErrorsHash = {};
    var showChoosenErrors = false;
    var fieldsToValidateList = [];
    if (this.fieldsToValidateList.length > 0) {
      fieldsToValidateList = this.fieldsToValidateList;
      this.fieldsToValidateList = [];
    }

    if (this.fieldsToShowErrors.length > 0) {
      showChoosenErrors = true;
      this.fieldsToShowErrors.forEach(function (f) {
        return showErrorsHash[f] = true;
      });
      this.fieldsToShowErrors = [];
    }

    return function (prevState, props) {
      if (typeof stateUpdates === 'function') {
        // support of updater function
        stateUpdates = stateUpdates(prevState, props);
      }
      var keysToValidate = fieldsToValidateList.length > 0 ? fieldsToValidateList : stateUpdates ? Object.keys(stateUpdates) : Object.keys(_this2.fields);
      // computing the state as a merge from prevState and stateUpdates to do the right validation
      var state = Object.assign({}, prevState, stateUpdates || {});

      keysToValidate.map(function (key) {
        if (_this2.fields[key]) {
          _this2.validationStorage[key] = _this2._validateField(state[key], _this2.fields[key], prevState, showChoosenErrors ? showErrorsHash[key] : showErrors);
        }
      });
      _this2.fieldsToShowErrors = [];
      return Object.assign(stateUpdates || {});
    };
  },

  updateRules: function updateRules(updatedRules) {
    var _this3 = this;

    this._checkIfValidationWasAdded();

    Object.keys(updatedRules).map(function (k) {
      if (_this3.fields[k]) {
        var rulesToUpdate = Object.keys(updatedRules[k]);
        rulesToUpdate.forEach(function (ruleId) {
          var ruleIndex = -1;
          _this3.fields[k].forEach(function (f, i) {
            if (f.id && f.id === ruleId) {
              ruleIndex = i;
            }
          });
          if (ruleIndex !== -1) {
            _this3.fields[k][ruleIndex].rule = updatedRules[k][ruleId];
          }
        });
      }
    });

    return this;
  },

  fieldsToValidate: function fieldsToValidate(fieldsList) {
    this.fieldsToValidateList = [].concat(_toConsumableArray(fieldsList));
    return this;
  },

  showErrorsOnFields: function showErrorsOnFields(fieldsList) {
    this.fieldsToShowErrors = [].concat(_toConsumableArray(fieldsList));
    return this;
  },

  getErrors: function getErrors() {
    var _this4 = this;

    this._checkIfValidationWasAdded();

    var keys = Object.keys(this.fields),
        objErrors = {};

    var validationFailed = this.statuses[2];
    keys.map(function (key) {
      var current = _this4.validationStorage[key];
      // check every rule
      for (var i = 0; i < current.length; i++) {
        if (current[i] === validationFailed) {
          // always return the first failed rule error
          objErrors[key] = _this4.fields[key][i].message;
          return;
        }
      }
      objErrors[key] = '';
      return;
    });

    return objErrors;
  },

  isFormValid: function isFormValid() {
    this._checkIfValidationWasAdded();

    var keys = Object.keys(this.validationStorage);

    var _statuses = _slicedToArray(this.statuses, 1),
        validationPassed = _statuses[0];

    for (var i = 0; i < keys.length; i++) {
      var currentStatuses = this.validationStorage[keys[i]];
      for (var j = 0; j < currentStatuses.length; j++) {
        if (currentStatuses[j] !== validationPassed) {
          return false;
        }
      }
    }
    // if form valid return true
    return true;
  },

  isFieldValid: function isFieldValid(fieldName) {
    this._checkIfValidationWasAdded();

    var fieldStatuses = this.validationStorage[fieldName];
    if (!fieldStatuses) {
      return false;
    }

    var _statuses2 = _slicedToArray(this.statuses, 1),
        validationPassed = _statuses2[0];

    for (var j = 0; j < fieldStatuses.length; j++) {
      if (fieldStatuses[j] !== validationPassed) {
        return false;
      }
    }
    return true;
  },

  _convertAllRulesToArrays: function _convertAllRulesToArrays(fields) {
    var formattedFields = {};

    Object.keys(fields).forEach(function (field) {
      formattedFields[field] = Array.isArray(fields[field]) ? [].concat(_toConsumableArray(fields[field])) : [fields[field]];
    });
    return formattedFields;
  },

  _validateField: function _validateField(fieldValue, fieldRules, state, showErrors) {
    var _statuses3 = _slicedToArray(this.statuses, 3),
        validationPassed = _statuses3[0],
        prevalidationFailed = _statuses3[1],
        validationFailed = _statuses3[2];

    // validate every rule


    return fieldRules.map(function (item) {
      return item.rule(fieldValue, state) ? validationPassed : showErrors ? validationFailed : prevalidationFailed;
    });
  },

  _checkIfValidationWasAdded: function _checkIfValidationWasAdded() {
    if (typeof this.validationStorage === 'undefined') {
      throw new Error('It seems that you didn\'t invoke addValidation method and try to invoke \n          another method of Validator. Please invoke addValidation method first');
    }
  }
};

exports.default = Validator;
exports.FieldsDescription = _types.FieldsDescription;