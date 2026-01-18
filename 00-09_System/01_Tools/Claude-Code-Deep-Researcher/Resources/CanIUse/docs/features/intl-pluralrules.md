# Intl.PluralRules API

## Overview

The `Intl.PluralRules` API provides language-aware plural form selection for internationalized applications. It allows developers to format numbers and display appropriate plural forms based on language-specific rules, enabling proper localization of content for different languages and cultures.

## Description

The Intl.PluralRules API is used for plural-sensitive formatting and determining plural language rules. Different languages have different rules for pluralization - some use simple singular/plural distinctions, while others have more complex rules. This API abstracts those rules and provides a standard way to determine which plural form to use for a given number in a specific language.

## Specification

- **Specification URL**: [ECMAScript Internationalization API Specification - Intl.PluralRules](https://tc39.es/ecma402/#sec-intl-pluralrules-constructor)
- **Status**: Standardized (ECMA-402)
- **Stage**: Standardized

## Categories

- JavaScript (JS)
- Internationalization

## Benefits and Use Cases

### Key Benefits

- **Language-Aware Pluralization**: Automatically select correct plural forms based on language rules
- **Internationalization Support**: Essential for building truly global applications
- **Standards-Based**: Follows ECMA-402 internationalization standards
- **No Polyfills Needed**: Modern browsers provide native implementation
- **Performance**: Native implementation is faster than custom solutions
- **Consistency**: Ensures consistent plural handling across all locales

### Common Use Cases

1. **E-Commerce**: Display correct plural forms for quantities ("1 item", "2 items")
2. **Content Management**: Manage plural forms in user-generated content
3. **Notifications**: Show proper grammar in plural notifications ("You have 1 message" vs "You have 5 messages")
4. **Analytics**: Display statistics with proper plural forms
5. **Localized Applications**: Any app serving multiple languages where plural rules matter
6. **Message Formatting**: Proper formatting of messages with dynamic counts
7. **User Interface Labels**: Item counts, file counts, and other quantified labels

## Browser Support

| Browser | First Support | Version Notes |
|---------|---------------|---------------|
| **Chrome** | 63+ | Full support from Chrome 63 onward |
| **Edge** | 79+ | Full support from Edge 79 onward (Chromium-based) |
| **Firefox** | 58+ | Full support from Firefox 58 onward |
| **Safari** | 13+ | Full support from Safari 13 onward |
| **Opera** | 50+ | Full support from Opera 50 onward |
| **iOS Safari** | 13.0+ | Full support from iOS Safari 13.0 onward |
| **Android Browser** | 142+ | Full support in latest Android browsers |
| **Samsung Internet** | 8.2+ | Full support from Samsung Internet 8.2 onward |

### Desktop Browser Support Matrix

| Browser | Not Supported | Partial Support | Full Support |
|---------|---------------|-----------------|--------------|
| Internet Explorer | 5.5 - 11 | - | - |
| Edge (Legacy) | 12 - 18 | 18* | 79+ |
| Chrome | 4 - 62 | - | 63+ |
| Firefox | 2 - 57 | - | 58+ |
| Safari | 3.1 - 12.1 | - | 13+ |
| Opera | 9 - 49 | - | 50+ |

*Edge 18 had partial support where Intl.PluralRules existed but methods were not implemented.

### Mobile Browser Support Matrix

| Browser | First Support |
|---------|---------------|
| iOS Safari | 13.0+ |
| Android Browser | 142+ |
| Android Chrome | 142+ |
| Android Firefox | 144+ |
| Opera Mobile | 80+ |
| Samsung Internet | 8.2+ |
| QQ Browser | 14.9+ |
| Baidu Browser | 13.52+ |
| UC Browser | 15.5+ |
| KaiOS | 3.0+ |
| Opera Mini | Not supported (all versions) |
| BlackBerry | Not supported (7, 10) |

### Legacy Browser Notes

- **Internet Explorer**: Not supported in any version
- **Edge (Legacy)**: Partial support in Edge 18 where the API existed but methods were not fully implemented
- **Opera Mini**: No support in any version

## Implementation Notes

### Historical Notes

- Edge 18 had a partial implementation where `Intl.PluralRules` existed as an object but the required methods were not implemented

### Global Browser Support

- **Overall Global Support**: ~92.65% of users have access to this API
- **Partial Support**: 0%
- **Modern Browsers**: All modern browsers (released in the last 5+ years) have full support

## Code Example

```javascript
// Create a plural rules object for English
const enPlural = new Intl.PluralRules('en-US');

// Get the plural category for a number
console.log(enPlural.select(0));  // 'other' (e.g., "0 items")
console.log(enPlural.select(1));  // 'one' (e.g., "1 item")
console.log(enPlural.select(2));  // 'other' (e.g., "2 items")

// Create a plural rules object for a language with more complex rules
const ruPlural = new Intl.PluralRules('ru-RU');

console.log(ruPlural.select(1));  // 'one'
console.log(ruPlural.select(2));  // 'few'
console.log(ruPlural.select(5));  // 'other'

// Practical example: formatting messages with plural forms
const messages = {
  en: {
    one: "You have {0} message",
    other: "You have {0} messages"
  },
  ru: {
    one: "У вас {0} сообщение",
    few: "У вас {0} сообщения",
    other: "У вас {0} сообщений"
  }
};

function formatMessage(count, locale) {
  const pluralRules = new Intl.PluralRules(locale);
  const pluralCategory = pluralRules.select(count);
  const messageTemplate = messages[locale][pluralCategory];
  return messageTemplate.replace('{0}', count);
}

console.log(formatMessage(1, 'en'));  // "You have 1 message"
console.log(formatMessage(5, 'en'));  // "You have 5 messages"
console.log(formatMessage(1, 'ru'));  // "У вас 1 сообщение"
console.log(formatMessage(2, 'ru'));  // "У вас 2 сообщения"
console.log(formatMessage(5, 'ru'));  // "У вас 5 сообщений"
```

## Related Links

- [MDN Web Docs: Intl.PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/PluralRules) - Comprehensive documentation and API reference
- [Google Developers Blog: The Intl.PluralRules API](https://developers.google.com/web/updates/2017/10/intl-pluralrules) - Introduction and practical use cases
- [ECMAScript Internationalization API Specification](https://tc39.es/ecma402/) - Official specification document
- [MDN: Intl Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) - Overview of all Intl APIs

## Detection and Fallback

If you need to support older browsers, you can feature-detect the API:

```javascript
if ('PluralRules' in Intl) {
  // API is supported
  const pluralRules = new Intl.PluralRules('en-US');
  const category = pluralRules.select(5);
} else {
  // Fallback for older browsers
  // Use a custom solution or polyfill
}
```

Several polyfills are available for older browsers:
- [Core-js](https://github.com/zloirock/core-js) - Polyfill for Intl.PluralRules
- [Intl-pluralrules](https://github.com/ecomfe/intl-pluralrules) - Dedicated polyfill package

## Summary

The Intl.PluralRules API is essential for building internationalized JavaScript applications that need proper plural form selection. With support in all modern browsers and approximately 93% global coverage, it's a reliable API for implementing language-aware pluralization in web applications. For projects that need to support older browsers, feature detection and polyfills provide adequate fallback solutions.
