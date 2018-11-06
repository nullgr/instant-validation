import { FormValidationState, FieldValidationState } from '../types';
declare function findDifference<State>(state: State, actualValidationState: FormValidationState): FieldValidationState | {};
export { findDifference };
