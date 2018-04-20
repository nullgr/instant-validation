"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return _sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * A class for fields validation in React.js
 * Use it in your React components for forms,
 * The form should work the classical way,
 * store fields in the local component state and modify fields using this.setState method
 * @author Chernenko Alexander <ca@nullgr.com>, <akazimirkas@gmail.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 */
var Validator =
/*#__PURE__*/
function () {
  function Validator(fields) {
    _classCallCheck(this, Validator);

    if (_typeof(fields) !== 'object') {
      throw new Error('Invalid fields parameter for fields, must be object');
    }

    this.fields = this._convertAllRulesToArrays(fields);
    this.fieldsToValidateList = [];
    this.fieldsToShowErrors = [];
    this.validationStorage = undefined;
    this.statuses = ['validation-passed', 'prevalidation-failed', 'validation-failed'];
  }

  _createClass(Validator, [{
    key: "addValidation",
    value: function addValidation(state) {
      var _this = this;

      var showErrorsOnStart = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (_typeof(state) !== 'object') {
        throw new Error('Invalid state parameter for fields, must be object');
      }

      var validationStorage = this.validationStorage = {};
      Object.keys(this.fields).forEach(function (key) {
        validationStorage[key] = _this._validateField(state[key], _this.fields[key], state, showErrorsOnStart);
      });
      return state;
    }
  }, {
    key: "validate",

    /**
     * Validate is a method to use inside the setState function
     */
    value: function validate(stateUpdates) {
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

        var keysToValidate = fieldsToValidateList.length > 0 ? fieldsToValidateList : stateUpdates ? Object.keys(stateUpdates) : Object.keys(_this2.fields); // computing the state as a merge from prevState and stateUpdates to do the right validation

        var state = Object.assign({}, prevState, stateUpdates || {});
        keysToValidate.forEach(function (key) {
          if (_this2.fields[key] && _this2.validationStorage) {
            _this2.validationStorage[key] = _this2._validateField(state[key], _this2.fields[key], prevState, showChoosenErrors ? showErrorsHash[key] : showErrors);
          }
        });
        _this2.fieldsToShowErrors = [];
        return Object.assign(stateUpdates || {});
      };
    }
  }, {
    key: "updateRules",
    value: function updateRules(updatedRules) {
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
    }
  }, {
    key: "fieldsToValidate",
    value: function fieldsToValidate(fieldsList) {
      this.fieldsToValidateList = [].concat(_toConsumableArray(fieldsList));
      return this;
    }
  }, {
    key: "showErrorsOnFields",
    value: function showErrorsOnFields(fieldsList) {
      this.fieldsToShowErrors = [].concat(_toConsumableArray(fieldsList));
      return this;
    }
  }, {
    key: "getErrors",
    value: function getErrors() {
      var _this4 = this;

      this._checkIfValidationWasAdded();

      var keys = Object.keys(this.fields),
          objErrors = {};
      var validationFailed = this.statuses[2];
      keys.forEach(function (key) {
        if (!_this4.validationStorage) return;
        var current = _this4.validationStorage[key]; // check every rule

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
    }
  }, {
    key: "isFormValid",
    value: function isFormValid() {
      this._checkIfValidationWasAdded();

      if (!this.validationStorage) return false;
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
      } // if form valid return true


      return true;
    }
  }, {
    key: "isFieldValid",
    value: function isFieldValid(fieldName) {
      this._checkIfValidationWasAdded();

      if (!this.validationStorage) return false;
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
    }
  }, {
    key: "_convertAllRulesToArrays",
    value: function _convertAllRulesToArrays(fields) {
      var formattedFields = {};
      Object.keys(fields).forEach(function (field) {
        formattedFields[field] = Array.isArray(fields[field]) // @ts-ignore
        ? [].concat(_toConsumableArray(fields[field])) : [fields[field]];
      });
      return formattedFields;
    }
  }, {
    key: "_validateField",
    value: function _validateField(fieldValue, fieldRules, state, showErrors) {
      var _statuses3 = _slicedToArray(this.statuses, 3),
          validationPassed = _statuses3[0],
          prevalidationFailed = _statuses3[1],
          validationFailed = _statuses3[2]; // validate every rule


      return fieldRules.map(function (item) {
        return item.rule(fieldValue, state) ? validationPassed : showErrors ? validationFailed : prevalidationFailed;
      });
    }
  }, {
    key: "_checkIfValidationWasAdded",
    value: function _checkIfValidationWasAdded() {
      if (typeof this.validationStorage === 'undefined') {
        throw new Error("It seems that you didn't invoke addValidation method and try to invoke \n          another method of Validator. Please invoke addValidation method first");
      }
    }
  }]);

  return Validator;
}();

;
var _default = Validator;
exports.default = _default;