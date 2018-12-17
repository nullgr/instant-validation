var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { validateField } from './validateField';
function validateFieldsByDiff(newDiff, oldValidationState, validationDescription, showErrors, insertedArgs, ruleIdsInFields) {
    var newValidationState = __assign({}, oldValidationState);
    // validate fields by diff
    Object.keys(newDiff).forEach(function (fieldName) {
        var validatedStatuses = validateField(newDiff[fieldName], validationDescription[fieldName], insertedArgs);
        newValidationState[fieldName] = {
            showError: showErrors,
            value: newDiff[fieldName],
            statuses: validatedStatuses
        };
    });
    // validate fields, that uses additional arguments
    Object.keys(insertedArgs).forEach(function (arg) {
        if (!ruleIdsInFields[arg]) {
            return;
        }
        ruleIdsInFields[arg].forEach(function (field) {
            if (newDiff[field]) {
                return;
            }
            var validatedStatuses = validateField(newValidationState[field].value, validationDescription[field], insertedArgs);
            newValidationState[field] = __assign({}, newValidationState[field], { statuses: validatedStatuses });
        });
    });
    return newValidationState;
}
export { validateFieldsByDiff };
