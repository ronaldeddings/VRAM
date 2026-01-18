# Date and Time Input Types

## Overview

Form field widgets to easily allow users to enter a date, time or both, generally by using a calendar/time input widget. This feature supports the following HTML5 input types: `date`, `time`, `datetime-local`, `month`, and `week`.

## Specification

- **Status**: Living Standard (LS)
- **Official Spec**: https://html.spec.whatwg.org/multipage/forms.html#date-state-(type=date)

## Categories

- HTML5

## Description

The date and time input types provide native, built-in form controls for collecting temporal data from users. These inputs display native UI widgets (typically calendar or time picker interfaces) that vary by browser and operating system, offering a consistent and user-friendly way to input dates and times.

### Supported Input Types

1. **`<input type="date">`** - Date picker for year, month, and day
2. **`<input type="time">`** - Time picker for hours and minutes
3. **`<input type="datetime-local">`** - Combined date and time picker
4. **`<input type="month">`** - Month and year selector
5. **`<input type="week">`** - Week number selector

## Benefits and Use Cases

### Key Benefits

- **Native User Experience**: Leverages platform-specific UI conventions for familiar interactions
- **Mobile Optimization**: Mobile browsers provide touch-friendly calendar and time picker widgets
- **Built-in Validation**: Native support for input validation without custom JavaScript
- **Accessibility**: Semantic HTML with native accessibility features
- **Format Consistency**: Standardized date format (YYYY-MM-DD) across browsers
- **Reduced Dependencies**: No need for external JavaScript date picker libraries
- **Progressive Enhancement**: Gracefully degrades to text input in unsupported browsers

### Ideal Use Cases

- E-commerce (delivery dates, event scheduling)
- Travel booking (check-in/check-out dates, flight times)
- Appointment scheduling (medical, professional services)
- Event registration
- Deadline specification
- Birthday/age verification
- Financial applications (transaction dates)
- Content management systems (publication dates)

## Browser Support

### Support Status Legend

- **y** = Full support
- **a** = Partial support
- **n** = No support
- **d** = Deprecated
- **#N** = See notes section for details

### Desktop Browsers

| Browser | Status | Version(s) | Notes |
|---------|--------|-----------|-------|
| **Internet Explorer** | No support | All versions (5.5-11) | Not supported |
| **Edge** | Full | 13+ (all current) | Partial support in v12 - see note #1 |
| **Chrome** | Full | 25+ | Partial support in v20-24 - see note #5 |
| **Safari** | Partial | 14.1+ | See note #6 |
| **Firefox** | Partial | 57+ | Partial support since v57 - see note #5, #6 |
| **Opera** | Full | 9+ (all versions) | Full support across all tracked versions |

### Mobile Browsers

| Browser | Status | Version(s) | Notes |
|---------|--------|-----------|-------|
| **iOS Safari** | Partial | 5.0+ | Partial support in earlier versions; full support from 18.2+ - see note #2, #7 |
| **Android Browser** | Full | 4.4+ | Partial in 4.x versions - see note #3 |
| **Android Chrome** | Full | 142+ | Full support in current version |
| **Android Firefox** | Partial | 144 | Partial support - see note #6 |
| **Samsung Internet** | Full | 4+ | Full support in all tracked versions |
| **Opera Mobile** | Full | 10+ | Full support across all versions |
| **UC Browser** | Full | 15.5+ | Full support |
| **Opera Mini** | No support | All versions | Not supported |
| **IE Mobile** | No support | 10, 11 | Not supported |
| **BlackBerry Browser** | Full | 10+ | Partial in v7 |
| **KaiOS Browser** | Partial | 2.5+ | Partial support - see note #5 |

## Current Browser Support Statistics

- **Full Support**: 87.6% of global browser usage
- **Partial Support**: 5.53% of global browser usage
- **No Support**: 6.87% of global browser usage

This indicates strong overall support for the feature with most modern browsers providing full implementation.

## Support Notes

### Note #1: Microsoft Edge Partial Support (v12)

Partial support in Microsoft Edge v12 refers to supporting `date`, `week`, and `month` input types only. The `time` and `datetime-local` input types are not supported.

### Note #2: iOS Safari Limitations

Partial support in iOS Safari refers to:
- Not supporting the `week` input type
- Not supporting the `min`, `max`, or `step` attributes

### Note #3: Android 4.x Variations

Some modified versions of the Android 4.x browser do have support for date/time fields, though the standard browser may not.

### Note #4: Firefox Feature Flag (v53-56)

Can be enabled in Firefox using the `dom.forms.datetime` flag in about:config, though the feature was not enabled by default until v57.

