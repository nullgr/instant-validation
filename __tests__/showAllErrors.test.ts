import { showAllErrors } from '../src/modules';

describe('Unit tests for showAllErrors module', () => {
  test(`All fields must get 'showError' as true`, () => {
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
    const espectedValidationState = {
      email: {
        value: '',
        showError: true,
        statuses: [true, true]
      },
      password: {
        value: '',
        showError: true,
        statuses: [true]
      }
    };
    expect(showAllErrors(validationState, true)).toEqual(
      espectedValidationState
    );
  });
  test(`All fields must get 'showError' as false`, () => {
    const validationState = {
      email: {
        value: '',
        showError: false,
        statuses: [true, true]
      },
      password: {
        value: '',
        showError: true,
        statuses: [true]
      }
    };
    const espectedValidationState = {
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
    expect(showAllErrors(validationState, false)).toEqual(
      espectedValidationState
    );
  });
});
