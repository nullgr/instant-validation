'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A simple class for fields validation in React.js
 * Use it in your React components for forms,
 * The form should work the classical way, store fields in the local component state and modify fields using this.setState method
 * @author Chernenko Alexander <ca@nullgr.com>, <akazimirkas@gmail.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 * @example
 * const Validator = new Validation({
 *   login: {
 *     rule: value => value.length >= 5,
 *     message: 'Login should contain at least 5 characters'
 *   },
 *   password: [
 *     {
 *       rule: charactersRule,
 *       message: 'Invalid characters in password'
 *     }
 *     {
 *       rule: value => value.length >= 5,
 *       message: 'Password should contain at least 5 characters'
 *     }
 *  ]
 * });
 */


/**
 * FieldsDescription type for using it in constructor
 * you can use both, object or array of objects with RuleData
 */

/**
 * Validation rule type for one field
 * @example rule: val => val.length > 4
 * state is the optional parameter, you can use it, if you need to compare with field from your component state
 * @example rule: (paymentSumm, state) => state.billAmount >= paymentSumm
 */
var Validation = function () {
  function Validation(fields) {
    var errorsStorageName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'validationStorage';

    _classCallCheck(this, Validation);

    if ((typeof fields === 'undefined' ? 'undefined' : _typeof(fields)) !== 'object') {
      throw new Error('Invalid fields parameter for fields, must be object');
    }

    this.fields = allRulesInArrays(fields);
    this.fieldsToValidateList = [];
    this.fieldsToShowErrors = [];
    this.storage = errorsStorageName;
    this.statuses = ['validation-passed', 'prevalidation-failed', 'validation-failed'];
  }

  _createClass(Validation, [{
    key: '_validateField',
    value: function _validateField(fieldValue, fieldRules, state, showErrors) {
      var _statuses = _slicedToArray(this.statuses, 3),
          validationPassed = _statuses[0],
          prevalidationFailed = _statuses[1],
          validationFailed = _statuses[2];

      // validate every rule


      return fieldRules.map(function (item) {
        return item.rule(fieldValue, state) ? validationPassed : showErrors ? validationFailed : prevalidationFailed;
      });
    }
  }, {
    key: 'addValidation',
    value: function addValidation(state) {
      var _this = this;

      var showErrorsOnStart = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if ((typeof state === 'undefined' ? 'undefined' : _typeof(state)) !== 'object') {
        throw new Error('Invalid state parameter for fields, must be object');
      }

      var toStorage = {};

      Object.keys(this.fields).map(function (key) {
        return toStorage[key] = _this._validateField(state[key], _this.fields[key], state, showErrorsOnStart);
      });

      return Object.assign(state, _defineProperty({}, this.storage, toStorage));
    }

    /**
     * Validate is a method to use inside the setState function
     * You can simply validate all fields at the same time
     * @example
     * this.setState(Validator.validate())
     * Or Validator can check ONLY the fields, whose keys are passed to the setState
     * @example
     * this.setState(
     *   Validator.validate({ login: value })
     * )
     * If you want to manually set fields for validation, you can use fieldsToValidate method BEFORE the validate method
     * in that case, values for other fields will be taken from unupdated component state
     * @example
     * this.setState(
     *   Validator
     *    .fieldsToValidate(['newPassword', 'repeatPassword'])
     *    .validate({ newPassword: e.target.value })
     * )
     * If you want to dynamically update the rule, you can do this with updateRules method, using setting the rule by its id
     * @example
     * this.setState(
     *   Validator
     *    .updateRules({
     *       repeatPassword: {
     *         repeatRule: repeatPassword => repeatPassword === e.target.value
     *       },
     *     })
     *    .fieldsToValidate(['newPassword', 'repeatPassword'])
     *    .validate({ newPassword: e.target.value })
     * )
     */

  }, {
    key: 'validate',
    value: function validate(stateUpdates) {
      var _this2 = this;

      var showErrors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var showErrorsHash = {};
      var showChoosenErrors = false;
      var keysToValidate = this.fieldsToValidateList.length > 0 ? this.fieldsToValidateList : stateUpdates ? Object.keys(stateUpdates) : Object.keys(this.fields);
      if (this.fieldsToValidateList.length > 0) {
        this.fieldsToValidateList = [];
      }

      if (this.fieldsToShowErrors.length > 0) {
        showChoosenErrors = true;
        this.fieldsToShowErrors.forEach(function (f) {
          return showErrorsHash[f] = true;
        });
        this.fieldsToShowErrors = [];
      }

      return function (prevState) {
        var toStorage = {};
        // computing the state as a merge from prevState and stateUpdates to do the right validation
        var state = Object.assign({}, prevState, stateUpdates || {});
        // clean the service error storage field, so the rule will have no acces to it
        delete state[_this2.storage];
        keysToValidate.map(function (key) {
          if (_this2.fields[key]) {
            toStorage[key] = _this2._validateField(state[key], _this2.fields[key], prevState, showChoosenErrors ? showErrorsHash[key] : showErrors);
          }
        });
        _this2.fieldsToShowErrors = [];
        return Object.assign(stateUpdates || {}, _defineProperty({}, _this2.storage, Object.assign({}, prevState[_this2.storage], toStorage)));
      };
    }
  }, {
    key: 'updateRules',
    value: function updateRules(updatedRules) {
      var _this3 = this;

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
    key: 'fieldsToValidate',
    value: function fieldsToValidate(fieldsList) {
      this.fieldsToValidateList = [].concat(_toConsumableArray(fieldsList));
      return this;
    }
  }, {
    key: 'showErrorsOnFields',
    value: function showErrorsOnFields(fieldsList) {
      this.fieldsToShowErrors = [].concat(_toConsumableArray(fieldsList));
      return this;
    }
  }, {
    key: 'getErrors',
    value: function getErrors(state) {
      var _this4 = this;

      var keys = Object.keys(this.fields),
          objErrors = {};

      var validationFailed = this.statuses[2];

      keys.map(function (key) {
        var current = state[_this4.storage][key];
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
    }
  }, {
    key: 'isFormValid',
    value: function isFormValid(state) {
      var errors = state[this.storage];
      if ((typeof errors === 'undefined' ? 'undefined' : _typeof(errors)) !== 'object') {
        throw new Error('Invalid errors parameter for fields, must be object');
      }

      var keys = Object.keys(errors);

      var _statuses2 = _slicedToArray(this.statuses, 1),
          validationPassed = _statuses2[0];

      for (var i = 0; i < keys.length; i++) {
        var currentStatuses = errors[keys[i]];
        for (var j = 0; j < currentStatuses.length; j++) {
          if (currentStatuses[j] !== validationPassed) {
            return false;
          }
        }
      }
      // if form valid return true
      return true;
    }
  }]);

  return Validation;
}();

/**
 * FieldsDescription type for using it in under the hood, each ruleData is 100% an array
 */


var allRulesInArrays = function allRulesInArrays(fields) {
  var formattedFields = {};

  Object.keys(fields).forEach(function (field) {
    formattedFields[field] = Array.isArray(fields[field]) ? [].concat(_toConsumableArray(fields[field])) : [fields[field]];
  });
  return formattedFields;
};

exports.default = Validation;