### Note #5: Partial Type Support

Partial support refers to supporting `date` and `time` input types only, without support for `datetime-local`, `month`, or `week` types.

### Note #6: Week and Month Type Limitations

Partial support refers to not supporting the `week` and `month` input types. Typically, `date`, `time`, and `datetime-local` are supported.

### Note #7: iOS Safari 18.2+ Attribute Limitations

Full support in iOS Safari 18.2 and later, but note that `min`, `max`, and `step` attributes are not supported on date inputs.

## Additional Notes

The `datetime` input type was originally proposed for the HTML specification but has been [dropped from the HTML spec](https://github.com/whatwg/html/issues/336). Use `datetime-local` instead for combined date and time input.

## Fallback Strategies

### Progressive Enhancement

For browsers without native support, consider these approaches:

1. **JavaScript Polyfills**: Libraries like [html5Forms.js](https://github.com/zoltan-dulac/html5Forms.js)
2. **Third-party Date Pickers**: Fallback to JavaScript libraries when native support is unavailable
3. **Text Input Validation**: Validate user-entered text format and provide instructions
4. **Feature Detection**: Use feature detection to determine available functionality

### Recommended Polyfills and Tools

- [html5Forms.js](https://github.com/zoltan-dulac/html5Forms.js) - Polyfill for HTML5 forms
- [has.js](https://raw.github.com/phiggins42/has.js/master/detect/form.js#input-type-datetime-local) - Feature detection library

## Basic Usage Examples

### Date Input

```html
<label for="birthdate">Select your birth date:</label>
<input type="date" id="birthdate" name="birthdate">
```

### Time Input

```html
<label for="meetingtime">Select meeting time:</label>
<input type="time" id="meetingtime" name="meetingtime">
```

### DateTime-Local Input

```html
<label for="eventdatetime">Select event date and time:</label>
<input type="datetime-local" id="eventdatetime" name="eventdatetime">
```

### Month and Week Inputs

```html
<label for="expiry">Card expiry month:</label>
<input type="month" id="expiry" name="expiry">

<label for="weekselect">Select week:</label>
<input type="week" id="weekselect" name="weekselect">
```

### With Constraints

```html
<label for="eventdate">Schedule your event (next 30 days):</label>
<input
  type="date"
  id="eventdate"
  name="eventdate"
  min="2025-01-01"
  max="2025-02-01"
  required
>
```

## Feature Detection

Detect support before using these input types:

```javascript
function supportsDateInput() {
  const input = document.createElement('input');
  input.setAttribute('type', 'date');
  return input.type === 'date';
}

function supportsTimeInput() {
  const input = document.createElement('input');
  input.setAttribute('type', 'time');
  return input.type === 'time';
}

if (!supportsDateInput()) {
  // Fallback to alternative date picker
}
```

## Related Resources

### Official Documentation
- [WebPlatform Docs - HTML date input](https://webplatform.github.io/docs/html/elements/input/type/date)
- [MDN Web Docs - HTML input type=date](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date)
- [MDN Web Docs - HTML input type=time](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time)

### Browser Support Tracking
- [CanIUse - Date and time input types](https://caniuse.com/input-datetime)

### Bug Reports & Implementation Status
- [Firefox Support Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=888320)
- [WebKit/Safari Support Bug](https://bugs.webkit.org/show_bug.cgi?id=119175)
- [WebKit/Safari Related Issue](https://bugs.webkit.org/show_bug.cgi?id=214946)

### Tutorials & Guides
- [Tutsplus - Create Cross-Browser Datepickers in Minutes](https://code.tutsplus.com/tutorials/quick-tip-create-cross-browser-datepickers-in-minutes--net-20236)

## Accessibility Considerations

- Native date/time inputs provide semantic meaning to assistive technologies
- Screen readers announce the input type and purpose
- Keyboard navigation is built-in for most browsers
- Mobile users benefit from native touch-optimized interfaces
- Always provide clear labels with `<label>` elements
- Consider providing format hints or examples for unsupported browsers

## Browser-Specific Considerations

### Safari/WebKit Limitations
- Missing `week` and `month` input type support
- Attributes like `min`, `max`, and `step` may not be fully supported
- Consider polyfills for production use if these types are essential

### Firefox Status
- Partial support requiring feature flag in early versions
- Full support for most input types in recent versions
- Some attribute limitations may apply

### Mobile Concerns
- iOS Safari has limited attribute support (`min`, `max`, `step`)
- Week type not supported on iOS Safari
- Android browsers have better overall support
- Test thoroughly on target devices

## See Also

- HTML5 Forms documentation
- Input element reference
- Form validation techniques
- User experience best practices for form design
