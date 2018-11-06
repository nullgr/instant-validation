var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
function findDifference(state, actualValidationState) {
    var diff = {};
    Object.keys(actualValidationState).forEach(function (fieldName) {
        if (typeof state[fieldName] === 'undefined' ||
            state[fieldName] === actualValidationState[fieldName].value) {
            return;
        }
        diff[fieldName] = __assign({}, actualValidationState[fieldName], { value: state[fieldName], showError: true });
    });
    console.log(diff);
    return diff;
}
export { findDifference };
