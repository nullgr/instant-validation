# instant-validation

- quick setup
- framework agnostic
- zero dependencies
- tiny bundle size

**Size**: ~6.5k, ~1.7k gzip’d,

Why to use:

1. All the validation state management of your form is under the hood.
2. Incapsulation of all logic related to validation,
   you should only call needed method and library will care about details
3. Easy integration

```
$ npm install --save instant-validation
```

### A simple validator creation example

```js
import Validator from 'instant-validation';

const validator = new Validator({
  name: [
    {
      rule: value => !!value,
      message: 'Please enter your name'
    }
  ]
});
```

### Rules

Each rule is a function and it should return `true` for a valid case and `false` for invalid.
Each field should contain an array with minimum 1 rule

You can import ready to use rules

```js
import { requiredRule, lengthRule } from 'instant-validation/rules';
```

Right now there are only two rules - `requiredRule` and `lengthRule`
but we are going to add some other useful rules in future releases.

### React Form example

Here is the example of a simple React form for creating an account

```js
import * as React from 'react';
import Validator from 'instant-validation';
import { requiredRule, lengthRule } from 'instant-validation/rules';
import { emailRule } from './myCustomRules';

const validator = new Validator({
  name: [
    {
      rule: requiredRule,
      message: 'Please enter your name'
    },
    {
      rule: lengthRule(2),
      message: 'Your name should be at least 2 characters'
    }
  ],
  email: [
    {
      rule: requiredRule,
      message: 'Please enter an email'
    },
    {
      rule: emailRule,
      message: 'Please enter a valid email'
    }
  ],
  password: [
    {
      rule: requiredRule,
      message: 'Please enter password'
    }
  ],
  repeatPassword: [
    {
      rule: requiredRule,
      message: 'Please repeat password'
    },
    {
      // passwrodOriginal will appear here trough the insertArgs method
      rule: (value, passwrodOriginal) => value === passwrodOriginal,
      message: 'Passwords are not equal',
      ruleId: 'passwordEqual'
    }
  ]
});

class RegistrationForm extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      name: '',
      email: '',
      password: '',
      passwordRepeat: ''
    };
  }

  onChange(e) {
    this.setState({ [name]: e.target.value });
  }

  render() {
    const { email, password, passwordRepeat } = this.state;
    const { errors } = validator
      // if you have some rules with many arguments, you can pass those arguments like this
      .insertArgs({
        passwordEqual: [password]
      })
      .validate(this.state);
    return (
      <form>
        <input name="name" value={name} onChange={this.onChange} />
        <div className="error">{errors.name}</div>

        <input name="email" value={email} onChange={this.onChange} />
        <div className="error">{errors.email}</div>

        <input name="password" value={password} onChange={this.onChange} />
        <div className="error">{errors.password}</div>

        <input
          name="passwordRepeat"
          value={passwordRepeat}
          onChange={this.onChange}
        />
        <div className="error">{errors.passwordRepeat}</div>

        <button
          onClick={this.onSubmit}
          type="submit"
          disabled={!validator.isFormValid()}
        >
          Enter
        </button>
      </form>
    );
  }
}

export default RegistrationForm;
```

## Api

### validate({ fieldsState })

Get `errors` object with errormessages using validate method. You should call this method each time, when you have updates in your field values.
Validator will apply and recalculate rules only for fields, that were changed.

```js
const { errors } = validator.validate(fieldsState);
```

If you need a detailed information for each field, you can get `fields` object

```js
const { errors, fields } = validator.validate(fieldsState);
```

Each field contains information

- showError: boolean (should it show the error message)
- statuses: boolean[] (array of booleans with the validation result for each rule)
- touched: boolean (if this field has changed a value ever)
- valid: boolean (if this field is valid)
- value: any (original value of the field)

### isFormValid()

Just returns a boolean status of the whole form.

### showAllErrors(show = true)

You can use this method, if you want to show all the untouched field errors. (For exmaple, if your submit-button is always enabled.)
To reset error higlighting to initial state (all error messages are hidden by default), you can invoke `showAllErrors(false)`.
Please, don't forget to manually re-render your form, after calling this method.
Here an example for React.js

```js
// submit button callback
onFormSend() {
  validator.showAllErrors();
  this.setState({ submitPressed: true }); // update component state, to invoke re-render
  if (!validator.isFormValid()) {
    return; // do no send invalid form
  }
  this.props.send(this.state.field);
};
```

### insertArgs({ [ruleId]: [...additionalArguments] })

Some of the rules can be related to other fields.
This means that you should have more than 1 argument in the rule.
You can provide additional argument to such rules using this method.
Don't forget to name the rule with `ruleId` for that

```js
  {
    rule: (value, otherFieldValue) => value > otherFieldValue,
    message: 'Field should be greater than another',
    ruleId: 'greaterRule'
  }
```

```js
const { errors } = validator
  .insertArgs({
    greaterRule: [otherField]
  })
  .validate(this.state);
```
