import React from 'react';
import { MessageSourceContext } from './MessageSourceContext';
import { getMessageWithNamedParams, getMessageWithParams, NamedParams } from './messages';
import { normalizeKeyPrefix } from './utils';

export interface MessageSourceApi {
  /**
   * Retrieves a text message.
   *
   * Example usage:
   * let name, lastName;
   * ...
   * const message = getMessage('message.key', name, lastName);
   *
   * @param key the key of the message.
   * @param params an optional parameters (param0, param1 ...).
   */
  getMessage: (key: string, ...params: any) => string;

  /**
   * Retrieves a text message with named parameters.
   *
   * Example usage:
   * const parameters = {
   *   name: 'John Doe',
   * }
   *
   * const message = getMessageWithNamedParams('message.key', parameters)
   *
   * @param key the key of the message.
   * @param namedParams a map of named parameters.
   */
  getMessageWithNamedParams: (key: string, namedParams: NamedParams) => string;
}

/**
 * A Hook which which provides the MessageSourceApi.
 *
 * @param keyPrefix an optional prefix which will be prepended to the lookup key.
 */
export function useMessageSource(keyPrefix?: string): MessageSourceApi {
  const textKeys = React.useContext(MessageSourceContext);
  return React.useMemo<MessageSourceApi>(() => {
    const keyPrefixToUse = normalizeKeyPrefix(keyPrefix || '');
    return {
      getMessage(key: string, ...params: any) {
        const textKey = keyPrefixToUse + key;
        const message = getMessageWithParams(textKeys, textKey, ...params);
        if (message === textKey) {
          // retry with key only (no prefix)
          return getMessageWithParams(textKeys, key, ...params);
        }

        return message;
      },

      getMessageWithNamedParams(key: string, namedParams: NamedParams) {
        const textKey = keyPrefixToUse + key;
        const message = getMessageWithNamedParams(textKeys, textKey, namedParams);
        if (message === textKey) {
          // retry with key only (no prefix)
          return getMessageWithNamedParams(textKeys, key, namedParams);
        }

        return message;
      },
    };
  }, [textKeys, keyPrefix]);
}
