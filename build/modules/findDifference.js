var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
function findDifference(state, actualValidationState) {
    var difference = {};
    Object.keys(actualValidationState).forEach(function (fieldName) {
        if (typeof state[fieldName] === 'undefined' ||
            state[fieldName] === actualValidationState[fieldName].value) {
            return;
        }
        difference[fieldName] = __assign({}, actualValidationState[fieldName], { value: state[fieldName], showError: true });
    });
    return difference;
}
export { findDifference };
