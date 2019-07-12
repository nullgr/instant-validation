import { ChangedArgsFields, InsertedArgs, RuleIdsInFields } from '../types';

function findArgsDifference(
  newArguments: InsertedArgs,
  insertedArgs: InsertedArgs,
  ruleIdsInFields: RuleIdsInFields
): ChangedArgsFields {
  return Object.keys(newArguments).reduce(
    (updatedArgs: ChangedArgsFields, key: string): ChangedArgsFields => {
      newArguments[key].forEach((newArg: any, index: number) => {
        if (insertedArgs[key][index] !== newArg) {
          updatedArgs = [...updatedArgs, ...ruleIdsInFields[key]];
        }
      });
      return updatedArgs;
    },
    []
  );
}

export { findArgsDifference };
