var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { validateField } from './validateField';
// TODO add tests here
function validateFieldsByDiff(newDiff, oldValidationState, validationDescription, showErrors, insertedArgs) {
    var newValidationState = __assign({}, oldValidationState);
    Object.keys(newDiff).forEach(function (fieldName) {
        var validatedStatuses = validateField(newDiff[fieldName], validationDescription[fieldName], insertedArgs);
        newValidationState[fieldName] = {
            showError: showErrors,
            value: newDiff[fieldName],
            statuses: validatedStatuses
        };
    });
    return newValidationState;
}
export { validateFieldsByDiff };
