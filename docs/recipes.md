# Integration recipes

## React

### useValidator() hook

useValidator.js

<!-- prettier-ignore -->
```js
import { useState } from 'react';
import Validator from 'instant-validation';

function useValidator(rules) {
  const [validator] = useState(new Validator(rules));
  return [validator];
}
export default useValidator;
```

in component

```js
import useValidator from './useValidator';
...
const [v] = useValidator(validationRules);
const { errors } = v.validate(state);
```

### useValidator() hook in TypeScript

useValidator.ts

<!-- prettier-ignore -->
```ts
import * as React from 'react';
import Validator from 'instant-validation';
function useValidator<FieldsState>(rules) {
  const [validator] = React.useState(new Validator<FieldsState>(rules));
  return [validator];
}
export default useValidator;
```

in component

<!-- prettier-ignore -->
```ts
import useValidator from './useValidator';
...
const [v] = useValidator<State>(validationRules);
const { errors } = v.validate(state);
```

### withValidator() HOC

withValidator.js

<!-- prettier-ignore -->
```js
import React from 'react';
import Validator from 'instant-validation';

function withValidator(WrappedComponent, rules) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.validator = new Validator(rules);
    }

    render() {
      return <WrappedComponent {...this.props} validator={this.validator} />;
    }
  };
}

export default withValidator;
```

in component

<!-- prettier-ignore -->
```js
import React from 'react';
import withValidator from './withValidator';

class SomeForm extends React.Component {
  ...
  render () {
    const { validator } = this.props;
    const { errors } = validator.validate(this.state);
  }
  ...
}
export default withValidator(SomeForm, validationRules);
```

### withValidator() HOC in TypeScript

withValidator.ts

<!-- prettier-ignore -->
```js
import * as React from 'react';
import Validator from 'instant-validation';

function returnValidator<FieldsState>(rules) {
  return new Validator<FieldsState>(rules);
}

export type ValidatorInstance = ReturnType<typeof returnValidator>;

function withValidator<OwnProps, FieldsState>(WrappedComponent, rules) {
  return class extends React.Component<OwnProps> {
    validator: ValidatorInstance;

    constructor(props) {
      super(props);
      this.validator = returnValidator<FieldsState>(rules);
    }

    render() {
      return <WrappedComponent {...this.props} validator={this.validator} />;
    }
  };
}

export default withValidator;
```

in component

<!-- prettier-ignore -->
```js
import React from 'react';
import withValidator, { ValidatorInstance } from './withValidator';

interface OwnProps {
  ...
}

interface State {
  ...
}

interface WithValidatorProps {
  validator: ValidatorInstance;
}

class SomeForm extends React.Component<OwnProps & WithValidatorProps> {
  ...
  render () {
    const { validator } = this.props;
    const { errors } = validator.validate(this.state);
  }
  ...
}
export default withValidator<OwnProps, State>(SomeForm, validationRules);
```
