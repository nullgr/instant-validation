import { ValidationState } from '../types';
declare function findDifference<ComponentState>(componentStateUpdates: ComponentState, actualValidationState: ValidationState): Partial<ComponentState>;
export { findDifference };
