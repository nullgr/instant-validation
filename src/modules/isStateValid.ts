import { ValidationState } from '../types';
// TODO add tests here
function isStateValid(
  validationState: ValidationState
): boolean {
  const keys = Object.keys(validationState);
  for(let i = 0; i < keys.length; i++) {
    const item = validationState[keys[i]];
    if(item.statuses.filter((status: boolean) => !status).length > 0) {
      return false;
    }
  }

  return true;
}

export { isStateValid };
