import { MessageSourceContextShape } from './MessageSourceContext';

export type NamedParams = {
  [paramName: string]: any,
};

/**
 * Retrieves a text message.
 *
 * @param textMessages a map which holds the translation pairs.
 * @param textKey the key of the message.
 * @param params optional placeholder parameters.
 * @returns {*} the message or the key itself.
 */
export function getMessageWithParams(textMessages: MessageSourceContextShape, textKey: string, ...params: any[]) {
  const message = textMessages[textKey] || textKey;
  return params.reduce((msg, current, index) => msg.replace(new RegExp(`\\{${index}\\}`, 'g'), current), message);
}

/**
 * Retrieves a text message.
 *
 * @param textMessages a map which holds the translation pairs.
 * @param textKey the key of the message.
 * @param namedParams an optional placeholder parameters.
 * @returns {*} the message or the key itself.
 */
export function getMessageWithNamedParams(
  textMessages: MessageSourceContextShape,
  textKey: string,
  namedParams: NamedParams,
) {
  const message = textMessages[textKey] || textKey;
  return Object.keys(namedParams || {}).reduce(
    (msg, param) => msg.replace(new RegExp(`\\{${param}\\}`, 'g'), namedParams[param]),
    message,
  );
}
