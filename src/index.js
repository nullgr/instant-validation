// @flow
/**
 * Validation rule type for one field
 * @example rule: val => val.length > 4
 * state is the optional parameter, you can use it, if you need to compare with field from your component state
 * @example rule: (paymentSumm, state) => state.billAmount >= paymentSumm
 */
type Rule = (val: any, state: Object) => boolean;

type RuleData = {
  rule: Rule,
  /**
   * error message text
   */
  message: string,
  /**
   * (optional) use it in method updateRules as an identifier,
   */
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
 * A simple class for fields validation in React.js
 * Use it in your React components for forms,
 * The form should work the classical way, store fields in the local component state and modify fields using this.setState method
 * @author Chernenko Alexander <ca@nullgr.com>, <akazimirkas@gmail.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 * @example
 * const Validator = new Validation({
 *   login: {
 *     rule: value => value.length >= 5,
 *     message: 'Login should contain at least 5 characters'
 *   },
 *   password: [
 *     {
 *       rule: charactersRule,
 *       message: 'Invalid characters in password'
 *     }
 *     {
 *       rule: value => value.length >= 5,
 *       message: 'Password should contain at least 5 characters'
 *     }
 *  ]
 * });
 */
class Validation {
  fields: FormattedFieldsDescription;
  fieldsToValidateList: Array<string>;
  fieldsToShowErrors: Array<string>;
  storage: string;
  statuses: Array<string>;

  constructor(
    fields: FieldsDescription,
    errorsStorageName: string = 'validationStorage'
  ) {
    if (typeof fields !== 'object') {
      throw new Error('Invalid fields parameter for fields, must be object');
    }

    this.fields = allRulesInArrays(fields);
    this.fieldsToValidateList = [];
    this.fieldsToShowErrors = [];
    this.storage = errorsStorageName;
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
      [this.storage]: toStorage
    });
  }

  /**
   * Validate is a method to use inside the setState function
   * You can simply validate all fields at the same time
   * @example
   * this.setState(Validator.validate())
   * Or Validator can check ONLY the fields, whose keys are passed to the setState
   * @example
   * this.setState(
   *   Validator.validate({ login: value })
   * )
   * If you want to manually set fields for validation, you can use fieldsToValidate method BEFORE the validate method
   * in that case, values for other fields will be taken from unupdated component state
   * @example
   * this.setState(
   *   Validator
   *    .fieldsToValidate(['newPassword', 'repeatPassword'])
   *    .validate({ newPassword: e.target.value })
   * )
   * If you want to dynamically update the rule, you can do this with updateRules method, using setting the rule by its id
   * @example
   * this.setState(
   *   Validator
   *    .updateRules({
   *       repeatPassword: {
   *         repeatRule: repeatPassword => repeatPassword === e.target.value
   *       },
   *     })
   *    .fieldsToValidate(['newPassword', 'repeatPassword'])
   *    .validate({ newPassword: e.target.value })
   * )
   */
  validate(stateUpdates: ?Object, showErrors: boolean = true) {
    let showErrorsHash = {};
    let showChoosenErrors = false;
    const keysToValidate =
      this.fieldsToValidateList.length > 0
        ? this.fieldsToValidateList
        : stateUpdates ? Object.keys(stateUpdates) : Object.keys(this.fields);
    if (this.fieldsToValidateList.length > 0) {
      this.fieldsToValidateList = [];
    }

    if (this.fieldsToShowErrors.length > 0) {
      showChoosenErrors = true;
      this.fieldsToShowErrors.forEach(f => (showErrorsHash[f] = true));
      this.fieldsToShowErrors = [];
    }

    return (prevState: Object) => {
      let toStorage: Object = {};
      // computing the state as a merge from prevState and stateUpdates to do the right validation
      let state = Object.assign({}, prevState, stateUpdates || {});
      // clean the service error storage field, so the rule will have no acces to it
      delete state[this.storage];
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
        [this.storage]: Object.assign({}, prevState[this.storage], toStorage)
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
      const current = state[this.storage][key];
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
    const errors = state[this.storage];
    if (typeof errors !== 'object') {
      throw new Error('Invalid errors parameter for fields, must be object');
    }

    const keys = Object.keys(errors);
    const [validationPassed] = this.statuses;
    for (let i = 0; i < keys.length; i++) {
      const currentStatuses = errors[keys[i]];
      for (let j = 0; j < currentStatuses.length; j++) {
        if (currentStatuses[j] !== validationPassed) {
          return false;
        }
      }
    }
    // if form valid return true
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
