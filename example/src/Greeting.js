import React from 'react';
import { withMessages, propTypes as MessageSourcePropTypes } from 'react-message-source';

const propTypes = {
  ...MessageSourcePropTypes,
};

function LocalizedLabelComponent(props) {
  const { getMessage } = props;
  return <p>{getMessage('hello.world')}</p>;
}

function PrefixedLocalizedLabelComponent(props) {
  const { getMessage } = props;
  return <p>{getMessage('world')}</p>;
}

function LocalizedLabelWithNamedParamsComponent(props) {
  const { getMessageWithNamedParams } = props;
  return <p>{getMessageWithNamedParams('greeting.with.name', { name: 'John Doe' })}</p>
}

LocalizedLabelComponent.propTypes = propTypes;
PrefixedLocalizedLabelComponent.propTypes = propTypes;
LocalizedLabelWithNamedParamsComponent.propTypes = propTypes;

export const LocalizedLabel = withMessages(LocalizedLabelComponent);
export const LocalizedLabelCurried = withMessages()(LocalizedLabelComponent);
export const PrefixedLocalizedLabel = withMessages('hello')(PrefixedLocalizedLabelComponent);
export const LocalizedLabelWithNamedParams = withMessages(LocalizedLabelWithNamedParamsComponent);
