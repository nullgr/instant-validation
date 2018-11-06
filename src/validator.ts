import {
  RuleData,
  FieldsDescription,
  // Statuses,
  // ShowErrorMessagesOn,
  // ErrorMessages,
  FormattedFieldsDescription
} from './types';

/**
 * A simle class for fields validation based on their state object (like in React.js local state)
 * @author Chernenko Alexander <ca@nullgr.com>, <akazimirkas@gmail.com>
 * @author Yurii Fediv <y.fediv@nullgr.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 */
class Validator<State> {
  validationDescription: FormattedFieldsDescription;
  validationState: Partial<State>;
  isInitValidationStateSet: boolean;

  constructor(fields: FieldsDescription) {
    if (typeof fields !== 'object') {
      throw new Error('Invalid fields parameter for fields, must be object');
    }
    // { rules, message } Objects
    this.validationDescription = fields;

    // { value, showError, statuses } Objects
    this.validationState = {};

    // TODO if setInitialValues was called checkinng
    this.isInitValidationStateSet = false;
  }

  private updateValidationStatuses(fieldObj: Partial<State>) {
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

  private countDiff(state: State): Partial<State> {
    let diff = {};

    Object.keys(this.validationState).forEach(fieldName => {
      // TODO: take out condition out of the method

      if (
        typeof state[fieldName] === 'undefined' ||
        state[fieldName] === this.validationState[fieldName].value
      ) {
        return;
      }

      diff[fieldName] = {
        value: state[fieldName],
        showError: true,
        statuses: this.validationState[fieldName].statuses
      };
      // return (
      //   !(
      //     typeof state[fieldName] === 'undefined' ||
      //     state[fieldName] === this.validationState[fieldName].value
      //   ) &&
      //   (diff[fieldName] = {
      //     value: state[fieldName],
      //     showError: true,
      //     statuses: this.validationState[fieldName].statuses
      //   })
      // );
    });

    console.log(diff);
    return diff;
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

  validate(state: State): State {
    if (!this.isInitValidationStateSet) {
      this.setInitialValues(state);
    } else {
      const changedField = this.countDiff(state);

      if (Object.keys(changedField).length !== 0) {
        // TODO something because of line sequence
        this.validationState = Object.assign(
          {},
          this.validationState,
          changedField
        ));

        this.updateValidationStatuses(changedField);
      }
    }
    return state;
  }

  // getStatuses(forEveryRule = false): Statuses {
  //   if (forEveryRule) {
  //     return this.statuses;
  //   }

  //   const keys = Object.keys(this.statuses);
  //   const res = {};
  //   keys.forEach(fieldName => {
  //     const current = this.statuses[fieldName];
  //     // check every rule
  //     for (let i = 0; i < current.length; i++) {
  //       if (!current[i]) {
  //         // always return the first failed rule error
  //         res[fieldName] = false;
  //         return;
  //       }
  //     }
  //     res[fieldName] = true;
  //     return;
  //   });
  //   return res;
  // }

  // getErrors(): ErrorMessages {
  //   const keys = Object.keys(this.statuses);
  //   const errorMessages: ErrorMessages = {};
  //   keys.forEach(fieldName => {
  //     const current = this.statuses[fieldName];
  //     // check every rule
  //     for (let i = 0; i < current.length; i++) {
  //       if (!current[i] && this.showErrorMessagesOn[fieldName]) {
  //         // always return the first failed rule error
  //         errorMessages[fieldName] = this.validationDescription[fieldName][
  //           i
  //         ].message;
  //         return;
  //       }
  //     }
  //     errorMessages[fieldName] = '';
  //     return;
  //   });

  //   return errorMessages;
  // }

  // showErrors(fieldsNames?: Array<string>, show = true) {
  //   if (!fieldsNames) {
  //     fieldsNames = Object.keys(this.showErrorMessagesOn);
  //   }
  //   fieldsNames.forEach(fieldName => {
  //     this.showErrorMessagesOn[fieldName] = show;
  //   });
  // }

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
