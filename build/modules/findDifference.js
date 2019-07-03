"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function findDifference(componentStateUpdates, actualValidationState) {
    var difference = Object.keys(actualValidationState).reduce(function (acc, fieldName) {
        if (typeof componentStateUpdates[fieldName] === 'undefined' ||
            componentStateUpdates[fieldName] ===
                actualValidationState[fieldName].value) {
            return acc;
        }
        acc[fieldName] = componentStateUpdates[fieldName];
        return acc;
    }, {});
    return difference;
}
exports.findDifference = findDifference;
