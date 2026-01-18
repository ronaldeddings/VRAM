# Internationalization API

## Overview

The **Internationalization API** (ECMAScript Internationalization API, also known as `Intl`) provides language-sensitive and locale-aware functionality for JavaScript applications. This API enables developers to format and compare strings, numbers, and dates according to different locales and cultural conventions without requiring external libraries.

## Description

The Internationalization API provides locale-sensitive:
- **Collation** - Language-aware string comparison and sorting
- **Number Formatting** - Localized number presentation with appropriate currency symbols, decimal separators, and grouping
- **Date and Time Formatting** - Locale-aware date and time presentation

This API standardizes how applications handle multilingual and multicultural content at the JavaScript level, making it easier to build truly international web applications.

## Specification

- **Standard**: ECMAScript Internationalization API
- **Status**: Other (Standardized but ongoing)
- **Specification URL**: [https://tc39.es/ecma402/](https://tc39.es/ecma402/)
- **Current Usage**: 93.5% of users globally

## Categories

- JavaScript (JS)

## Key Components

The Internationalization API provides three main objects:

### `Intl.Collator`
Enables language-sensitive string comparison and sorting.

```javascript
const collator = new Intl.Collator('en-US');
const words = ['ä', 'b', 'a'];
words.sort(collator.compare); // Proper locale-aware sorting
```

### `Intl.NumberFormat`
Formats numbers according to locale-specific conventions.

```javascript
const formatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR'
});
formatter.format(1234.56); // "1.234,56 €"
```

### `Intl.DateTimeFormat`
Formats dates and times according to locale conventions.

```javascript
const dateFormatter = new Intl.DateTimeFormat('fr-FR');
dateFormatter.format(new Date()); // "1/12/2025" (French format)
```

## Benefits & Use Cases

### For Global Applications
- **Automatic Localization**: Reduce development time by automatically handling locale-specific formatting
- **No External Dependencies**: Built-in API eliminates the need for large i18n libraries
- **Consistent Behavior**: Standardized across all modern browsers

### For User Experience
- **Culturally Appropriate**: Display content in formats users expect from their locale
- **Language-Aware Sorting**: Correctly sort strings with diacritical marks (e.g., Swedish å, ä, ö)
- **Currency Display**: Automatically format prices with correct currency symbols and decimal places

### Common Scenarios
- Multi-language e-commerce platforms displaying prices
- Global applications needing locale-specific date formatting
- Search and filtering features requiring proper collation
- Financial applications with currency-aware number formatting
- Multilingual content management systems
- International user directories with proper name sorting

## Browser Support

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| Chrome | 24 | Supported | Full support from v24+ |
| Firefox | 29 | Supported | Full support from v29+ |
| Safari | 10 | Supported | Full support from v10+ |
| Edge | 12 | Supported | Full support from v12+ |
| Opera | 15 | Supported | Full support from v15+ |
| Internet Explorer | 11 | Supported (IE11 only) | No support in IE10 and earlier |

### Mobile Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| iOS Safari | 10.0 | Supported | Full support from v10.0+ |
| Android Browser | 4.4 | Supported | Full support from v4.4+ |
| Chrome Mobile | 24+ | Supported | Same as desktop |
| Firefox Mobile | 29+ | Supported | Same as desktop |
| Samsung Internet | 4.0 | Supported | Full support |
| Opera Mobile | 80+ | Supported | Full support from v80+ |
| UC Browser | 15.5+ | Supported | Full support from v15.5+ |

### Legacy/Special Browsers

| Browser | Status | Notes |
|---------|--------|-------|
| Internet Explorer (IE5.5-10) | Not Supported | No Intl API |
| Opera Mini | Not Supported | Complete lack of support |
| BlackBerry | Not Supported | No support in BB7, BB10 |
| KaiOS | Partial | Support from v3.0+ (not v2.5) |

## Global Support Statistics

- **Supported**: 93.5% of global browser usage
- **Partial/No Support**: 6.5% of global browser usage
- **Recommendation**: Safe to use with feature detection for legacy browser compatibility

## Implementation Guide

### Feature Detection

```javascript
// Check if Intl API is available
if (typeof Intl !== 'undefined' &&
    typeof Intl.Collator !== 'undefined' &&
    typeof Intl.NumberFormat !== 'undefined' &&
    typeof Intl.DateTimeFormat !== 'undefined') {
  // Use Intl API
} else {
  // Fallback implementation
}
```

### Basic Examples

#### Number Formatting
```javascript
const number = 3499.99;

// US English
const usFormat = new Intl.NumberFormat('en-US');
console.log(usFormat.format(number)); // "3,499.99"

// German
const deFormat = new Intl.NumberFormat('de-DE');
console.log(deFormat.format(number)); // "3.499,99"

// Currency formatting
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});
console.log(currencyFormatter.format(number)); // "$3,499.99"
```

#### Date Formatting
```javascript
const date = new Date('2025-12-13');

// English (US)
const enUS = new Intl.DateTimeFormat('en-US');
console.log(enUS.format(date)); // "12/13/2025"

// German
const deDE = new Intl.DateTimeFormat('de-DE');
console.log(deDE.format(date)); // "13.12.2025"

// Full date with time
const fullFormat = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});
console.log(fullFormat.format(date));
// "Saturday, December 13, 2025, 12:00:00 AM"
```

#### String Collation
```javascript
const collator = new Intl.Collator('en-US');

const words = ['apple', 'Apple', 'banana', 'Banana'];
words.sort(collator.compare);
// Results in case-insensitive sorting

// Compare two strings
console.log(collator.compare('a', 'b')); // -1 (a comes before b)
console.log(collator.compare('a', 'a')); // 0 (equal)
console.log(collator.compare('b', 'a')); // 1 (b comes after a)
```

## Compatibility Fallbacks

For applications needing to support legacy browsers (IE10 and earlier, Opera Mini):

```javascript
function formatNumber(num, locale = 'en-US') {
  if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
    return new Intl.NumberFormat(locale).format(num);
  }
  // Fallback for older browsers
  return num.toLocaleString();
}
```

## Advanced Features

### Locale Negotiation
```javascript
const locales = ['en-US', 'en', 'de-DE'];
const formatter = new Intl.DateTimeFormat(locales);
```

### Option Objects
```javascript
// NumberFormat options
new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: true
});

// DateTimeFormat options
new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
  timeZone: 'America/Los_Angeles'
});

// Collator options
new Intl.Collator('en-US', {
  numeric: true,
  sensitivity: 'base' // ignore diacritics and case
});
```

## Notes & Considerations

### Locale Data Availability
- Different JavaScript engines may support different locale data sets
- Fallback behavior varies when requesting unavailable locales
- Standard guarantees at least English (en) locale support

### Performance
- Creating formatters is relatively lightweight operations
- For repeated formatting, create formatter instances once and reuse them
- Consider caching formatter instances for performance-critical applications

### Polyfills
- For IE10 and earlier support, the `intl` polyfill is available on npm
- Polyfill size considerations when supporting legacy browsers
- Modern applications should rely on native Intl API support

### Browser-Specific Behavior
- Firefox for Android: May have limited locale data in some versions
- WebKit (Safari): Full support with potential memory implications for large locale data sets
- Chrome/Edge: Comprehensive locale support with regular updates

## Relevant Links & Resources

- **MDN Documentation**: [Internationalization API Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- **ECMAScript Specification**: [ECMAScript Internationalization API](https://tc39.es/ecma402/)
- **Educational Article**: [The ECMAScript Internationalization API](https://norbertlindenberg.com/2012/12/ecmascript-internationalization-api/)
- **Tutorial**: [Working With Intl](https://code.tutsplus.com/tutorials/working-with-intl--cms-21082)
- **WebKit Bug Tracking**: [WebKit Issue #90906](https://bugs.webkit.org/show_bug.cgi?id=90906)
- **Firefox Bug Tracking**: [Firefox Android Issue #1344625](https://bugzilla.mozilla.org/show_bug.cgi?id=1344625)

## Summary

The Internationalization API is a mature, widely-supported standard that should be the first choice for locale-aware formatting in modern web applications. With 93.5% global browser support and full coverage across all modern desktop and mobile browsers, it provides a reliable foundation for building truly international web applications without heavy external dependencies.

---

**Last Updated**: December 2025
**API Status**: Standardized (ECMA-402)
**Recommendation**: Safe for production use with feature detection for legacy browser support
