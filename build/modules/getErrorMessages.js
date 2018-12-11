function findFirstFailedRuleMessage(fieldDescripton, statuses) {
    return statuses.indexOf(false) === -1
        ? ''
        : fieldDescripton[statuses.indexOf(false)].message;
}
// TODO add tests here
function getErrorMessages(validationState, validationDescription) {
    var errors = {};
    Object.keys(validationState).forEach(function (fieldName) {
        errors[fieldName] = validationState[fieldName].showError ?
            findFirstFailedRuleMessage(validationDescription[fieldName], validationState[fieldName].statuses) : '';
    });
    return errors;
}
export { getErrorMessages };
