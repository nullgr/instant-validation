import {
  ErrorMessages,
  FieldsDescription,
  FormattedFieldsDescription,
  InsertedArgs,
  PublicValidationState,
  RuleIdsInFields,
  ValidateReturn,
  ValidationState
} from './types';

import {
  buildInitialState,
  findDifference,
  getErrorMessages,
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
  ruleIdsInFields: RuleIdsInFields;

  constructor(fields: FieldsDescription) {
    if (typeof fields !== 'object') {
      throw new Error('Invalid fields parameter for fields, must be object');
    }

    this.validationDescription = fields;
    this.ruleIdsInFields = getRuleIdsInFields(fields);
    this.validationState = {};
    this.isInitValidationStateSet = false;
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
      return {
        errors: getErrorMessages(
          this.validationState,
          this.validationDescription
        )
      };
    }

    const diff = findDifference<ComponentState>(
      componentState,
      this.validationState
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
    return {
      errors: getErrorMessages(this.validationState, this.validationDescription)
    };
  }

  isFormValid(): boolean {
    return isStateValid(this.validationState);
  }

  insertArgs(args: InsertedArgs) {
    this.insertedArgs = args;
    return this;
  }

  showAllErrors(show = true) {
    this.refreshState(showAllErrors(this.validationState, show));
  }

  getFieldsState(): PublicValidationState {
    // TODO add tests and extract this method and add README desctiption and example for it
    let result = {};
    Object.keys(this.validationState).forEach(key => {
      result[key] = {
        ...this.validationState[key],
        valid: this.validationState[key].statuses.filter((status: boolean) => !status).length === 0
      }
    })
    return result;
  }

  private refreshState(validationState: ValidationState) {
    this.validationState = validationState;
  }
}

export default Validator;
