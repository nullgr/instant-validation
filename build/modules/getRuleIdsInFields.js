// TODO add tests here
// build a hashmap ruleIds -> filedNames array, where those ids are used
function getRuleIdsInFields(fields) {
    var result = {};
    Object.keys(fields).forEach(function (field) {
        fields[field].forEach(function (rule) {
            if (rule.ruleId) {
                if (result[rule.ruleId] &&
                    result[rule.ruleId].filter(function (f) { return f === field; }).length === 0) {
                    // if this ruleId is used in multiple fields
                    return (result[rule.ruleId] = result[rule.ruleId].concat([field]));
                }
                // if this ruleId is used only in one field
                return (result[rule.ruleId] = [field]);
            }
            return;
        });
    });
    return result;
}
export { getRuleIdsInFields };
