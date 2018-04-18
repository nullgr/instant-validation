// @flow
import {
  Rule,
  RuleData,
  FieldsDescription,
  FormattedFieldsDescription
} from './types';
/* eslint-disable */
const log = console.log;

/**
 * A class for fields validation in React.js
 * Use it in your React components for forms,
 * The form should work the classical way,
 * store fields in the local component state and modify fields using this.setState method
 * @author Chernenko Alexander <ca@nullgr.com>, <akazimirkas@gmail.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 */
// class Validation {
//   fields: FormattedFieldsDescription;
//   fieldsToValidateList: Array<string>;
//   fieldsToShowErrors: Array<string>;
//   statuses: Array<string>;
//   validationStorage: Object;

function Validator(fields: FieldsDescription) {
  if (typeof fields !== 'object') {
    throw new Error('Invalid fields parameter for fields, must be object');
  }

  this.fields = this._convertAllRulesToArrays(fields);
  this.fieldsToValidateList = [];
  this.fieldsToShowErrors = [];
  this.validationStorage = {};
  this.statuses = [
    'validation-passed',
    'prevalidation-failed',
    'validation-failed'
  ];
}

Validator.prototype = {
  addValidation: function(state: Object, showErrorsOnStart: boolean = false) {
    if (typeof state !== 'object') {
      throw new Error('Invalid state parameter for fields, must be object');
    }

    Object.keys(this.fields).map(
      key =>
        (this.validationStorage[key] = this._validateField(
          state[key],
          this.fields[key],
          state,
          showErrorsOnStart
        ))
    );

    return state;
  },

  /**
   * Validate is a method to use inside the setState function
   */
  validate: function(
    stateUpdates: ?Object | Function,
    showErrors: boolean = true
  ) {
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
      // computing the state as a merge from prevState and stateUpdates to do the right validation
      let state = Object.assign({}, prevState, stateUpdates || {});

      keysToValidate.map(key => {
        if (this.fields[key]) {
          this.validationStorage[key] = this._validateField(
            state[key],
            this.fields[key],
            prevState,
            showChoosenErrors ? showErrorsHash[key] : showErrors
          );
        }
      });
      this.fieldsToShowErrors = [];
      return Object.assign(stateUpdates || {});
    };
  },

  updateRules: function(updatedRules: {
    [key: string]: { [key: string]: Rule }
  }) {
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
  },

  fieldsToValidate: function(fieldsList: Array<string>) {
    this.fieldsToValidateList = [...fieldsList];
    return this;
  },

  showErrorsOnFields: function(fieldsList: Array<string>) {
    this.fieldsToShowErrors = [...fieldsList];
    return this;
  },

  getErrors: function() {
    const keys = Object.keys(this.fields),
      objErrors: Object = {};

    const validationFailed = this.statuses[2];
    keys.map(key => {
      const current = this.validationStorage[key];
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
  },

  isFormValid: function(): boolean {
    const keys = Object.keys(this.validationStorage);
    const [validationPassed] = this.statuses;

    for (let i = 0; i < keys.length; i++) {
      const currentStatuses = this.validationStorage[keys[i]];
      for (let j = 0; j < currentStatuses.length; j++) {
        if (currentStatuses[j] !== validationPassed) {
          return false;
        }
      }
    }
    // if form valid return true
    return true;
  },

  isFieldValid: function(fieldName: string): boolean {
    // this._checkState(state);

    const fieldStatuses = this.validationStorage[fieldName];
    if (!fieldStatuses) {
      return false;
    }

    const [validationPassed] = this.statuses;
    for (let j = 0; j < fieldStatuses.length; j++) {
      if (fieldStatuses[j] !== validationPassed) {
        return false;
      }
    }
    return true;
  },

  _convertAllRulesToArrays: function(
    fields: FieldsDescription
  ): FormattedFieldsDescription {
    let formattedFields = {};

    Object.keys(fields).forEach(field => {
      formattedFields[field] = Array.isArray(fields[field])
        ? [...fields[field]]
        : [fields[field]];
    });
    return formattedFields;
  },

  _validateField: function(
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
  },

  _checkState: function(state: Object) {
    if (typeof state !== 'object') {
      throw new Error('Invalid state parameter, must be object');
    }

    // need to check if addValidation was called

    // if (!state[validationStorageName]) {
    //   throw new Error(`State parameter doesn't contain ${validationStorageName} field,
    // it seems that you didn't invoke addValidation method`);
    // }

    // if (typeof state[validationStorageName] !== 'object') {
    //   throw new Error('Invalid storage object, must be object');
    // }
  }
};

export default Validator;
export { FieldsDescription };
