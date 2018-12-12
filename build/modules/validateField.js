// TODO add tests here
function validateField(fieldValue, fieldRules, insertedArgs) {
    return fieldRules.map(function (item) {
        var insert = [];
        if (item.ruleId && insertedArgs[item.ruleId]) {
            insert = insertedArgs[item.ruleId].slice();
        }
        return item.rule.apply(item, [fieldValue].concat(insert));
    });
}
export { validateField };
