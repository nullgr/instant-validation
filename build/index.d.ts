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
  constructor(fields: FieldsDescription, validationStorageName?: string);

  // 'State' type in methods below is right only in argument of addValidation method
  //
  // In all another methods 'State' type is incorrect,
  // in real scenario it contains one more field [validationStorageName]
  //
  // In most cases user of library shouldn't care about [validationStorageName] field
  // in component state, so this inaccuracy isn't very serious, but at the same time
  // it simplifies the use of library

  addValidation(state: State, showErrorsOnStart?: boolean): Readonly<State>;

  validate(
    stateUpdates: (prevState: Readonly<State>) => State,
    showErrors?: boolean
  ): ((prevState: Readonly<State>) => State);

  validate(
    stateUpdates?: { [key in keyof State]: string } | null,
    showErrors?: boolean
  ): Readonly<State>;

  getErrors(state: State): { [key in keyof State]: string };

  isFormValid(state: State): boolean;

  isFieldValid(state: State, fieldName: string): boolean;
}
