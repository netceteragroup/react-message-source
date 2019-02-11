import React from 'react';
import PropTypes from 'prop-types';
import { withMessages } from 'react-message-source';

const propTypes = {
  getMessage: PropTypes.func,
};

function LocalizedLabelComponent(props) {
  const { getMessage } = props;
  return <p>{getMessage('hello.world')}</p>;
}

function PrefixedLocalizedLabelComponent(props) {
  const { getMessage } = props;
  return <p>{getMessage('world')}</p>;
}

LocalizedLabelComponent.propTypes = propTypes;
PrefixedLocalizedLabelComponent.propTypes = propTypes;

export const LocalizedLabel = withMessages(LocalizedLabelComponent);
export const LocalizedLabelCurried = withMessages()(LocalizedLabelComponent);
export const PrefixedLocalizedLabel = withMessages('hello')(PrefixedLocalizedLabelComponent);
