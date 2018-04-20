/**
 * A class for fields validation in React.js
 * Use it in your React components for forms,
 * The form should work the classical way,
 * store fields in the local component state and modify fields using this.setState method
 * @author Chernenko Alexander <ca@nullgr.com>, <akazimirkas@gmail.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 */
var Validator = /** @class */ (function () {
    function Validator(fields) {
        if (typeof fields !== 'object') {
            throw new Error('Invalid fields parameter for fields, must be object');
        }
        this.fields = this._convertAllRulesToArrays(fields);
        this.fieldsToValidateList = [];
        this.fieldsToShowErrors = [];
        this.validationStorage = undefined;
        this.statuses = [
            'validation-passed',
            'prevalidation-failed',
            'validation-failed'
        ];
    }
    ;
    Validator.prototype.addValidation = function (state, showErrorsOnStart) {
        var _this = this;
        if (showErrorsOnStart === void 0) { showErrorsOnStart = false; }
        if (typeof state !== 'object') {
            throw new Error('Invalid state parameter for fields, must be object');
        }
        var validationStorage = this.validationStorage = {};
        Object.keys(this.fields).forEach(function (key) {
            validationStorage[key] = _this._validateField(state[key], _this.fields[key], state, showErrorsOnStart);
        });
        return state;
    };
    ;
    /**
     * Validate is a method to use inside the setState function
     */
    Validator.prototype.validate = function (stateUpdates, showErrors) {
        var _this = this;
        if (showErrors === void 0) { showErrors = true; }
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
            this.fieldsToShowErrors.forEach(function (f) { return (showErrorsHash[f] = true); });
            this.fieldsToShowErrors = [];
        }
        return function (prevState, props) {
            if (typeof stateUpdates === 'function') {
                // support of updater function
                stateUpdates = stateUpdates(prevState, props);
            }
            var keysToValidate = fieldsToValidateList.length > 0
                ? fieldsToValidateList
                : stateUpdates
                    ? Object.keys(stateUpdates)
                    : Object.keys(_this.fields);
            // computing the state as a merge from prevState and stateUpdates to do the right validation
            var state = Object.assign({}, prevState, stateUpdates || {});
            keysToValidate.forEach(function (key) {
                if (_this.fields[key] && _this.validationStorage) {
                    _this.validationStorage[key] = _this._validateField(state[key], _this.fields[key], prevState, showChoosenErrors ? showErrorsHash[key] : showErrors);
                }
            });
            _this.fieldsToShowErrors = [];
            return Object.assign(stateUpdates || {});
        };
    };
    ;
    Validator.prototype.updateRules = function (updatedRules) {
        var _this = this;
        this._checkIfValidationWasAdded();
        Object.keys(updatedRules).map(function (k) {
            if (_this.fields[k]) {
                var rulesToUpdate = Object.keys(updatedRules[k]);
                rulesToUpdate.forEach(function (ruleId) {
                    var ruleIndex = -1;
                    _this.fields[k].forEach(function (f, i) {
                        if (f.id && f.id === ruleId) {
                            ruleIndex = i;
                        }
                    });
                    if (ruleIndex !== -1) {
                        _this.fields[k][ruleIndex].rule = updatedRules[k][ruleId];
                    }
                });
            }
        });
        return this;
    };
    ;
    Validator.prototype.fieldsToValidate = function (fieldsList) {
        this.fieldsToValidateList = fieldsList.slice();
        return this;
    };
    ;
    Validator.prototype.showErrorsOnFields = function (fieldsList) {
        this.fieldsToShowErrors = fieldsList.slice();
        return this;
    };
    ;
    Validator.prototype.getErrors = function () {
        var _this = this;
        this._checkIfValidationWasAdded();
        var keys = Object.keys(this.fields), objErrors = {};
        var validationFailed = this.statuses[2];
        keys.forEach(function (key) {
            if (!_this.validationStorage)
                return;
            var current = _this.validationStorage[key];
            // check every rule
            for (var i = 0; i < current.length; i++) {
                if (current[i] === validationFailed) {
                    // always return the first failed rule error
                    objErrors[key] = _this.fields[key][i].message;
                    return;
                }
            }
            objErrors[key] = '';
            return;
        });
        return objErrors;
    };
    ;
    Validator.prototype.isFormValid = function () {
        this._checkIfValidationWasAdded();
        if (!this.validationStorage)
            return false;
        var keys = Object.keys(this.validationStorage);
        var validationPassed = this.statuses[0];
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
    };
    ;
    Validator.prototype.isFieldValid = function (fieldName) {
        this._checkIfValidationWasAdded();
        if (!this.validationStorage)
            return false;
        var fieldStatuses = this.validationStorage[fieldName];
        if (!fieldStatuses) {
            return false;
        }
        var validationPassed = this.statuses[0];
        for (var j = 0; j < fieldStatuses.length; j++) {
            if (fieldStatuses[j] !== validationPassed) {
                return false;
            }
        }
        return true;
    };
    ;
    Validator.prototype._convertAllRulesToArrays = function (fields) {
        var formattedFields = {};
        Object.keys(fields).forEach(function (field) {
            formattedFields[field] = Array.isArray(fields[field])
                // @ts-ignore
                ? fields[field].slice() : [fields[field]];
        });
        return formattedFields;
    };
    ;
    Validator.prototype._validateField = function (fieldValue, fieldRules, state, showErrors) {
        var _a = this.statuses, validationPassed = _a[0], prevalidationFailed = _a[1], validationFailed = _a[2];
        // validate every rule
        return fieldRules.map(function (item) {
            return item.rule(fieldValue, state)
                ? validationPassed
                : showErrors
                    ? validationFailed
                    : prevalidationFailed;
        });
    };
    ;
    Validator.prototype._checkIfValidationWasAdded = function () {
        if (typeof this.validationStorage === 'undefined') {
            throw new Error("It seems that you didn't invoke addValidation method and try to invoke \n          another method of Validator. Please invoke addValidation method first");
        }
    };
    return Validator;
}());
;
export default Validator;
