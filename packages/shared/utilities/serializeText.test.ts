import { describe, expect, it } from 'vitest';

import { serializeText } from './serializeText';

describe('serializeText', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(serializeText('Hello World')).toBe('hello-world');
  });

  it('removes leading and trailing whitespace', () => {
    expect(serializeText('  Leading Trailing  ')).toBe('leading-trailing');
  });

  it('replaces special characters with a single hyphen', () => {
    expect(serializeText('100% Done!!!')).toBe('100-done');
  });

  it('collapses consecutive non-alphanumeric chars into one hyphen', () => {
    expect(serializeText('foo & bar')).toBe('foo-bar');
  });

  it('does not add leading or trailing hyphens', () => {
    const result = serializeText('!hello!');
    expect(result.startsWith('-')).toBe(false);
    expect(result.endsWith('-')).toBe(false);
  });

  it('returns an already clean slugified string unchanged', () => {
    expect(serializeText('slug-value')).toBe('slug-value');
  });

  it('handles an empty string', () => {
    expect(serializeText('')).toBe('');
  });
});
