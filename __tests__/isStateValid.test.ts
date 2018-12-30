import { isStateValid } from '../src/modules';

describe('Unit tests for isStateValid module', () => {
  test(`State should be valid`, () => {
    const validationState = {
      email: {
        value: '',
        showError: false,
        statuses: [true, true]
      },
      password: {
        value: '',
        showError: false,
        statuses: [true]
      }
    };
    expect(isStateValid(validationState)).toEqual(true);
  });
  test(`State should be not valid`, () => {
    const validationState = {
      email: {
        value: '',
        showError: false,
        statuses: [true, false]
      },
      password: {
        value: '',
        showError: false,
        statuses: [true]
      }
    };
    expect(isStateValid(validationState)).toEqual(false);
  });
});
