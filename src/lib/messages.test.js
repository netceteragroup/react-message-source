import { getMessageWithParams, getMessageWithNamedParams } from './messages';

describe('Messages', () => {
  const textMessages = {
    'simple.key': 'simple value',
    'simple.key.with.placeholders': 'simple value {0} CHF',
    'simple.key.with.repeating.placeholders': 'Simple value {0} CHF, Simple value {0} CHF',
    'key.with.named.placeholders': 'Hello Mr. {name}, on your account you have {amount} {currency}.',
  };

  it('returns the correct message', () => {
    const textKey = 'simple.key';
    const message = getMessageWithParams(textMessages, textKey);
    expect(message).toBe('simple value');
  });

  it('returns the correct message with placeholders', () => {
    const textKey = 'simple.key.with.placeholders';
    const message = getMessageWithParams(textMessages, textKey, 10000);
    expect(message).toBe('simple value 10000 CHF');
  });

  it('returns the correct message with all placeholders replaced', () => {
    const textKey = 'simple.key.with.repeating.placeholders';
    const message = getMessageWithParams(textMessages, textKey, 10000);
    expect(message).toBe('Simple value 10000 CHF, Simple value 10000 CHF');
  });

  it('returns the key when message can not be found', () => {
    const textKey = 'missing.textKey';
    const message = getMessageWithParams(textMessages, textKey);
    expect(message).toBe(textKey);
  });

  it('returns the correct message with named placeholders', () => {
    const params = {
      name: 'John Doe',
      amount: 15000,
      currency: 'CHF',
    };
    const textKey = 'key.with.named.placeholders';
    const message = getMessageWithNamedParams(textMessages, textKey, params);
    expect(message).toBe('Hello Mr. John Doe, on your account you have 15000 CHF.');
  });
});
