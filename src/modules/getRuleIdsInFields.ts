import { FormattedFieldsDescription, RuleIdsInFields } from '../types';
// TODO add tests here
// build a hashmap ruleIds -> filedNames array, where those ids are used
function getRuleIdsInFields(
  fields: FormattedFieldsDescription,
): RuleIdsInFields {
  let result: RuleIdsInFields = {};
  Object.keys(fields).forEach(field => {
    fields[field].forEach(rule => {
      if (rule.ruleId) {
        if (
          result[rule.ruleId] &&
          result[rule.ruleId].filter(f => f === field).length === 0
        ) {
        // if this ruleId is used in multiple fields
          return result[rule.ruleId] = [...result[rule.ruleId], field];
        }
        // if this ruleId is used only in one field
        return result[rule.ruleId] = [field];
      }
      return;
    })
  })
  return result;
}

export { getRuleIdsInFields };
