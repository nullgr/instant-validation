import {
  RuleData,
  FieldsDescription,
  Statuses,
  ShowErrorMessagesOn,
  ErrorMessages,
  FormattedFieldsDescription
} from './types';

/**
 * A simle class for fields validation based on their state object (like in React.js local state)
 * @author Chernenko Alexander <ca@nullgr.com>, <akazimirkas@gmail.com>
 * @author Yurii Fediv <y.fediv@nullgr.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 */
class Validator<State> {
  fields: FormattedFieldsDescription;
  values: Partial<State>;
  valuesAreSet: boolean;
  statuses: Statuses;
  showErrorMessagesOn: ShowErrorMessagesOn

  constructor(fields: FieldsDescription) {
    if (typeof fields !== 'object') {
      throw new Error('Invalid fields parameter for fields, must be object');
    }
  
    this.fields = this.convertAllRulesToArrays(fields);
    this.values = {};
    // TODO add if setInitialValues was called checkinng
    this.valuesAreSet = false;
    this.statuses = {};
    this.showErrorMessagesOn = {};
  };

  private convertAllRulesToArrays(
    fields: FieldsDescription
  ): FormattedFieldsDescription {
    let formattedFields = {};

    Object.keys(fields).forEach(field => {
      formattedFields[field] = Array.isArray(fields[field])
      // @ts-ignore
        ? [...fields[field]]
        : [fields[field]];
    });
    return formattedFields;
  };

  private updateValidationStatuses(updatedValues: Partial<State>) {
    Object.keys(updatedValues).forEach(
      key => {
        this.statuses[key] = this.validateField(
          updatedValues[key],
          this.fields[key],
        );
      }
    );
  }

  private validateField(fieldValue: any, fieldRules: RuleData[]): Array<boolean> {
    return fieldRules.map(item => {
      return item.rule(fieldValue)
    });
  };

  private countDiff(state: State): Partial<State> {
    let diff = {};
    Object.keys(this.values).forEach(fieldName => {
      if(typeof state[fieldName] !== 'undefined' && state[fieldName] !== this.values[fieldName]) {
        diff[fieldName] = state[fieldName];
        this.showErrorMessagesOn[fieldName] = true;
      }
    })
    return diff;
  }

  setInitialValues(state: State): State {
    Object.keys(this.fields).forEach(fieldName => {
      if(typeof state[fieldName] !== 'undefined') {
        this.values[fieldName] = state[fieldName];
        this.showErrorMessagesOn[fieldName] = false;
      } else {
        throw new Error(`It seems that you didn't passed a field ${fieldName} value`);
      }
    });
    this.valuesAreSet = true;
    this.updateValidationStatuses(this.values);
    return state;
  }

  validate(state: State): State {
    const diff = this.countDiff(state);
    this.values = Object.assign({}, this.values, diff);
    this.updateValidationStatuses(diff);
    return state;
  }

  getStatuses(forEveryRule = false): Statuses {
    if (forEveryRule) {
      return this.statuses;
    }

    const keys = Object.keys(this.statuses);
    const res = {};
    keys.forEach(fieldName => {
      const current = this.statuses[fieldName];
      // check every rule
      for (let i = 0; i < current.length; i++) {
        if (!current[i]) {
          // always return the first failed rule error
          res[fieldName] = false;
          return;
        }
      }
      res[fieldName] = true;
      return;
    });
    return res;
  }

  getErrors(): ErrorMessages {
    const keys = Object.keys(this.statuses);
    const errorMessages: ErrorMessages = {};
    keys.forEach(fieldName => {
      const current = this.statuses[fieldName];
      // check every rule
      for (let i = 0; i < current.length; i++) {
        if (!current[i] && this.showErrorMessagesOn[fieldName]) {
          // always return the first failed rule error
          errorMessages[fieldName] = this.fields[fieldName][i].message;
          return;
        }
      }
      errorMessages[fieldName] = '';
      return;
    });

    return errorMessages;
  };

  showErrors(fieldsNames?: Array<string>, show = true) {
    if (!fieldsNames) {
      fieldsNames = Object.keys(this.showErrorMessagesOn);
    }
    fieldsNames.forEach(fieldName => {
      this.showErrorMessagesOn[fieldName] = show;
    })
  }

  isFormValid(): boolean {
    const keys = Object.keys(this.statuses);
    for (let i = 0; i < keys.length; i++) {
      const currentStatuses = this.statuses[keys[i]];
      for (let j = 0; j < currentStatuses.length; j++) {
        if (!currentStatuses[j]) {
          return false;
        }
      }
    }
    // if form valid return true
    return true;
  };
};

export default Validator;
