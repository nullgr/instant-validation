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

const wrongValidationState = {
  login: {
    value: '',
    showError: false,
    statuses: [false]
  },
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

const nextState = {
  email: 'oh god was changed',
  password: ''
};

const superNextState = {
  email: 'oh god was changed',
  password: 'OH NO ME TOO'
};

const expectedNextDifference = {
  email: {
    value: 'oh god was changed',
    showError: true,
    statuses: [false]
  }
};

const expectedSuperNextDifference = {
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

describe('Unit tests for inner implementation of findDifference module', () => {
  test(`Testing initial state run`, () => {
    const difference = findDifference(initialState, validationState);
    expect(difference).toEqual({});
  });

  test(`Testing next state run`, () => {
    const difference = findDifference(nextState, validationState);
    expect(difference).toEqual(expectedNextDifference);
  });

  test(`Testing SUPER next state run`, () => {
    const difference = findDifference(superNextState, validationState);
    expect(difference).toEqual(expectedSuperNextDifference);
  });

  test(`Testing wrong initial state run`, () => {
    const difference = findDifference(initialState, wrongValidationState);
    expect(difference).toEqual({});
  });
});
