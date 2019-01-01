var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
function showAllErrors(validationState, show) {
    var newState = {};
    Object.keys(validationState).forEach(function (key) { return (newState[key] = __assign({}, validationState[key], { showError: show })); });
    return newState;
}
export { showAllErrors };
