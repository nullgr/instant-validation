// TODO add tests here
function validateField(fieldValue, fieldRules) {
    return fieldRules.map(function (item) {
        return item.rule(fieldValue);
    });
}
export { validateField };
