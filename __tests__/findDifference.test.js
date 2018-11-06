import { findDifference } from '../src/modules';

const initialState = {
  email: '',
  password: ''
};

const validationState = {
  email: {
    value: '',
    showError: false,
    statuses: [false]
  },
  password: {
    value: '',
    showError: false,
    statuses: [false]
  }
};

describe('Unit tests for inner implementation of findDifference module', () => {
  test(`Testing initial state run`, () => {
    const difference = findDifference(initialState, validationState);
    expect(difference).toEqual({});
  });

  test(`Testing one field state change run`, () => {
    const nextState = {
      email: 'oh god was changed',
      password: ''
    };

    const expectedNextDifference = {
      email: {
        value: 'oh god was changed',
        showError: true,
        statuses: [false]
      }
    };

    const difference = findDifference(nextState, validationState);
    expect(difference).toEqual(expectedNextDifference);
  });

  test(`Testing two fields state change run`, () => {
    const nextState = {
      email: 'oh god was changed',
      password: 'OH NO ME TOO'
    };

    const expectedNextDifference = {
      email: {
        value: 'oh god was changed',
        showError: true,
        statuses: [false]
      },
      password: {
        value: 'OH NO ME TOO',
        showError: true,
        statuses: [false]
      }
    };

    const difference = findDifference(nextState, validationState);
    expect(difference).toEqual(expectedNextDifference);
  });

  test(`Testing extended state run`, () => {
    const extendedState = {
      email: '',
      password: '',
      message: 'i`m new here, whats up?'
    };

    const difference = findDifference(extendedState, validationState);
    expect(difference).toEqual({});
  });
});
