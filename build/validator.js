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
        // TODO if setInitialValues was called checkinng
        this.isInitValidationStateSet = false;
    }
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
    Validator.prototype.countDiff = function (state) {
        var _this = this;
        var diff = {};
        Object.keys(this.validationState).forEach(function (fieldName) {
            // TODO: take out condition out of the method
            if (typeof state[fieldName] === 'undefined' ||
                state[fieldName] === _this.validationState[fieldName].value) {
                return;
            }
            diff[fieldName] = {
                value: state[fieldName],
                showError: true,
                statuses: _this.validationState[fieldName].statuses
            };
        });
        console.log(diff);
        return diff;
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
            var changedField = this.countDiff(state);
            if (Object.keys(changedField).length !== 0) {
                // TODO something because of line sequence
                this.validationState = Object.assign({}, this.validationState, changedField);
                this.updateValidationStatuses(changedField);
            }
        }
        return state;
    };
    return Validator;
}());
export default Validator;
