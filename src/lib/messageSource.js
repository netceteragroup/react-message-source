import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { getMessageWithNamedParams, getMessageWithParams } from './messages';
import { normalizeKeyPrefix } from './utils';

/**
 * A React Context which holds the translations map.
 */
const MessageSourceContext = React.createContext(null);

/**
 * Creates a HOC which passes the MessageSourceApi to the given Component.
 */
function enhanceWithMessages(keyPrefix, WrappedComponent) {
  /**
   * The enhancer HOC.
   */
  class Enhancer extends React.Component {
    getMessage = (key, ...params) => getMessageWithParams(this.context, keyPrefix + key, ...params);

    getMessageWithNamedParams = (key, namedParams) =>
      getMessageWithNamedParams(this.context, keyPrefix + key, namedParams);

    render() {
      return (
        <WrappedComponent
          {...this.props}
          getMessage={this.getMessage}
          getMessageWithNamedParams={this.getMessageWithNamedParams}
        />
      );
    }
  }

  Enhancer.contextType = MessageSourceContext;
  Enhancer.displayName = `WithMessages(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return hoistNonReactStatics(Enhancer, WrappedComponent);
}

/**
 * An internal implementation of the argument resolution logic.
 *
 * @param args the passed arguments ([Component] | [[keyPrefix], [Component]])
 */
function internalWithMessages(...args) {
  const [firstArg] = args;
  if (firstArg == null || typeof firstArg === 'string') {
    return enhanceWithMessages.bind(undefined, normalizeKeyPrefix(firstArg || ''));
  }

  return enhanceWithMessages('', firstArg);
}

/**
 * Example usage:
 *
 * const translations = await fetch('/api/rest/texts?lang=en');
 * <MessageSource.Provider value={translations}>
 *   <SomeOtherComponent />
 *   ...
 * </MessageSource.Provider>
 */
export const { Provider } = MessageSourceContext;

/**
 * Example usages:
 *
 * 1. MessageSource.withMessages('keyPrefix')(Component)
 * 2. MessageSource.withMessages(Component)
 * 3. compose(MessageSource.withMessages('keyPrefix'))(Component)
 * 4. compose(MessageSource.withMessages)(Component)
 */
export const withMessages = internalWithMessages;

/**
 * Example usage:
 *
 * Exported just for convenience, in case you want to run propType checks on your component.
 * Note: some bundlers might remove these definitions.
 */
export const propTypes = {
  getMessage: PropTypes.func,
  getMessageWithNamedParams: PropTypes.func,
};
