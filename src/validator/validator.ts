import {
  ChangedArgsFields,
  ErrorMessages,
  FieldsDescription,
  FormattedFieldsDescription,
  InsertedArgs,
  RuleIdsInFields,
  ValidateReturn,
  ValidationState
} from './types';

import {
  buildInitialState,
  findArgsDifference,
  findDifference,
  getErrorMessages,
  getFieldsData,
  getRuleIdsInFields,
  isStateValid,
  showAllErrors,
  validateFieldsByDiff
} from './modules';

/**
 * Quck setup. No Dependencies. Framework agnostic validation tool
 * It was created based on react-validation-tools library,
 * Thanks to ideas and participating from
 * @author Chernenko Alexander <ca@nullgr.com>, <akazimirkas@gmail.com>
 * @author Yurii Fediv <y.fediv@nullgr.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 * @author Igor Ivanov <i.ivanov@nullgr.com>
 */

class Validator<ComponentState> {
  errors: ErrorMessages;
  validationDescription: FormattedFieldsDescription;
  validationState: ValidationState;
  isInitValidationStateSet: boolean;
  insertedArgs: InsertedArgs;
  updatedArgsFields: ChangedArgsFields;
  ruleIdsInFields: RuleIdsInFields;

  constructor(fields: FieldsDescription) {
    if (typeof fields !== 'object') {
      throw new Error('Invalid fields parameter for fields, must be object');
    }

    this.validationDescription = fields;
    this.ruleIdsInFields = getRuleIdsInFields(fields);
    this.validationState = {};
    this.isInitValidationStateSet = false;
    this.updatedArgsFields = [];
    this.insertedArgs = {};
  }

  setInitialValues(componentState: ComponentState) {
    if (this.isInitValidationStateSet) {
      return;
    }
    this.isInitValidationStateSet = true;
    this.refreshState(
      buildInitialState<ComponentState>(
        componentState,
        this.validationDescription,
        this.insertedArgs,
        this.ruleIdsInFields
      )
    );
  }

  validate(componentState: ComponentState): ValidateReturn {
    if (!this.isInitValidationStateSet) {
      this.setInitialValues(componentState);
      const initialState = this.validationState;
      return {
        errors: getErrorMessages(initialState, this.validationDescription),
        get fields() {
          return getFieldsData(initialState);
        }
      };
    }

    const diff = findDifference<ComponentState>(
      componentState,
      this.validationState,
      this.updatedArgsFields
    );
    if (Object.keys(diff).length > 0) {
      this.refreshState(
        validateFieldsByDiff(
          diff,
          this.validationState,
          this.validationDescription,
          true,
          this.insertedArgs,
          this.ruleIdsInFields
        )
      );
    }
    const updatedState = this.validationState;
    return {
      errors: getErrorMessages(updatedState, this.validationDescription),
      get fields() {
        return getFieldsData(updatedState);
      }
    };
  }

  isFormValid(): boolean {
    return isStateValid(this.validationState);
  }

  insertArgs(args: InsertedArgs) {
    if (Object.keys(this.insertedArgs).length > 0) {
      this.updatedArgsFields = findArgsDifference(
        args,
        this.insertedArgs,
        this.ruleIdsInFields
      );
    }
    this.insertedArgs = args;
    return this;
  }

  showAllErrors(show = true) {
    this.refreshState(showAllErrors(this.validationState, show));
  }

  private refreshState(validationState: ValidationState) {
    this.validationState = validationState;
  }
}

export default Validator;
