// @flow
import { Trans } from '@lingui/macro';
import { t } from '@lingui/macro';

import * as React from 'react';
import SelectField from '../UI/SelectField';
import SelectOption from '../UI/SelectOption';
import {
  enumerateObjectTypes,
  type EnumeratedObjectMetadata,
} from '../ObjectsList/EnumerateObjects';

type Props = {|
  project: gdProject,
  floatingLabelText?: React.Node,
  value: string,
  onChange: string => void,
  disabled?: boolean,
  allowedObjectTypes?: ?Array<string>,
|};
type State = {|
  objectMetadata: Array<EnumeratedObjectMetadata>,
|};

export default class ObjectTypeSelector extends React.Component<Props, State> {
  state: State = {
    objectMetadata: enumerateObjectTypes(this.props.project),
  };

  render(): React.Node {
    const {
      disabled,
      value,
      onChange,
      floatingLabelText,
      allowedObjectTypes,
    } = this.props;
    const { objectMetadata } = this.state;

    const isDisabled = (type: string) => {
      if (!allowedObjectTypes) return false;

      return allowedObjectTypes.indexOf(type) === -1;
    };

    return (
      <SelectField
        floatingLabelText={floatingLabelText || <Trans>Object type</Trans>}
        value={value}
        onChange={(e, i, value: string) => {
          onChange(value);
        }}
        disabled={disabled}
        fullWidth
      >
        <SelectOption
          value=""
          primaryText={t`Any object`}
          disabled={isDisabled('')}
        />
        {objectMetadata.map((metadata: EnumeratedObjectMetadata) => {
          if (metadata.name === '') {
            // Base object is an "abstract" object
            return null;
          }

          return (
            <SelectOption
              key={metadata.name}
              value={metadata.name}
              primaryText={metadata.fullName}
              disabled={isDisabled(metadata.name)}
            />
          );
        })}
      </SelectField>
    );
  }
}
