import { RuleData, InsertedArgs } from '../types';
// TODO add tests here
function validateField(
  fieldValue: any,
  fieldRules: RuleData[],
  insertedArgs: InsertedArgs
): Array<boolean> {
  return fieldRules.map(item => {
    let insert = [];
    if (item.ruleId && insertedArgs[item.ruleId]) {
      insert = [...insertedArgs[item.ruleId]];
    }
    console.log(fieldValue, ...insert);
    return item.rule(fieldValue, ...insert);
  });
}
export { validateField };