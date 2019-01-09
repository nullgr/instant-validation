"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO add tests here
function isStateValid(validationState) {
    var keys = Object.keys(validationState);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        var item = validationState[key];
        if (item.statuses.filter(function (status) { return !status; }).length > 0) {
            return false;
        }
    }
    return true;
}
exports.isStateValid = isStateValid;
