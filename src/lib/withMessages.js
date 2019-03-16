import React from 'react';
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
  function WithMessages(props) {
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

    // eslint-disable-next-line react/prop-types
    const { forwardedRef, ...rest } = props;
    return <WrappedComponent {...rest} {...messageSourceApi} ref={forwardedRef} />;
  }

  WithMessages.displayName = `WithMessages(${wrappedComponentName})`;

  return hoistNonReactStatics(
    React.forwardRef((props, ref) => <WithMessages {...props} forwardedRef={ref} />),
    WrappedComponent,
  );
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
