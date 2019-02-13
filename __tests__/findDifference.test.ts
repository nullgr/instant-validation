import { findDifference } from '../src/modules';

describe('Unit tests for findDifference module', () => {
  test(`Testing initial state run`, () => {
    const validationState = {
      email: {
        value: '',
        showError: false,
        statuses: [false],
        touched: false,
      },
      password: {
        value: '',
        showError: false,
        statuses: [false],
        touched: false,
      }
    };
    const initialState = {
      email: '',
      password: ''
    };
    const expectedNextDifference = {};
    const difference = findDifference(initialState, validationState);
    expect(difference).toEqual(expectedNextDifference);
  });

  test(`Testing one field state change run`, () => {
    const validationState = {
      email: {
        value: '',
        showError: false,
        statuses: [false],
        touched: true,
      },
      password: {
        value: '',
        showError: false,
        statuses: [false],
        touched: false,
      }
    };
    const nextState = {
      email: 'a',
      password: ''
    };
    const expectedNextDifference = {
      email: 'a'
    };

    const difference = findDifference(nextState, validationState);
    expect(difference).toEqual(expectedNextDifference);
  });

  test(`Testing two fields state change run`, () => {
    const validationState = {
      email: {
        value: '',
        showError: false,
        statuses: [false],
        touched: false,
      },
      password: {
        value: '',
        showError: false,
        statuses: [false],
        touched: false,
      }
    };
    const nextState = {
      email: 'someMail@mail.com',
      password: 'somepassword'
    };

    const expectedNextDifference = {
      email: 'someMail@mail.com',
      password: 'somepassword'
    };

    const difference = findDifference(nextState, validationState);
    expect(difference).toEqual(expectedNextDifference);
  });

  test(`Testing extended state run`, () => {
    const validationState = {
      email: {
        value: '',
        showError: false,
        statuses: [false],
        touched: false,
      },
      password: {
        value: '',
        showError: false,
        statuses: [false],
        touched: false,
      }
    };
    const extendedState = {
      email: '',
      password: '',
      message: 'no need to validate'
    };

    const difference = findDifference(extendedState, validationState);
    expect(difference).toEqual({});
  });
});
