# react-validation-utils
[![npm version](https://badge.fury.io/js/react-validation-utils.svg)](https://badge.fury.io/js/react-validation-utils)

Validate react form components, based on their state.

All the state management is under the hood.

Create the Validation class instance and describe the fields.

```js
const Validator = new Validation({
  email: {
      rule: emailRules,
      message: 'Please enter a valid email'
    }
  }
});
```

Then you can use its own checking and state wrapping [methods](#api).

In example, simply add validation with `addValidation` method, when you are initing the state:

```js
this.state = Validator.addValidation({
  email: ''
});
```
That will create a state like `{ email: '', validationStorage: {email: ['prevalidation-failed']}}`.

### Validation 
`validate` is a wrapper, that returns an updater function and pass it to `this.setState` method.

When you update the field value (or field values), you can add validation to it (to them).

```js
this.setState(
  Validator.validate({ email: value });
);
```
Afer that state will be like `{ email: peter@gmail.com, validationStorage: {email: ['validation-passed']} }`.

### Form example
Here is the example of a simple React form

```js
import * as React from 'react';
import Validation from 'react-validation-utils';
import { requiredRule, lengthRule } from 'react-validation-utils/build/rules';

const Validator = new Validation({
  login: [
    {
      rule: requiredRule,
      message: 'Please fill out the login'
    },
    {
      rule: lengthRule(5),
      message: 'Login should be at least 5 characters long'
    }
  ],
  password: [
    {
      rule: requiredRule,
      message: 'Please fill out the password'
    },
    {
      rule: lengthRule(8),
      message: 'Password should be at least 8 characters long'
    }
  ]
});

class LoginForm extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    // add validation storage to state (this will create this.state.validationStorage object)
    // and prevalidate all fields
    this.state = Validator.addValidation({
      login: '',
      password: ''
    });
  }

  onChange(e) {
    const { name, value } = e.target;
    // validate the field and save results in validationStorage
    this.setState(Validator.validate({ [name]: value }));
  }

  onSubmit(e) {
    e.preventDefault();
    // check validated and prevalidated fields
    if (!Validator.isFormValid(this.state)) {
      // validate all fields in the state to show all error messages
      return this.setState(Validator.validate());
    }
    this.props.onSubmit(this.state);
  }

  render() {
    const { login, password } = this.state;
    // get error messages from invalid fields, if they were validated.
    // prevalidated fields will receive no error messages, but they cause Validator.isFormValid to return false
    const errors = Validator.getErrors(this.state);
    return (
      <form>
        <input name="login" value={login} onChange={this.onChange} />
        <div className="error">{errors.login}</div>
        <input name="password" value={password} onChange={this.onChange} />
        <div className="error">{errors.password}</div>
        <button onClick={this.onSubmit} type="submit">
          Enter
        </button>
      </form>
    );
  }
}

export default LoginForm;
```

## Creating validation rules

`Rule` is a function, that return true, if the field is valid.
```js
const minAmount = val => val > 10
```

To each field you can provide a single `RuleData` object
```js
amount: {
  rule: minAmount, 
  message: errorMessageText,
  id: 'amountRule' // id is an optional parameter (if you need to rewrite the rule dynamically)
};
```

Or, if there are many rules, you can provide an array of `RuleData`s.
```js
password: [
  {
    rule: requiredRule,
    message: 'Please fill out the password'
  },
  {
    rule: lengthRule(8),
    message: 'Password should be at least 8 characters long'
  }
]
```
If there are many rules, the their priority will be similar to the array order.

## Api

### constructor({FieldsDescription}, validationStorageName = 'validationStorage')
Describe in the constructor all the fields, that you will check. Like in the [example](#form-example).
By default all validation data will be added to the 'validationStorage' key of the state object. You can change it, if you need. You can describe for each field [1 or many rules](#creating-validation-rules).

### addValidation({state}, showErrorsOnStart = false)
When you are creating the component state, you can use this method to prevalidate/validate the state fields and save results in a special key in the state ('validationStorage' by default). See the [example](#form-example).
If you want, you can set `showErrorsOnStart` to true, so fields will be validated and you will get all the errors in the first component render.
When you are adding a Validator with `Validator.addValidation` method, all the fields will be prevalidated.
Prevalidation means, that you will get no error message, if the field has not passed a validation rule  (`'prevalidation-failed'`).
Vэlidation means, that you will get an error message, if the field has not passed a validation rule (`'validation-failed'`).

### validate({stateChange} | updater | null, showErrors = true)
You should use it inside the this.setState method like it was already described [here](#validation).
If you want, you can set `showErrors` to false, so fields will be only prevalidated and no errors will appear on them.

By default this method only checks those fields, that are passing in `stateChange` object (or in result object of the updater function, if you use it instead of `stateChange`).

using `stateChange`:
```js
this.setState(Validator.validate({login: e.target.value}));
```

using `updater` function:
```js
this.setState(Validator.validate(prevState => login: e.target.value));
```

You can simply validate all fields at the same time, passing `null` or `undefined` instead of state argument.

```js
this.setState(Validator.validate());
```

### fieldsToValidate(...fields)
In some cases, when you are updating a single field in state, you need to validate several fields at the same time
```js
this.setState(
  Validator
   .fieldsToValidate(['amount', 'bill'])
   .validate({ amount: e.target.value })
)
```

### showErrorsOnFields(...fields)
In some cases, you need to choose, where to show error messages.
```js
this.setState(
  Validator
   .fieldsToValidate(['amount', 'bill'])
   .showErrorsOnFields(['amount'])
   .validate({ amount: e.target.value })
);
```

### updateRules({fieldsDescription})
You can use this method o dynamically change the rule.
```js
this.setState(
  Validator
   .updateRules({
      amount: { // fieldName
        amountRule: value => value >= this.props.account // ruleId: ruleFunc
      },
    })
   .validate({ amount: e.target.value })
);
```

### getErrors({state})
Use this method inside the render function, like in the [example](#form-example). It will return the object with fields keys and their error messages. If the field is valid there will be an empty error string.

### isFormValid({state})
Use this method to check, if the form is valid. It will return true, if all the fields in the form are valid. See the [example](#form-example)

### isFieldValid({state}, fieldName)
Use this method to check, if particular field is valid. Returns true if it is valid, false otherwise


## Compatibility 
This package id fully compatible with the React v.16, because it uses state updater functions inside.
