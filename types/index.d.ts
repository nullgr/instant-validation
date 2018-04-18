type Rule = (val: string | boolean, state: object) => boolean;

type RuleData = {
  rule: Rule;
  message: string;
  id?: string;
};

type FieldsDescription = {
  [key: string]: RuleData | RuleData[];
};

export default class Validator<State> {
  constructor(fields: FieldsDescription);

  addValidation(state: State, showErrorsOnStart?: boolean): Readonly<State>;

  validate(
    stateUpdates: (
      prevState: Readonly<State>
    ) => State | { [key in keyof State]: string } | null,
    showErrors?: boolean
  ): ((prevState: Readonly<State>) => State);

  updateRules(updatedRules: { [key: string]: { [key: string]: Rule } }): this;

  fieldsToValidate(fieldsList: Array<[keyof State]>): this;

  showErrorsOnFields(fieldsList: Array<[keyof State]>): this;

  getErrors(state: State): { [key in keyof State]: string };

  isFormValid(state: State): boolean;

  isFieldValid(state: State, fieldName: string): boolean;
}
