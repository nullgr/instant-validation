import {
  RuleData,
  FieldsDescription,
  FieldValidationState,
  FormValidationState,
  ValidateReturn,
  ErrorMessages,
  FormattedFieldsDescription
} from './types';

import { findDifference } from './modules';

/**
 * A simle class for fields validation based on their state object (like in React.js local state)
 * @author Chernenko Alexander <ca@nullgr.com>, <akazimirkas@gmail.com>
 * @author Yurii Fediv <y.fediv@nullgr.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 */

class Validator<State> {
  validationDescription: FormattedFieldsDescription;
  validationState: FormValidationState | {};
  isInitValidationStateSet: boolean;

  constructor(fields: FieldsDescription) {
    if (typeof fields !== 'object') {
      throw new Error('Invalid fields parameter for fields, must be object');
    }
    // { rules, message } Objects
    this.validationDescription = fields;

    // { value, showError, statuses } Objects
    this.validationState = {};

    // if setInitialValues was called checkinng
    this.isInitValidationStateSet = false;
  }

  private getErrors(): ErrorMessages {
    const fieldNames = Object.keys(this.validationState);
    const errorMessages: ErrorMessages = {};

    fieldNames.forEach(fieldName => {
      const statuses = this.validationState[fieldName].statuses;
      const showError = this.validationState[fieldName].showError;
      // check every rule
      for (let i = 0; i < statuses.length; i++) {
        if (!statuses[i] && showError) {
          // always return the first failed rule error
          errorMessages[fieldName] = this.validationDescription[fieldName][
            i
          ].message;
          return;
        }
      }
      errorMessages[fieldName] = '';
      return;
    });

    return errorMessages;
  }

  private updateValidationStatuses(
    fieldObj: FormValidationState | FieldValidationState
  ) {
    Object.keys(fieldObj).forEach(fieldName => {
      fieldObj[fieldName].statuses = this.validateField(
        fieldObj[fieldName].value,
        this.validationDescription[fieldName]
      );
    });
    console.log(this.validationState);
  }

  private validateField(
    fieldValue: any,
    fieldRules: RuleData[]
  ): Array<boolean> {
    return fieldRules.map(item => {
      return item.rule(fieldValue);
    });
  }

  setInitialValues(state: State): State {
    Object.keys(this.validationDescription).forEach(fieldName => {
      if (typeof state[fieldName] === 'undefined') {
        throw new Error(
          `It seems that you didn't passed a field '${fieldName}' value`
        );
      }

      this.isInitValidationStateSet = true;

      this.validationState[fieldName] = {
        value: state[fieldName],
        showError: false,
        statuses: this.validationDescription[fieldName].map(rule => false)
      };
    });

    this.updateValidationStatuses(this.validationState);

    return state;
  }

  validate(state: State): ValidateReturn {
    if (!this.isInitValidationStateSet) {
      this.setInitialValues(state);
    } else {
      const changedField = findDifference<State>(state, this.validationState);

      if (Object.keys(changedField).length !== 0) {
        // TODO something because of sequence of two control constructures below
        this.validationState = {
          ...this.validationState,
          ...changedField
        };

        this.updateValidationStatuses(changedField);
      }
    }
    return { errors: this.getErrors() };
  }

  // isFormValid(): boolean {
  //   const keys = Object.keys(this.statuses);
  //   for (let i = 0; i < keys.length; i++) {
  //     const currentStatuses = this.statuses[keys[i]];
  //     for (let j = 0; j < currentStatuses.length; j++) {
  //       if (!currentStatuses[j]) {
  //         return false;
  //       }
  //     }
  //   }
  //   // if form valid return true
  //   return true;
  // }
}

export default Validator;
