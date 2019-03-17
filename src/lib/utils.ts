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
