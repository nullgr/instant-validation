"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
            return {
                errors: modules_1.getErrorMessages(this.validationState, this.validationDescription)
            };
        }
        var diff = modules_1.findDifference(componentState, this.validationState);
        if (Object.keys(diff).length > 0) {
            this.refreshState(modules_1.validateFieldsByDiff(diff, this.validationState, this.validationDescription, true, this.insertedArgs, this.ruleIdsInFields));
        }
        return {
            errors: modules_1.getErrorMessages(this.validationState, this.validationDescription)
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
    Validator.prototype.getFieldsState = function () {
        var _this = this;
        // TODO add tests and extract this method and add README desctiption and example for it
        var result = {};
        Object.keys(this.validationState).forEach(function (key) {
            result[key] = __assign({}, _this.validationState[key], { valid: _this.validationState[key].statuses.filter(function (status) { return !status; }).length === 0 });
        });
        return result;
    };
    Validator.prototype.refreshState = function (validationState) {
        this.validationState = validationState;
    };
    return Validator;
}());
exports.default = Validator;
