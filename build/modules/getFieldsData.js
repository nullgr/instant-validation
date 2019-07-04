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
function getFieldsData(validationState) {
    // TODO add README desctiption and example for it
    var result = Object.keys(validationState).reduce(function (acc, key) {
        acc[key] = __assign({}, validationState[key], { valid: validationState[key].statuses.filter(function (status) { return !status; }).length === 0 });
        return acc;
    }, {});
    return result;
}
exports.getFieldsData = getFieldsData;
