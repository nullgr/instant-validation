"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var validateField_1 = require("./validateField");
function validateFieldsByDiff(newDiff, oldValidationState, validationDescription, touched, insertedArgs, ruleIdsInFields) {
    // validate fields by diff
    var newValidationState = Object.keys(newDiff).reduce(function (acc, fieldName) {
        var validatedStatuses = validateField_1.validateField(newDiff[fieldName], validationDescription[fieldName], insertedArgs);
        acc[fieldName] = {
            showError: touched,
            value: newDiff[fieldName],
            statuses: validatedStatuses,
            touched: touched
        };
        return acc;
    }, __assign({}, oldValidationState));
    // validate fields, that uses additional arguments
    Object.keys(insertedArgs).forEach(function (arg) {
        if (!ruleIdsInFields[arg]) {
            return;
        }
        ruleIdsInFields[arg].forEach(function (field) {
            if (newDiff[field]) {
                return;
            }
            var validatedStatuses = validateField_1.validateField(newValidationState[field].value, validationDescription[field], insertedArgs);
            newValidationState[field] = __assign({}, newValidationState[field], { statuses: validatedStatuses });
        });
    });
    return newValidationState;
}
exports.validateFieldsByDiff = validateFieldsByDiff;
