# react-validation-utils

[![npm version](https://badge.fury.io/js/react-validation-utils.svg)](https://badge.fury.io/js/react-validation-utils)

## This is something like proposal to current validation library, this description doesn't match current API

Validate react form components, based on their state.

Why to use:

1. All the state management is under the hood.
2. Incapsulation of all logic related to validation,
   you should only call needed method and library will care about details
3. Easy integration to existed components

Create the Validator class instance and describe the fields.

```js
const validator = new Validator({
  email: {
      rule: emailRules,
      message: 'Please enter a valid email'
    }
  }
});
```

Then you can use its own checking and state wrapping [methods](#api).

In example, simply add validation with `initialize` method, when you are initing the state:

```js
this.state = validator.initialize({
  email: ""
});
```

This is equiavalent to:

```js
this.state = {
  email: ""
};
validator.initialize({ email: "" });
```

### Validation

`validate` function tells to `validator` object how state will be changed in React component
and `validator` internally executes validation for this future state.

Returns the same object passed in argument, it allows pass `validate` invocation inside `this.setState`
(it is just shorter form).

```js
this.setState(
  validator.validate({ email: value });
);
```

This is equiavalent to:

```js
validator.validate({ email: value });
this.setState({ email: value });
```

### Form example

Here is the example of a simple React form

````js
import * as React from "react";
import Validator from "react-validation-utils";
import { requiredRule, lengthRule } from "react-validation-utils/build/rules";

const validator = new Validator({
  login: [
    {
      rule: requiredRule,
      message: "Please fill out the login"
    },
    {
      rule: lengthRule(5),
      message: "Login should be at least 5 characters long"
    }
  ],
  password: [
    {
      rule: requiredRule,
      message: "Please fill out the password"
    },
    {
      rule: lengthRule(8),
      message: "Password should be at least 8 characters long"
    }
  ]
});

class LoginForm extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    // Prevalidate all fields and initialize state
    // It is equilvalent to:
    // ```
    //  this.state = {
    //    login: "",
    //    password: ""
    //  }
    //  validator.initialize({
    //    login: "",
    //    password: ""
    //  })
    // ```
    this.state = validator.initialize({
      login: "",
      password: ""
    });
  }

  onChange(e) {
    const { name, value } = e.target;
    // validate the field and set state
    // It is equilvalent to:
    // ```
    //  validator.validate({ [name]: value })
    //  this.setState({ [name]: value })
    // ```

    this.setState(validator.validate({ [name]: value }));
  }

  onSubmit(e) {
    e.preventDefault();
    // if your code doesn't work as expected - it may be caused by
    // desynchronization of your component state and Validator state
    // to check if state in component and Validator are syncronized
    // you can use method validator.isSynchronized(this.state);

    // check validated and prevalidated fields
    if (!Validator.isFormValid()) {
      return;
    }
    this.props.onSubmit(this.state);
  }

  render() {
    const { login, password } = this.state;
    // get error messages from invalid fields, if they were validated.
    // prevalidated fields will receive no error messages, but they cause Validator.isFormValid to return false
    const errors = Validator.getErrors();
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
````

## Creating validation rules

`Rule` is a function, that return true, if the field is valid.

```js
const minAmount = val => val > 10;
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
    message: "Please fill out the password"
  },
  {
    rule: lengthRule(8),
    message: "Password should be at least 8 characters long"
  }
];
```

If there are many rules, the their priority will be similar to the array order.

## Api

### constructor({FieldsDescription})

Describe in the constructor all the fields, that you will check. Like in the [example](#form-example).
You can describe for each field [1 or many rules](#creating-validation-rules).

### initialize({state}, showErrorsOnStart = false)

When you are creating the component state, you can use this method to addValidation/validate the state fields. See the [example](#form-example).
If you want, you can set `showErrorsOnStart` to true, so fields will be validated and you will get all the errors in the first component render.
When you are adding a Validator with `Validator.addValidation` method, all the fields will be prevalidated.
Prevalidation means, that you will get no error message, if the field has not passed a validation rule (`'prevalidation-failed'`).
Validation means, that you will get an error message, if the field has not passed a validation rule (`'validation-failed'`).

### validate({stateChange} | updater | null, showErrors = true)

You should use it inside the this.setState method like it was already described [here](#validation).
If you want, you can set `showErrors` to false, so fields will be only prevalidated and no errors will appear on them.

By default this method only checks those fields, that are passing in `stateChange` object (or in result object of the updater function, if you use it instead of `stateChange`).

using `stateChange`:

```js
this.setState(Validator.validate({ login: e.target.value }));
```

using `updater` function:

```js
this.setState(Validator.validate((prevState => login: e.target.value)));
```

You can simply validate all fields at the same time, passing `null` or `undefined` instead of state argument.

```js
this.setState(Validator.validate());
```

### fieldsToValidate(...fields)

In some cases, when you are updating a single field in state, you need to validate several fields at the same time

```js
this.setState(
  Validator.fieldsToValidate(["amount", "bill"]).validate({
    amount: e.target.value
  })
);
```

### showErrorsOnFields(...fields)

In some cases, you need to choose, where to show error messages.

```js
this.setState(
  Validator.fieldsToValidate(["amount", "bill"])
    .showErrorsOnFields(["amount"])
    .validate({ amount: e.target.value })
);
```

### updateRules({fieldsDescription})

You can use this method o dynamically change the rule.

```js
this.setState(
  Validator.updateRules({
    amount: {
      // fieldName
      amountRule: value => value >= this.props.account // ruleId: ruleFunc
    }
  }).validate({ amount: e.target.value })
);
```

### getErrors()

Use this method inside the render function, like in the [example](#form-example). It will return the object with fields keys and their error messages. If the field is valid there will be an empty error string.

### isFormValid()

Use this method to check, if the form is valid. It will return true, if all the fields in the form are valid. See the [example](#form-example)

### isFieldValid(fieldName)

Use this method to check, if particular field is valid. Returns true if it is valid, false otherwise
