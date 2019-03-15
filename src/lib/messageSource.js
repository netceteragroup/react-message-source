import React from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { useMessageSource } from './useMessageSource';

/**
 * Creates a HOC which passes the MessageSourceApi to the given Component.
 */
function enhanceWithMessages(keyPrefix, WrappedComponent) {
  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  /**
   * The enhancer HOC.
   */
  function Enhancer(props) {
    const messageSourceApi = useMessageSource(keyPrefix);
    if (process.env.NODE_ENV !== 'production') {
      const hasOwn = Object.prototype.hasOwnProperty;
      const propsToOverwrite = Object.keys(messageSourceApi)
        .filter(propToCheck => hasOwn.call(props, propToCheck))
        .join(', ');

      invariant(
        !propsToOverwrite,
        `[react-message-source]: [%s] already has props named [%s]. They will be overwritten.`,
        wrappedComponentName,
        propsToOverwrite,
      );
    }

    return <WrappedComponent {...props} {...messageSourceApi} />;
  }

  Enhancer.displayName = `WithMessages(${wrappedComponentName})`;
  return hoistNonReactStatics(Enhancer, WrappedComponent);
}

/**
 * An internal implementation of the argument resolution logic.
 *
 * @param keyPrefixOrComponent the passed argument ([Component] | [[keyPrefix], [Component]])
 */
function internalWithMessages(keyPrefixOrComponent) {
  if (keyPrefixOrComponent == null || typeof keyPrefixOrComponent === 'string') {
    // consumer used the curried API
    return enhanceWithMessages.bind(undefined, keyPrefixOrComponent);
  }

  return enhanceWithMessages(null, keyPrefixOrComponent);
}

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
 * Note: some bundlers might remove these definitions during build time.
 */
export const propTypes = {
  getMessage: PropTypes.func,
  getMessageWithNamedParams: PropTypes.func,
};
