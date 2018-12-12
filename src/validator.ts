import {
  FieldsDescription,
  ValidationState,
  ValidateReturn,
  ErrorMessages,
  FormattedFieldsDescription,
  InsertedArgs,
  RuleIdsInFields
} from './types';

import { 
  getRuleIdsInFields,
  findDifference,
  buildInitialState,
  validateFieldsByDiff,
  getErrorMessages,
  isStateValid
} from './modules';

/**
 * A simple class for fields validation based on their state object (like in React.js local state)
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

  private refreshState(validationState: ValidationState) {
    this.validationState = validationState;
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
    )
  }

  validate(componentState: ComponentState): ValidateReturn {
    if (!this.isInitValidationStateSet) {
      this.setInitialValues(componentState);
      return { 
        errors: getErrorMessages(
          this.validationState, this.validationDescription
        )
      };
    }

    const diff = findDifference<ComponentState>(
      componentState,
      this.validationState,
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
      errors: getErrorMessages(
        this.validationState, this.validationDescription
      )
    };
  }

  isFormValid(): boolean {
    return isStateValid(this.validationState);
  }

  insertArgs(args: InsertedArgs) {
    this.insertedArgs = args;
    return this;
  }
}

export default Validator;
