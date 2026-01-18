# Temporal API

## Overview

**Temporal** is a modern JavaScript API designed to provide a comprehensive solution for working with dates and times. It's intended to supersede the original `Date` API, which has long been considered problematic for date/time operations in JavaScript.

## Description

The Temporal API addresses many of the design flaws and limitations of JavaScript's built-in `Date` object. It provides:

- **Precise date and time handling** with support for multiple calendar systems
- **Time zone aware operations** with proper handling of DST (Daylight Saving Time)
- **Immutable date/time objects** for safer, more predictable code
- **Clear separation of concerns** between local times, UTC times, and calendar dates
- **Arithmetic operations** on dates and times with proper overflow handling
- **Formatting and parsing** capabilities with internationalization support

## Specification Status

- **Status**: Stage 3 (Proposal) - Not yet standardized
- **Specification**: [TC39 Temporal Proposal](https://tc39.es/proposal-temporal/docs/)
- **Current State**: Actively advancing through the standardization process with implementation progress in major browsers

## Categories

- **JavaScript (JS)**
- **JavaScript API (JS API)**

## Benefits & Use Cases

### Key Advantages

1. **Immutability**: All Temporal objects are immutable, preventing accidental mutations and making code more predictable
2. **Type Safety**: Clear, distinct types for different date/time concepts (Date, Time, ZonedDateTime, etc.)
3. **Time Zone Support**: Native, first-class support for time zones without complex workarounds
4. **Arithmetic Operations**: Intuitive date/time arithmetic with proper overflow handling
5. **Calendar Systems**: Support for multiple calendar systems (Gregorian, ISO 8601, and others)
6. **Parsing & Formatting**: Built-in parsing and formatting with i18n support

### Common Use Cases

- **Scheduling applications**: Handling recurring events across time zones
- **International applications**: Working with multiple calendars and time zones
- **Financial systems**: Precise date/time tracking and calculations
- **Logging and monitoring**: Accurate timestamp handling
- **User-facing applications**: Displaying times in users' local time zones
- **Cron-like scheduling**: Creating complex scheduling rules

## Browser Support

| Browser | Support | Version(s) | Notes |
|---------|---------|-----------|-------|
| **Chrome** | Yes | 144+ | Latest versions support Temporal |
| **Firefox** | Yes | 139+ | Supported by default since Firefox 139 |
| **Safari** | No | — | Not yet implemented; tracking bug exists |
| **Edge** | No | — | Not yet implemented |
| **Opera** | No | — | Not yet implemented |
| **Internet Explorer** | No | — | Will not be supported |

### Mobile Browsers

| Browser | Support | Version(s) | Notes |
|---------|---------|-----------|-------|
| **Firefox (Android)** | Yes | 144+ | Supported alongside desktop Firefox |
| **Chrome (Android)** | No | — | Not yet implemented |
| **Safari (iOS)** | No | — | Not yet implemented |
| **Samsung Internet** | No | — | Not yet implemented |

### Polyfills

Since Temporal is not yet universally supported, polyfills/ponyfills are available:

- [Temporal polyfill](https://github.com/tc39/proposal-temporal) - Official polyfill
- Consider alternative libraries for current production use

## Implementation Notes

### Firefox Support Details

Firefox 135-138: Supported in Firefox Nightly behind the `javascript.options.experimental.temporal` flag
Firefox 139+: Enabled by default

### Feature Status

As of December 2025:
- **Global Support**: ~1.79% (limited to Chrome and Firefox desktop versions)
- **Desktop Browsers**: Chrome 144+ and Firefox 139+ only
- **Mobile Browsers**: Very limited, only Firefox Android 144+
- **Legacy Support**: No support in IE or older Edge versions

## Core Concepts

### Main Types

The Temporal API provides several key types:

- **`Temporal.Now`**: Current date/time
- **`Temporal.PlainDate`**: A date without time zone or time information
- **`Temporal.PlainTime`**: A time without date or time zone information
- **`Temporal.PlainDateTime`**: A date and time without time zone information
- **`Temporal.ZonedDateTime`**: A date, time, and time zone together
- **`Temporal.Duration`**: A span of time (years, months, weeks, days, hours, etc.)
- **`Temporal.TimeZone`**: Time zone and daylight saving time information
- **`Temporal.Calendar`**: Calendar system operations

### Example Usage

```javascript
// Get current date and time
const now = Temporal.Now.zonedDateTimeISO();

// Create a specific date
const birthday = Temporal.PlainDate.from('1990-05-15');

// Add days to a date
const futureDate = birthday.add({ days: 30 });

// Convert between time zones
const tokyo = now.withTimeZone('Asia/Tokyo');
const london = now.withTimeZone('Europe/London');

// Duration arithmetic
const duration = Temporal.Duration.from({ hours: 2, minutes: 30 });
```

## Related Links

### Official Resources
- [TC39 Temporal Specification](https://tc39.es/proposal-temporal/docs/)
- [Fixing JavaScript Date](https://maggiepint.com/2017/04/11/fixing-javascript-date-web-compatibility-and-reality/) - Article explaining Date API problems

### Implementation Progress
- [Chromium Implementation Bug](https://bugs.chromium.org/p/v8/issues/detail?id=11544)
- [Firefox Implementation Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1839673)
- [WebKit Implementation Bug](https://bugs.webkit.org/show_bug.cgi?id=223166)

### Educational Resources
- [Temporal: Getting Started with JavaScript's New Date/Time API](https://2ality.com/2021/06/temporal-api.html) - Comprehensive guide by Dr. Axel Rauschmayer

## Migration from Date API

### Old Way (Date API)
```javascript
// Dealing with time zones is complex and error-prone
const date = new Date('2024-01-15T10:30:00Z');
const offset = date.getTimezoneOffset();
```

### New Way (Temporal API)
```javascript
// Time zone support is built-in
const date = Temporal.PlainDate.from('2024-01-15');
const zonedDate = date.toZonedDateTime('America/New_York');
```

## Adoption Recommendations

### Current Status
- **Production**: Not recommended for production use without careful compatibility consideration
- **Development**: Excellent for learning and future-proofing code
- **Polyfill Strategy**: If using in production, pair with an official polyfill

### Best Practices

1. **Check feature support** before using Temporal
2. **Use a polyfill** for environments without native support
3. **Consider migration plans** from legacy Date code
4. **Monitor browser support** as implementation progresses
5. **Contribute to implementations** if you identify issues

## Timeline

- **2024-2025**: Major browser implementations beginning (Chrome 144+, Firefox 139+)
- **Expected**: Continued rollout across other browsers (Safari, Edge)
- **Long-term**: Should become the standard way to work with dates/times in JavaScript

## See Also

- [Date API (Legacy)](./date.md)
- [Intl API (Internationalization)](./intl.md)
- [ECMAScript Standards](https://tc39.es/)

---

**Last Updated**: December 2025
**Data Source**: CanIUse Database
**Support**: For implementation status, check [CanIUse Temporal](https://caniuse.com/temporal)
