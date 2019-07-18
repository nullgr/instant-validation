import { ValidationState } from '../types';
// TODO add tests here
function isStateValid<ComponentState>(
  validationState: ValidationState<ComponentState>
): boolean {
  const keys = Object.keys(validationState);
  for (let key of keys) {
    const item = validationState[key];
    if (item.statuses.filter((status: boolean) => !status).length > 0) {
      return false;
    }
  }

  return true;
}

export { isStateValid };
