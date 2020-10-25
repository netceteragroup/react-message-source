/**
 * Checks whether the given String ends with the given suffix.
 *
 * @param str the string to test.
 * @param suffix the suffix to check.
 * @return {boolean}
 */
const endsWith = (str: string, suffix: string) => str.indexOf(suffix, str.length - suffix.length) >= 0;

/**
 * Normalizes the given keyPrefix to a defined format.
 *
 * @param keyPrefix the prefix to normalize.
 */
export const normalizeKeyPrefix = (keyPrefix: string) =>
  keyPrefix.length > 0 && !endsWith(keyPrefix, '.') ? `${keyPrefix}.` : keyPrefix;

/**
 * Logs that there was an error in retrieving the translation map.
 */
export const logTranslationsNOK = () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[react-message-source] Failed to get proper translations. Setting an empty translation map.');
  }
};
