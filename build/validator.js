var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { findDifference } from './modules';
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
        // { rules, message } Objects
        this.validationDescription = fields;
        // { value, showError, statuses } Objects
        this.validationState = {};
        // if setInitialValues was called checkinng
        this.isInitValidationStateSet = false;
    }
    Validator.prototype.getErrors = function () {
        var _this = this;
        var fieldNames = Object.keys(this.validationState);
        var errorMessages = {};
        fieldNames.forEach(function (fieldName) {
            var statuses = _this.validationState[fieldName].statuses;
            var showError = _this.validationState[fieldName].showError;
            // check every rule
            for (var i = 0; i < statuses.length; i++) {
                if (!statuses[i] && showError) {
                    // always return the first failed rule error
                    errorMessages[fieldName] = _this.validationDescription[fieldName][i].message;
                    return;
                }
            }
            errorMessages[fieldName] = '';
            return;
        });
        return errorMessages;
    };
    Validator.prototype.updateValidationStatuses = function (fieldObj) {
        var _this = this;
        Object.keys(fieldObj).forEach(function (fieldName) {
            fieldObj[fieldName].statuses = _this.validateField(fieldObj[fieldName].value, _this.validationDescription[fieldName]);
        });
        console.log(this.validationState);
    };
    Validator.prototype.validateField = function (fieldValue, fieldRules) {
        return fieldRules.map(function (item) {
            return item.rule(fieldValue);
        });
    };
    Validator.prototype.setInitialValues = function (state) {
        var _this = this;
        Object.keys(this.validationDescription).forEach(function (fieldName) {
            if (typeof state[fieldName] === 'undefined') {
                throw new Error("It seems that you didn't passed a field '" + fieldName + "' value");
            }
            _this.isInitValidationStateSet = true;
            _this.validationState[fieldName] = {
                value: state[fieldName],
                showError: false,
                statuses: _this.validationDescription[fieldName].map(function (rule) { return false; })
            };
        });
        this.updateValidationStatuses(this.validationState);
        return state;
    };
    Validator.prototype.validate = function (state) {
        if (!this.isInitValidationStateSet) {
            this.setInitialValues(state);
        }
        else {
            var changedField = findDifference(state, this.validationState);
            if (Object.keys(changedField).length !== 0) {
                // TODO something because of sequence of two control constructures below
                this.validationState = __assign({}, this.validationState, changedField);
                this.updateValidationStatuses(changedField);
            }
        }
        return { errors: this.getErrors() };
    };
    return Validator;
}());
export default Validator;
