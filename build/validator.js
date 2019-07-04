"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var modules_1 = require("./modules");
/**
 * Quck setup. No Dependencies. Framework agnostic validation tool
 * It was created based on react-validation-tools library,
 * Thanks to ideas and participating from
 * @author Chernenko Alexander <ca@nullgr.com>, <akazimirkas@gmail.com>
 * @author Yurii Fediv <y.fediv@nullgr.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 * @author Igor Ivanov <i.ivanov@nullgr.com>
 */
var Validator = /** @class */ (function () {
    function Validator(fields) {
        if (typeof fields !== 'object') {
            throw new Error('Invalid fields parameter for fields, must be object');
        }
        this.validationDescription = fields;
        this.ruleIdsInFields = modules_1.getRuleIdsInFields(fields);
        this.validationState = {};
        this.isInitValidationStateSet = false;
        this.insertedArgs = {};
    }
    Validator.prototype.setInitialValues = function (componentState) {
        if (this.isInitValidationStateSet) {
            return;
        }
        this.isInitValidationStateSet = true;
        this.refreshState(modules_1.buildInitialState(componentState, this.validationDescription, this.insertedArgs, this.ruleIdsInFields));
    };
    Validator.prototype.validate = function (componentState) {
        if (!this.isInitValidationStateSet) {
            this.setInitialValues(componentState);
            var initialState_1 = this.validationState;
            return {
                errors: modules_1.getErrorMessages(initialState_1, this.validationDescription),
                get fields() { return modules_1.getFieldsData(initialState_1); }
            };
        }
        var diff = modules_1.findDifference(componentState, this.validationState);
        if (Object.keys(diff).length > 0) {
            this.refreshState(modules_1.validateFieldsByDiff(diff, this.validationState, this.validationDescription, true, this.insertedArgs, this.ruleIdsInFields));
        }
        var updatedState = this.validationState;
        return {
            errors: modules_1.getErrorMessages(updatedState, this.validationDescription),
            get fields() { console.log('ME FIRED'); return modules_1.getFieldsData(updatedState); }
        };
    };
    Validator.prototype.isFormValid = function () {
        return modules_1.isStateValid(this.validationState);
    };
    Validator.prototype.insertArgs = function (args) {
        this.insertedArgs = args;
        return this;
    };
    Validator.prototype.showAllErrors = function (show) {
        if (show === void 0) { show = true; }
        this.refreshState(modules_1.showAllErrors(this.validationState, show));
    };
    Validator.prototype.refreshState = function (validationState) {
        this.validationState = validationState;
    };
    return Validator;
}());
exports.default = Validator;
