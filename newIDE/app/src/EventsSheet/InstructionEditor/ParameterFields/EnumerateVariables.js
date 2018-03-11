// @flow
import flatten from 'lodash/flatten';
import { mapFor } from '../../../Utils/MapFor';

export const enumerateVariables = (
  variablesContainer: ?gdVariablesContainer
) => {
  if (!variablesContainer) {
    return [];
  }

  const enumerateVariableAndChildrenNames = (
    fullName: string,
    variable: gdVariable
  ): Array<string> => {
    const names = [fullName];
    if (!variable.isStructure()) return names;

    variable
      .getAllChildren()
      .keys()
      .toJSArray()
      .forEach(childName => {
        enumerateVariableAndChildrenNames(
          `${fullName}.${childName}`,
          variable.getChild(childName)
        ).forEach(name => {
          names.push(name);
        });
      });

    return names;
  };

  return flatten(
    mapFor(0, variablesContainer.count(), i => {
      if (!variablesContainer) return [];

      const variableAndName = variablesContainer.getAt(i);
      return enumerateVariableAndChildrenNames(
        variableAndName.getName(),
        variableAndName.getVariable()
      );
    })
  );
};
