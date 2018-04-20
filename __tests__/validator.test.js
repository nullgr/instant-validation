import { createValidator, LENGTH_ERROR, ERROR_EMPTY } from "./testUtils";

function getInitialState() {
  return {
    login: "",
    password: "",
    repeatPass: "",
    accept: false
  };
}

// TODO: test fieldsToValidate, showErrorsOnFields, updateRules

describe("Unit tests for inner implementation of Validator class", () => {
  test(`Validator.addValidation(state) should set properties on validationStorage and 
      return state passed in arguments`, () => {
    const Validator = createValidator(false);
    const state = getInitialState();
    const resultState = Validator.addValidation(state);

    const validationStorage = {
      accept: ["prevalidation-failed"],
      login: ["prevalidation-failed", "prevalidation-failed"],
      password: ["prevalidation-failed", "validation-passed"],
      repeatPass: ["prevalidation-failed", "validation-passed"]
    };

    expect(Validator.validationStorage).toEqual(validationStorage);
    expect(state).toEqual(resultState);
  });

  test("getErrors returns state properties with empty strings", () => {
    const Validator = createValidator(false);
    const state = getInitialState();
    Validator.addValidation(state);

    expect(Validator.getErrors()).toEqual({
      accept: "",
      login: "",
      password: "",
      repeatPass: ""
    });
  });

  test(`Validator.validate({login: value}): 
        1) updates inner validationStorage field
        2) returns stateSnaphot {login: value}
        3) After its execution getErrors() returns object with error message for login field`, () => {
    const Validator = createValidator(false);
    const state = getInitialState();
    Validator.addValidation(state);

    const value = "pit";

    const stateSnapshot = Validator.validate({
      login: value
    })(state);

    const expectedValidationStorage = {
      accept: ["prevalidation-failed"],
      login: ["validation-passed", "validation-failed"],
      password: ["prevalidation-failed", "validation-passed"],
      repeatPass: ["prevalidation-failed", "validation-passed"]
    };

    const expectedStateSnapshot = {
      login: value
    };

    const expectedErrorsObject = {
      accept: "",
      login: LENGTH_ERROR,
      password: "",
      repeatPass: ""
    };

    expect(Validator.validationStorage).toEqual(expectedValidationStorage);
    expect(stateSnapshot).toEqual(expectedStateSnapshot);
    expect(Validator.getErrors()).toEqual(expectedErrorsObject);
  });

  test(`Validator.validate(updaterFunction):
          1) updates inner validationStorage field
          2) returns stateSnaphot {login: value, password: value, repeatPass: value}
          3) After its execution getErrors() returns object with empty strings as a values`, () => {
    const Validator = createValidator(false);
    const state = getInitialState();
    Validator.addValidation(state);

    const loginVal = "peterson";
    const passwordVal = "123456789a";
    const passwordRVal = "123456789a";

    const updaterFunction = prevState => ({
      login: loginVal,
      password: passwordVal,
      repeatPass: passwordRVal
    });

    const updater = Validator.validate(updaterFunction);

    const stateSnapshot = updater(state);

    const expectedValidationStorage = {
      accept: ["prevalidation-failed"],
      login: ["validation-passed", "validation-passed"],
      password: ["validation-passed", "validation-passed"],
      repeatPass: ["validation-passed", "validation-passed"]
    };

    const expectedStateSnaphot = {
      login: loginVal,
      password: passwordVal,
      repeatPass: passwordRVal
    };

    const expectedErrorsObject = {
      accept: "",
      login: "",
      password: "",
      repeatPass: ""
    };

    expect(Validator.validationStorage).toEqual(expectedValidationStorage);
    expect(stateSnapshot).toEqual(expectedStateSnaphot);
    expect(Validator.getErrors()).toEqual(expectedErrorsObject);
  });

  test(`Validator.isFormValid() method:
          1) returns false at once after addValidation was invoked
          2) returns true after validation with valid fields
          3) returns false after invalidation one field`, () => {
    const Validator = createValidator(false);
    const state = getInitialState();
    Validator.addValidation(state);
    expect(Validator.isFormValid()).toEqual(false);

    const stateSnapshot = Validator.validate({
      login: "login123",
      password: "password123",
      repeatPass: "password123",
      accept: true
    })(state);

    expect(Validator.isFormValid()).toEqual(true);

    Validator.validate({
      login: "",
      password: "password123",
      repeatPass: "password123",
      accept: true
    })({ ...state, stateSnapshot });

    expect(Validator.isFormValid()).toEqual(false);
  });

  test(`Validator.isFieldValid(login) method:
          1) returns false at once after addValidation was invoked
          2) returns true after validation with valid login field
          3) returns false after invalidation login field`, () => {
    const Validator = createValidator(false);
    const state = getInitialState();
    Validator.addValidation(state);
    expect(Validator.isFieldValid("login")).toEqual(false);

    const stateSnapshot = Validator.validate({
      login: "login123"
    })(state);

    expect(Validator.isFieldValid("login")).toEqual(true);

    Validator.validate({
      login: ""
    })({ ...state, stateSnapshot });

    expect(Validator.isFieldValid("login")).toEqual(false);
  });

  test("Test of following methods together: addValidation, isFormValid, isFieldValid, validate, getErrors", () => {
    const Validator = createValidator(false);
    const state = Validator.addValidation(getInitialState());

    // 1. check on start
    expect(Validator.isFieldValid("login")).toEqual(false);
    expect(Validator.isFieldValid("password")).toEqual(false);
    expect(Validator.isFormValid()).toEqual(false);
    expect(Validator.getErrors()).toEqual({
      accept: "",
      login: "",
      password: "",
      repeatPass: ""
    });

    let stateSnapshot = Validator.validate({
      accept: false,
      login: "",
      password: "1231231231313",
      repeatPass: "1231231231313"
    })(state);

    // 2. check after form is partially valid

    expect(stateSnapshot).toEqual({
      accept: false,
      login: "",
      password: "1231231231313",
      repeatPass: "1231231231313"
    });
    expect(Validator.isFieldValid("login")).toEqual(false);
    expect(Validator.isFieldValid("password")).toEqual(true);
    expect(Validator.isFieldValid("repeatPass")).toEqual(true);
    expect(Validator.isFormValid()).toEqual(false);
    expect(Validator.getErrors()).toEqual({
      accept: ERROR_EMPTY,
      login: ERROR_EMPTY,
      password: "",
      repeatPass: ""
    });

    stateSnapshot = Validator.validate({
      login: "12312312313",
      accept: true
    })({ ...state, stateSnapshot });

    // 2. check after form is fully valid
    expect(stateSnapshot).toEqual({
      login: "12312312313",
      accept: true
    });
    expect(Validator.isFieldValid("login")).toEqual(true);
    expect(Validator.isFieldValid("password")).toEqual(true);
    expect(Validator.isFieldValid("repeatPass")).toEqual(true);
    expect(Validator.isFormValid()).toEqual(true);
    expect(Validator.getErrors()).toEqual({
      accept: "",
      login: "",
      password: "",
      repeatPass: ""
    });
  });
});
