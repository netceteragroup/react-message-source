/**
 * Retrieves a text message.
 *
 * @param textMessages a map which holds the translation pairs.
 * @param textKey the key of the message.
 * @param params optional placeholder parameters.
 * @returns {*} the message or the key itself.
 */
export function getMessageWithParams(textMessages, textKey, ...params) {
  const message = textMessages[textKey];
  if (!message) {
    return textKey;
  }

  return params.reduce((msg, current, index) => msg.replace(`{${index}}`, current), message);
}
