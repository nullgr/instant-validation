import { InsertedArgs, RuleData } from '../types';
// TODO add tests here
function validateField(
  fieldValue: any,
  fieldRules: RuleData[],
  insertedArgs: InsertedArgs
): boolean[] {
  return fieldRules.map(item => {
    let insert = [];
    if (item.ruleId && insertedArgs[item.ruleId]) {
      insert = [...insertedArgs[item.ruleId]];
    }
    return item.rule(fieldValue, ...insert);
  });
}
export { validateField };
