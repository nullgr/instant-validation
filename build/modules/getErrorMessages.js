"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function findFirstFailedRuleMessage(fieldDescripton, statuses) {
    var searchIndex = statuses.indexOf(false);
    return searchIndex === -1 ? '' : fieldDescripton[searchIndex].message;
}
// TODO add tests here
function getErrorMessages(validationState, validationDescription) {
    var errors = {};
    Object.keys(validationState).forEach(function (fieldName) {
        errors[fieldName] = validationState[fieldName].showError
            ? findFirstFailedRuleMessage(validationDescription[fieldName], validationState[fieldName].statuses)
            : '';
    });
    return errors;
}
exports.getErrorMessages = getErrorMessages;
