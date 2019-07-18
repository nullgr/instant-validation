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
 * @author Stanislav Iliashchuk <s.iliashchuk@nullgr.com>
 * @author Igor Ivanov <i.ivanov@nullgr.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 */

class Validator<ComponentState> {
  errors?: ErrorMessages<ComponentState>;
  validationDescription: FormattedFieldsDescription;
  validationState?: ValidationState<ComponentState>;
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
    this.isInitValidationStateSet = false;
    this.updatedArgsFields = [];
    this.insertedArgs = {};
  }

  setInitialValues(componentState: ComponentState): void {
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

  validate(componentState: ComponentState): ValidateReturn<ComponentState> {
    if (!this.isInitValidationStateSet) {
      this.setInitialValues(componentState);
      const initialState = this.validationState as ValidationState<
        ComponentState
      >;
      return {
        errors: getErrorMessages(initialState, this.validationDescription),
        get fields() {
          return getFieldsData<ComponentState>(initialState);
        }
      };
    }

    const diff = findDifference<ComponentState>(
      componentState,
      this.validationState as ValidationState<ComponentState>,
      this.updatedArgsFields
    );
    if (Object.keys(diff).length > 0) {
      this.refreshState(
        validateFieldsByDiff(
          diff,
          this.validationState as ValidationState<ComponentState>,
          this.validationDescription,
          true,
          this.insertedArgs,
          this.ruleIdsInFields
        )
      );
    }
    const updatedState = this.validationState as ValidationState<
      ComponentState
    >;
    return {
      errors: getErrorMessages(updatedState, this.validationDescription),
      get fields() {
        return getFieldsData<ComponentState>(updatedState);
      }
    };
  }

  isFormValid(): boolean {
    return isStateValid(this.validationState as ValidationState<
      ComponentState
    >);
  }

  insertArgs(args: InsertedArgs): Validator<ComponentState> {
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

  showAllErrors(show = true): void {
    this.refreshState(
      showAllErrors(
        this.validationState as ValidationState<ComponentState>,
        show
      )
    );
  }

  private refreshState(validationState: ValidationState<ComponentState>): void {
    this.validationState = validationState;
  }
}

export default Validator;
