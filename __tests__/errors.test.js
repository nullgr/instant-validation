import { createValidator } from "./testUtils";
import Validation from "../build/index";
import { requiredRule } from "../build/rules";

describe("Unit tests for wrong using of Validation class", () => {
  test("should throw error if Validator wasn't created correctly", () => {
    expect(() => {
      new Validation(123);
    }).toThrowError("Invalid fields parameter for fields, must be object");

    expect(() => {
      new Validation("122");
    }).toThrowError("Invalid fields parameter for fields, must be object");

    expect(() => {
      new Validation(() => {});
    }).toThrowError("Invalid fields parameter for fields, must be object");
  });

  test("shouldn't throw error if Validtor was created correctly", () => {
    new Validation({
      login: [
        {
          rule: requiredRule
        }
      ]
    });
  });
  testFailingOfValidatorMethod("validate");
  testFailingOfValidatorMethod("updateRules");
  testFailingOfValidatorMethod("isFormValid");
  testFailingOfValidatorMethod("isFieldValid");
  testFailingOfValidatorMethod("getErrors");
});

function testFailingOfValidatorMethod(functionName) {
  const Validator = createValidator(false);

  test(`should throw error if Validator.${functionName} was invoked before Validator.addValidation`, () => {
    expect(() => {
      Validator[functionName]();
    }).toThrowError(
      `It seems that you didn't invoke addValidation method and try to invoke`
    );
  });
}
