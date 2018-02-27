// @flow
declare var NODE_ENV: string;
const developmentMode = NODE_ENV !== 'production';

type Rule = (val: any, state: Object) => boolean;

type RuleData = {
  rule: Rule,
  message: string,
  id?: string
};

/**
 * FieldsDescription type for using it in constructor
 * you can use both, object or array of objects with RuleData
 */
type FieldsDescription = {
  [key: string]: RuleData | RuleData[]
};

/**
 * FieldsDescription type for using it in under the hood, each ruleData is 100% an array
 */
type FormattedFieldsDescription = {
  [key: string]: RuleData[]
};

/**
 * A class for fields validation in React.js
 * Use it in your React components for forms,
 * The form should work the classical way,
 * store fields in the local component state and modify fields using this.setState method
 * @author Chernenko Alexander <ca@nullgr.com>, <akazimirkas@gmail.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 */
class Validation {
  fields: FormattedFieldsDescription;
  fieldsToValidateList: Array<string>;
  fieldsToShowErrors: Array<string>;
  storage: string;
  statuses: Array<string>;
  validationStorageName: string;

  constructor(
    fields: FieldsDescription,
    validationStorageName: string = 'validationStorage'
  ) {
    if (typeof fields !== 'object') {
      throw new Error('Invalid fields parameter for fields, must be object');
    }

    this.fields = allRulesInArrays(fields);
    this.fieldsToValidateList = [];
    this.fieldsToShowErrors = [];
    this.validationStorageName = validationStorageName;
    this.statuses = [
      'validation-passed',
      'prevalidation-failed',
      'validation-failed'
    ];
  }

  _validateField(
    fieldValue: any,
    fieldRules: RuleData[],
    state: Object,
    showErrors: boolean
  ): string | string[] {
    const [
      validationPassed,
      prevalidationFailed,
      validationFailed
    ] = this.statuses;

    // validate every rule
    return fieldRules.map(item => {
      return item.rule(fieldValue, state)
        ? validationPassed
        : showErrors ? validationFailed : prevalidationFailed;
    });
  }

  addValidation(state: Object, showErrorsOnStart: boolean = false) {
    if (typeof state !== 'object') {
      throw new Error('Invalid state parameter for fields, must be object');
    }

    let toStorage: Object = {};

    Object.keys(this.fields).map(
      key =>
        (toStorage[key] = this._validateField(
          state[key],
          this.fields[key],
          state,
          showErrorsOnStart
        ))
    );

    return Object.assign(state, {
      [this.validationStorageName]: toStorage
    });
  }

  /**
   * Validate is a method to use inside the setState function
   */
  validate(stateUpdates: ?Object | Function, showErrors: boolean = true) {
    let showErrorsHash = {};
    let showChoosenErrors = false;
    let fieldsToValidateList = [];
    if (this.fieldsToValidateList.length > 0) {
      fieldsToValidateList = this.fieldsToValidateList;
      this.fieldsToValidateList = [];
    }

    if (this.fieldsToShowErrors.length > 0) {
      showChoosenErrors = true;
      this.fieldsToShowErrors.forEach(f => (showErrorsHash[f] = true));
      this.fieldsToShowErrors = [];
    }

    return (prevState: Object, props: ?Object) => {
      if (typeof stateUpdates === 'function') {
        // support of updater function
        stateUpdates = stateUpdates(prevState, props);
      }
      const keysToValidate =
        fieldsToValidateList.length > 0
          ? fieldsToValidateList
          : stateUpdates ? Object.keys(stateUpdates) : Object.keys(this.fields);
      let toStorage: Object = {};
      // computing the state as a merge from prevState and stateUpdates to do the right validation
      let state = Object.assign({}, prevState, stateUpdates || {});
      // clean the service error storage field, so the rule will have no acces to it
      delete state[this.validationStorageName];
      keysToValidate.map(key => {
        if (this.fields[key]) {
          toStorage[key] = this._validateField(
            state[key],
            this.fields[key],
            prevState,
            showChoosenErrors ? showErrorsHash[key] : showErrors
          );
        }
      });
      this.fieldsToShowErrors = [];
      return Object.assign(stateUpdates || {}, {
        [this.validationStorageName]: Object.assign(
          {},
          prevState[this.validationStorageName],
          toStorage
        )
      });
    };
  }

  updateRules(updatedRules: { [key: string]: { [key: string]: Rule } }) {
    Object.keys(updatedRules).map(k => {
      if (this.fields[k]) {
        const rulesToUpdate = Object.keys(updatedRules[k]);
        rulesToUpdate.forEach(ruleId => {
          let ruleIndex = -1;
          this.fields[k].forEach((f, i) => {
            if (f.id && f.id === ruleId) {
              ruleIndex = i;
            }
          });
          if (ruleIndex !== -1) {
            this.fields[k][ruleIndex].rule = updatedRules[k][ruleId];
          }
        });
      }
    });

    return this;
  }

  fieldsToValidate(fieldsList: Array<string>) {
    this.fieldsToValidateList = [...fieldsList];
    return this;
  }

  showErrorsOnFields(fieldsList: Array<string>) {
    this.fieldsToShowErrors = [...fieldsList];
    return this;
  }

  getErrors(state: Object) {
    const keys = Object.keys(this.fields),
      objErrors: Object = {};

    const validationFailed = this.statuses[2];

    keys.map(key => {
      const current = state[this.validationStorageName][key];
      // check every rule
      for (let i = 0; i < current.length; i++) {
        if (current[i] === validationFailed) {
          // always return the first failed rule error
          objErrors[key] = this.fields[key][i].message;
          return;
        }
      }
      objErrors[key] = '';
      return;
    });

    return objErrors;
  }

  isFormValid(state: Object): boolean {
    const storage = state[this.validationStorageName];
    if (typeof storage !== 'object') {
      throw new Error('Invalid fieldsMappedToStatuses object, must be object');
    }

    const keys = Object.keys(storage);
    const [validationPassed] = this.statuses;
    for (let i = 0; i < keys.length; i++) {
      const currentStatuses = storage[keys[i]];
      for (let j = 0; j < currentStatuses.length; j++) {
        if (currentStatuses[j] !== validationPassed) {
          return false;
        }
      }
    }
    // if form valid return true
    return true;
  }

  isFieldValid(state: Object, fieldName: string): boolean {
    const storage = state[this.validationStorageName];
    if (typeof storage !== 'object') {
      throw new Error('Invalid storage object, must be object');
    }
    const fieldStatuses = storage[fieldName];
    if (developmentMode && !fieldStatuses) {
      // TODO: how to disable warnings in production
      console.warn("Attempt to validate field that doesn't exist");
      return false;
    }

    const [validationPassed] = this.statuses;
    for (let j = 0; j < fieldStatuses.length; j++) {
      if (fieldStatuses[j] !== validationPassed) {
        return false;
      }
    }
    return true;
  }
}

const allRulesInArrays = (
  fields: FieldsDescription
): FormattedFieldsDescription => {
  let formattedFields = {};

  Object.keys(fields).forEach(field => {
    formattedFields[field] = Array.isArray(fields[field])
      ? [...fields[field]]
      : [fields[field]];
  });
  return formattedFields;
};

export default Validation;
