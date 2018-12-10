function findDifference(componentStateUpdates, actualValidationState) {
    var difference = {};
    Object.keys(actualValidationState).forEach(function (fieldName) {
        if (typeof componentStateUpdates[fieldName] === 'undefined' ||
            componentStateUpdates[fieldName] === actualValidationState[fieldName].value) {
            return;
        }
        difference[fieldName] = componentStateUpdates[fieldName];
    });
    return difference;
}
export { findDifference };
