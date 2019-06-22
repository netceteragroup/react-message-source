import * as React from 'react';
import invariant from 'invariant';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { useMessageSource } from './useMessageSource';

/**
 * Creates a HOC which passes the MessageSourceApi to the given Component.
 */
function enhanceWithMessages(keyPrefix: string | undefined, WrappedComponent: React.ComponentType<any>) {
  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  function WithMessages(props: any) {
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
 * Creates a higher order component and provides the MessageSourceApi as `props`.
 *
 * Example usages:
 *
 * 1. MessageSource.withMessages('keyPrefix')(Component)
 * 2. MessageSource.withMessages(Component)
 * 3. compose(MessageSource.withMessages('keyPrefix'))(Component)
 * 4. compose(MessageSource.withMessages)(Component)
 *
 * @param keyPrefixOrComponent the passed argument ([Component] | [[keyPrefix], [Component]])
 */
export function withMessages(keyPrefixOrComponent?: string | React.ComponentType<any>) {
  if (keyPrefixOrComponent == null || typeof keyPrefixOrComponent === 'string') {
    return function wrapWithMessages(Component: React.ComponentType<any>) {
      return enhanceWithMessages(keyPrefixOrComponent, Component);
    };
  }

  return enhanceWithMessages(undefined, keyPrefixOrComponent);
}
