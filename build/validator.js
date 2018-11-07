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
        // errors object
        this.errors = {};
        // { rules, message } Objects
        this.validationDescription = fields;
        // { value, showError, statuses } Objects
        this.validationState = {};
        // if setInitialValues was called checkinng
        this.isInitValidationStateSet = false;
    }
    Validator.prototype.updateValidationStatuses = function (partialValidationState) {
        var _this = this;
        Object.keys(partialValidationState).forEach(function (fieldName) {
            var validatedStatuses = _this.validateField(partialValidationState[fieldName].value, _this.validationDescription[fieldName]);
            // Updating statuses
            partialValidationState[fieldName].statuses = validatedStatuses;
            // Updating errors
            _this.errors[fieldName] = _this.findFirstFailedRuleMessage(_this.validationDescription[fieldName], validatedStatuses);
        });
    };
    Validator.prototype.findFirstFailedRuleMessage = function (fieldDescripton, statuses) {
        return statuses.indexOf(false) === -1
            ? ''
            : fieldDescripton[statuses.indexOf(false)].message;
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
            // Initial errors object formation
            _this.errors[fieldName] = _this.validationDescription[fieldName][0].message;
            // Initial validation has been launched, so - flag = true
            _this.isInitValidationStateSet = true;
            // Initial validation state formation
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
        return { errors: this.errors };
    };
    return Validator;
}());
export default Validator;
