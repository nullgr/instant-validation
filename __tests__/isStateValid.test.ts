import { isStateValid } from '../src/validator/modules';

describe('Unit tests for isStateValid module', () => {
  test(`State should be valid`, () => {
    const validationState = {
      email: {
        value: '',
        showError: false,
        statuses: [true, true],
        touched: true
      },
      password: {
        value: '',
        showError: false,
        statuses: [true],
        touched: true
      }
    };
    expect(isStateValid(validationState)).toEqual(true);
  });
  test(`State should be not valid`, () => {
    const validationState = {
      email: {
        value: '',
        showError: false,
        statuses: [true, false],
        touched: true
      },
      password: {
        value: '',
        showError: false,
        statuses: [true],
        touched: true
      }
    };
    expect(isStateValid(validationState)).toEqual(false);
  });
});
