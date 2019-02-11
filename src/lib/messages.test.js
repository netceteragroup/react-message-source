import { getMessageWithParams } from './messages';

describe('Messages', () => {
  const textMessages = {
    'simple.key': 'simple value',
    'simple.key.with.placeholders': 'simple value {0} CHF',
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

  it('returns the key when message can not be found', () => {
    const textKey = 'missing.textKey';
    const message = getMessageWithParams(textMessages, textKey);
    expect(message).toBe(textKey);
  });
});
