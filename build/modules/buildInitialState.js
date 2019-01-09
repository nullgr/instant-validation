"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validateFieldsByDiff_1 = require("./validateFieldsByDiff");
function buildInitialState(componentState, validationDescription, insertedArgs, ruleIdsInFields) {
    var initialDiff = {};
    var initialState = {};
    Object.keys(validationDescription).forEach(function (fieldName) {
        if (typeof componentState[fieldName] === 'undefined') {
            throw new Error("It seems that you didn't passed a field '" + fieldName + "' value");
        }
        initialDiff[fieldName] = componentState[fieldName];
        initialState[fieldName] = {
            value: componentState[fieldName],
            showError: false,
            statuses: []
        };
    });
    return validateFieldsByDiff_1.validateFieldsByDiff(initialDiff, initialState, validationDescription, false, insertedArgs, ruleIdsInFields);
}
exports.buildInitialState = buildInitialState;
