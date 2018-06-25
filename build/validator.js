/**
 * A simle class for fields validation based on their state object (like in React.js local state)
 * @author Chernenko Alexander <ca@nullgr.com>, <akazimirkas@gmail.com>
 * @author Yurii Fediv <y.fediv@nullgr.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 */
var Validator = /** @class */ (function () {
    function Validator(fields) {
        if (typeof fields !== 'object') {
            throw new Error('Invalid fields parameter for fields, must be object');
        }
        this.fields = this.convertAllRulesToArrays(fields);
        this.values = {};
        // TODO add if setInitialValues was called checkinng
        this.valuesAreSet = false;
        this.statuses = {};
        this.showErrorMessagesOn = {};
    }
    ;
    Validator.prototype.convertAllRulesToArrays = function (fields) {
        var formattedFields = {};
        Object.keys(fields).forEach(function (field) {
            formattedFields[field] = Array.isArray(fields[field])
                // @ts-ignore
                ? fields[field].slice() : [fields[field]];
        });
        return formattedFields;
    };
    ;
    Validator.prototype.updateValidationStatuses = function (updatedValues) {
        var _this = this;
        Object.keys(updatedValues).forEach(function (key) {
            _this.statuses[key] = _this.validateField(updatedValues[key], _this.fields[key]);
        });
    };
    Validator.prototype.validateField = function (fieldValue, fieldRules) {
        return fieldRules.map(function (item) {
            return item.rule(fieldValue);
        });
    };
    ;
    Validator.prototype.countDiff = function (state) {
        var _this = this;
        var diff = {};
        Object.keys(this.values).forEach(function (fieldName) {
            if (typeof state[fieldName] !== 'undefined' && state[fieldName] !== _this.values[fieldName]) {
                diff[fieldName] = state[fieldName];
                _this.showErrorMessagesOn[fieldName] = true;
            }
        });
        return diff;
    };
    Validator.prototype.setInitialValues = function (state) {
        var _this = this;
        Object.keys(this.fields).forEach(function (fieldName) {
            if (typeof state[fieldName] !== 'undefined') {
                _this.values[fieldName] = state[fieldName];
                _this.showErrorMessagesOn[fieldName] = false;
            }
            else {
                throw new Error("It seems that you didn't passed a field " + fieldName + " value");
            }
        });
        this.valuesAreSet = true;
        this.updateValidationStatuses(this.values);
        return state;
    };
    Validator.prototype.validate = function (state) {
        var diff = this.countDiff(state);
        this.values = Object.assign({}, this.values, diff);
        this.updateValidationStatuses(diff);
        return state;
    };
    Validator.prototype.getStatuses = function (forEveryRule) {
        var _this = this;
        if (forEveryRule === void 0) { forEveryRule = false; }
        if (forEveryRule) {
            return this.statuses;
        }
        var keys = Object.keys(this.statuses);
        var res = {};
        keys.forEach(function (fieldName) {
            var current = _this.statuses[fieldName];
            // check every rule
            for (var i = 0; i < current.length; i++) {
                if (!current[i]) {
                    // always return the first failed rule error
                    res[fieldName] = false;
                    return;
                }
            }
            res[fieldName] = true;
            return;
        });
        return res;
    };
    Validator.prototype.getErrors = function () {
        var _this = this;
        var keys = Object.keys(this.statuses);
        var errorMessages = {};
        keys.forEach(function (fieldName) {
            var current = _this.statuses[fieldName];
            // check every rule
            for (var i = 0; i < current.length; i++) {
                if (!current[i] && _this.showErrorMessagesOn[fieldName]) {
                    // always return the first failed rule error
                    errorMessages[fieldName] = _this.fields[fieldName][i].message;
                    return;
                }
            }
            errorMessages[fieldName] = '';
            return;
        });
        return errorMessages;
    };
    ;
    Validator.prototype.showErrors = function (fieldsNames, show) {
        var _this = this;
        if (show === void 0) { show = true; }
        if (!fieldsNames) {
            fieldsNames = Object.keys(this.showErrorMessagesOn);
        }
        fieldsNames.forEach(function (fieldName) {
            _this.showErrorMessagesOn[fieldName] = show;
        });
    };
    Validator.prototype.isFormValid = function () {
        var keys = Object.keys(this.statuses);
        for (var i = 0; i < keys.length; i++) {
            var currentStatuses = this.statuses[keys[i]];
            for (var j = 0; j < currentStatuses.length; j++) {
                if (!currentStatuses[j]) {
                    return false;
                }
            }
        }
        // if form valid return true
        return true;
    };
    ;
    return Validator;
}());
;
export default Validator;
