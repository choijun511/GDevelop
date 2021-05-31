// @flow
import type { Node } from 'React';
import { Trans } from '@lingui/macro';

import React, { Component } from 'react';
import ResourceSelector from '../../ResourcesList/ResourceSelector';
import ResourcesLoader from '../../ResourcesLoader';
import { type ParameterFieldProps } from './ParameterFieldCommons';

export default class AudioResourceField extends Component<
  ParameterFieldProps,
  void
> {
  _field: ?ResourceSelector;

  focus() {
    if (this._field) this._field.focus();
  }

  render(): null | Node {
    if (
      !this.props.resourceSources ||
      !this.props.onChooseResource ||
      !this.props.resourceExternalEditors ||
      !this.props.project
    ) {
      console.error(
        'Missing project, resourceSources, onChooseResource or resourceExternalEditors for AudioResourceField'
      );
      return null;
    }

    return (
      <ResourceSelector
        margin={this.props.isInline ? 'none' : 'dense'}
        project={this.props.project}
        resourceSources={this.props.resourceSources}
        onChooseResource={this.props.onChooseResource}
        resourceExternalEditors={this.props.resourceExternalEditors}
        resourcesLoader={ResourcesLoader}
        resourceKind="audio"
        fullWidth
        initialResourceName={this.props.value}
        onChange={this.props.onChange}
        floatingLabelText={<Trans>Choose the audio file to use</Trans>}
        onRequestClose={this.props.onRequestClose}
        ref={field => (this._field = field)}
      />
    );
  }
}
