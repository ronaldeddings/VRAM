# localeCompare()

## Overview

The `localeCompare()` method is a JavaScript String prototype method that returns a number indicating whether a reference string comes before, after, or is the same as a given string in sort order. This method is particularly useful for implementing locale-aware string comparisons that respect language-specific sorting rules.

## Description

`String.prototype.localeCompare()` provides a standardized way to compare strings according to the current locale's collation order. Unlike simple character code comparison, `localeCompare()` takes into account language-specific rules, accents, case sensitivity, and other locale-specific conventions that affect how strings should be sorted.

### Return Value

The method returns:
- **Negative number**: If the reference string comes before the comparison string
- **Zero (0)**: If the strings are equal according to locale rules
- **Positive number**: If the reference string comes after the comparison string

### Syntax

```javascript
referenceStr.localeCompare(compareString)
referenceStr.localeCompare(compareString, locales)
referenceStr.localeCompare(compareString, locales, options)
```

## Specification

- **Spec URL**: https://tc39.es/ecma402/#sup-String.prototype.localeCompare
- **Status**: Other (ECMAScript Internationalization API)
- **Category**: JavaScript (JS)

## Benefits & Use Cases

### Locale-Aware Sorting
- Sort arrays of strings according to language-specific rules
- Properly handle accented characters (é, ñ, ü, etc.)
- Support case-insensitive sorting

### Internationalization (i18n)
- Build multilingual applications that sort correctly in different languages
- Respect cultural conventions for string ordering
- Support complex scripts and combining characters

### User-Facing Data
- Sort user names, addresses, and product names correctly in their native language
- Implement search and filter features that respect locale conventions
- Display sorted lists that feel natural to users in different regions

### Search & Comparison
- Implement case-insensitive search functionality
- Compare strings while respecting language-specific rules
- Build advanced text processing applications

## Usage Example

```javascript
// Basic comparison
const a = 'réserve';
const b = 'reserve';
console.log(a.localeCompare(b)); // 1 (or some positive number depending on locale)

// Sorting array of names
const names = ['Zebra', 'apple', 'Éclair', 'banana'];
names.sort((a, b) => a.localeCompare(b, 'en-US'));
// Result: ['apple', 'banana', 'Éclair', 'Zebra']

// Case-insensitive sorting
const mixed = ['Dog', 'cat', 'BIRD'];
mixed.sort((a, b) => a.localeCompare(b, 'en-US', { sensitivity: 'base' }));
// Result: ['BIRD', 'cat', 'Dog']

// Locale-specific sorting (German vs Swedish)
const str = 'Köln'; // Cologne in German
const comparison = 'Kolnisch';
console.log(str.localeCompare(comparison, 'de-DE')); // Different from 'sv-SE'
```

## Browser Support

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Chrome** | 4-23 | Partial (a) | Basic support without locale/options parameters |
| **Chrome** | 24+ | Full (y) | Complete support including locale and options |
| **Firefox** | 2-28 | Partial (a) | Basic support without locale/options parameters |
| **Firefox** | 29+ | Full (y) | Complete support including locale and options |
| **Safari** | 3.1-9.1 | Partial (a) | Basic support without locale/options parameters |
| **Safari** | 10+ | Full (y) | Complete support including locale and options |
| **Edge** | 12+ | Full (y) | Complete support in all versions |
| **Opera** | 9-12 | Unsupported (u) | Not supported |
| **Opera** | 12.1 | Partial (a) | Basic support without locale/options parameters |
| **Opera** | 15+ | Full (y) | Complete support including locale and options |
| **IE** | 5.5 | Unsupported (u) | Not supported |
| **IE** | 6-10 | Partial (a) | Basic support without locale/options parameters |
| **IE** | 11 | Full (y) | Complete support including locale and options |
| **iOS Safari** | 3.2-9.3 | Partial (a) | Basic support without locale/options parameters |
| **iOS Safari** | 10+ | Full (y) | Complete support including locale and options |
| **Android Browser** | 2.1-4.3 | Partial (a) | Basic support without locale/options parameters |
| **Android Browser** | 4.4+ | Full (y) | Complete support including locale and options |
| **Samsung Internet** | 4 | Partial (a) | Basic support without locale/options parameters |
| **Samsung Internet** | 5.0+ | Full (y) | Complete support including locale and options |
| **Opera Mini** | All | Partial (a) | Basic support without locale/options parameters |

### Support Legend

- **y (Full)**: Complete support with locale and options parameters
- **a (Partial)**: Basic support - only works without locale and options parameters
- **u (Unsupported)**: Feature is not supported

### Global Browser Support Statistics

- **Full Support (y)**: 93.5% of tracked users
- **Partial Support (a)**: 0.22% of tracked users

## Important Notes

### Basic vs Full Support

Many older browsers support basic `localeCompare()` without the ability to accept `locales` and `options` parameters (marked with "#1" in the data). These implementations use only the system's default locale settings.

#### Full support includes:
- `locales` parameter for specifying language/region
- `options` parameter for customizing comparison behavior
  - `localeMatcher`: "lookup" or "best fit"
  - `numeric`: Enable numeric string comparison
  - `sensitivity`: "base", "accent", "case", or "variant"
  - `caseFirst`: "upper" or "lower"
  - `usage`: "sort" or "search"

#### Basic support provides:
- Comparison according to default system locale only
- No ability to specify custom locales or options
- Limited functionality for international applications

## Fallback Strategies

For applications requiring full locale support in older browsers:

1. **Polyfill**: Use a JavaScript polyfill that implements the full ECMA-402 specification
2. **Feature Detection**: Test for options parameter support before using it
3. **Graceful Degradation**: Fall back to simple string comparison if full support unavailable
4. **Unicode Library**: Use a library like ICU for advanced string handling

```javascript
// Feature detection example
function supportsFullLocaleCompare() {
  try {
    const result = 'a'.localeCompare('b', 'en-US', { numeric: true });
    return true;
  } catch (e) {
    return false;
  }
}
```

## Related Resources

### Official Documentation
- [MDN Web Docs - String.prototype.localeCompare()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare)
- [ECMAScript Internationalization API Specification](https://tc39.es/ecma402/)

### Additional Resources
- [ECMA-402 Standard](https://www.ecma-international.org/publications-and-standards/standards/ecma-402/)
- [MDN Internationalization API Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [Unicode Collation Algorithm](https://unicode.org/reports/tr10/)

## Browser-Specific Considerations

### Internet Explorer
- IE 6-10: Only supports basic comparison without locale parameters
- IE 11: Adds full support for locale and options parameters

### Mobile Browsers
- Most modern mobile browsers (iOS Safari 10+, Android 4.4+) support full `localeCompare()`
- Older Android devices may only have basic support

### Opera Mini
- Only supports basic `localeCompare()` without advanced options
- Suitable for simple string comparison only

## Practical Migration Guide

If you're currently using simple string comparison:

```javascript
// Old approach (doesn't respect locales)
arr.sort((a, b) => a > b ? 1 : -1);

// Modern approach (locale-aware)
arr.sort((a, b) => a.localeCompare(b, 'en-US'));
```

The `localeCompare()` method handles:
- Accented character comparison correctly
- Case sensitivity appropriately
- Numeric string sorting if needed
- Complex script handling
- Multiple language variations

## Data As Of

- **Usage Percentage (Full Support)**: 93.5%
- **Usage Percentage (Partial Support)**: 0.22%
- **Caniuse Database**: Current version
