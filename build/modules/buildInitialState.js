import { validateFieldsByDiff } from './validateFieldsByDiff';
// TODO add tests here
function buildInitialState(componentState, validationDescription, insertedArgs, ruleIdsInFields) {
    var initialDiff = {};
    var initialState = {};
    Object.keys(validationDescription).forEach(function (fieldName) {
        if (typeof componentState[fieldName] === 'undefined') {
            throw new Error("It seems that you didn't passed a field '" + fieldName + "' value");
        }
        initialDiff[fieldName] = componentState[fieldName];
        initialState[fieldName] = {
            value: componentState[fieldName],
            showError: false,
            statuses: []
        };
    });
    return validateFieldsByDiff(initialDiff, initialState, validationDescription, false, insertedArgs, ruleIdsInFields);
}
export { buildInitialState };
