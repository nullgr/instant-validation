import { RuleData } from '../types';
// TODO add tests here
function validateField(
  fieldValue: any,
  fieldRules: RuleData[]
): Array<boolean> {
  return fieldRules.map(item => {
    return item.rule(fieldValue);
  });
}
export { validateField };