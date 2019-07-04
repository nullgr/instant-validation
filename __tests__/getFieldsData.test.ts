import { getFieldsData } from '../src/validator/modules';

// TODO add more tests here
describe('Unit tests for getFieldsData module', () => {
  test(`testing common case`, () => {
    const validationState = {
      email: {
        value: 'emailtext',
        showError: false,
        touched: false,
        statuses: [false, true]
      },
      password: {
        value: '',
        showError: false,
        touched: false,
        statuses: [false]
      }
    };
    const expected = {
      email: {
        value: 'emailtext',
        showError: false,
        touched: false,
        statuses: [false, true],
        valid: false
      },
      password: {
        value: '',
        showError: false,
        touched: false,
        statuses: [false],
        valid: false
      }
    };
    const result = getFieldsData(validationState);
    expect(result).toEqual(expected);
  });
});
