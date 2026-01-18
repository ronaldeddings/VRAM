# Datalist Element

## Overview

The HTML `<datalist>` element provides a method of setting a list of options for users to select from in a text field, while still allowing the ability to enter a custom value. This creates an autocomplete-like experience without requiring JavaScript.

## Specification

**Status:** Living Standard (ls)
**Official Spec:** [HTML Standard - Datalist Element](https://html.spec.whatwg.org/multipage/forms.html#the-datalist-element)

## Categories

- HTML5

## Description

The `<datalist>` element works in conjunction with the `list` attribute on `<input>` elements to provide users with predefined options they can choose from. Users are not limited to the suggested options and can type custom values. This is particularly useful for search fields, forms with common selections, and any input that benefits from intelligent autocomplete suggestions.

## Benefits and Use Cases

### Key Benefits

- **Progressive Enhancement:** Works as a native HTML feature without JavaScript dependencies
- **User Experience:** Reduces typing and potential errors by suggesting common options
- **Accessibility:** Semantically correct, accessible to screen readers and assistive technologies
- **Performance:** No JavaScript overhead compared to custom autocomplete solutions
- **Flexibility:** Users can still enter custom values not in the list

### Common Use Cases

1. **Search Functionality** - Suggest popular search terms
2. **Form Dropdowns** - Provide suggestions for country, state, or category selection
3. **Tag Input** - Suggest common tags while allowing custom entries
4. **Product Selection** - Auto-complete for product names or SKUs
5. **Email/Username Fields** - Suggest known contacts or usernames
6. **Address Fields** - Suggest addresses while allowing custom entry
7. **Date/Time Inputs** - Suggest common dates or times (Chrome, Opera)
8. **Range Inputs** - Suggest meaningful values (Chrome, Opera)

## Basic Syntax

```html
<label for="browser">Choose a browser:</label>
<input list="browsers" id="browser" name="browser" />

<datalist id="browsers">
  <option value="Chrome">Chrome</option>
  <option value="Firefox">Firefox</option>
  <option value="Safari">Safari</option>
  <option value="Edge">Edge</option>
</datalist>
```

## Features

### Standard Attributes

- **`id`** - Required: Must be referenced by the `list` attribute on an `<input>` element
- **`list` (on input)** - Attribute that associates the input with a datalist by ID

### Option Elements

The `<datalist>` contains `<option>` elements that can have:
- **`value`** - The actual value to be selected
- **`label`** - Optional: Display text different from the value (though browser support varies)

### Additional Input Types Support

While most commonly used with text fields, datalists can also be applied to:
- `type="number"` - Chrome, Opera, Safari (12.1+)
- `type="range"` - Chrome, Opera (Chromium-based)
- `type="color"` - Chrome, Opera (Chromium-based)
- `type="date"` - Chrome, Opera (Chromium-based)
- `type="time"` - Chrome, Opera (Chromium-based)
- `type="datetime-local"` - Chrome, Opera (Chromium-based)

## Browser Support

### Summary Statistics

- **Full Support (y):** 81.52% of users
- **Partial Support (a):** 11.47% of users
- **No Support (n):** 7.01% of users

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|--------------|----------------|-------|
| Chrome | 20+ | Partial (v20-68), **Full (v69+)** | Bug #1 with long lists |
| Edge | 12+ | Partial (v12-78), **Full (v79+)** | Bug #2 (v12-18), Bug #4 (v16-18) |
| Firefox | 4+ | **Partial (all versions)** | Bug #3, Bug #6, Bug #7 (v102+) |
| Safari | 12.1+ | **Full (v12.1+)** | No support in v12 and earlier |
| Opera | 9+ | **Full (v9-14)** | Partial (v15-63), Full (v64+) |
| IE | 10+ | **Partial (v10-11)** | Not supported in IE9 and earlier |

### Mobile Browsers

| Browser | Status | Notes |
|---------|--------|-------|
| iOS Safari | Partial | Not supported in v12 and earlier; v12.2+ has bugs #5, #8 |
| Android Chrome | **Full** | Fully supported (v4.4.3+) |
| Android Firefox | **No** | Not supported |
| Opera Mobile | **Full** | Supported (v10+) |
| Samsung Internet | **Full** | Supported (v4+) |
| UC Browser | **Full** | Supported (v15.5+) |
| Opera Mini | **No** | Not supported |
| BlackBerry | Partial (v7), **Full (v10+)** | |

### Support Details by Browser

#### Chrome/Edge/Opera (Chromium-based)
- **Full support** in modern versions (Chrome 69+, Edge 79+, Opera 64+)
- Bug #1: Long lists may not be scrollable, limiting options selection
- Additional type support: number, range, color, date/time fields

#### Firefox
- **Partial support** across all versions since v4
- Bug #3: No support for non-text input types
- Bug #6: Autocomplete must be set to "off" for dynamic datalists
- Bug #7: No support for date/time fields (Firefox 102+)

#### Safari/WebKit
- **Full support** from Safari 12.1 onwards
- Not supported in Safari 12 and earlier
- iOS Safari support starts at v12.1 with known issues (#5, #8)

#### Internet Explorer
- **Partial support** in IE10 and IE11
- Bug #2: Significantly buggy behavior; improved in IE11+
- Not supported in IE9 and earlier

#### Opera Mini
- **No support**

## Known Issues and Limitations

### Issue #1: Chromium Unscrollable Long Lists
**Affects:** Chrome (20-68), Opera (15-63), and Chromium-based browsers
**Problem:** Long lists of items may not be scrollable, resulting in unselectable options
**Workaround:** Limit the number of options or use JavaScript-based autocomplete for large lists
**Bug Report:** [Chromium Issue #773041](https://bugs.chromium.org/p/chromium/issues/detail?id=773041)

### Issue #2: Internet Explorer Buggy Behavior
**Affects:** IE10 and IE11
**Problem:** Significantly buggy datalist behavior
**Resolution:** IE11+ does send input and change events upon selection
**Workaround:** Consider polyfills for better IE support
**Reference:** [IE10 Datalist Issues](https://web.archive.org/web/20170121011936/http://playground.onereason.eu/2013/04/ie10s-lousy-support-for-datalists/)

### Issue #3: Firefox Non-text Input Types
**Affects:** Firefox (all versions)
**Problem:** No support for datalists on number, range, color, date, and time input types
**Workaround:** Use JavaScript alternatives for these input types in Firefox
**Related Bugs:**
- Number/range: [Bug #841942](https://bugzilla.mozilla.org/show_bug.cgi?id=841942)
- Color: [Bug #960984](https://bugzilla.mozilla.org/show_bug.cgi?id=960984)
- Date/time: [Bug #1905313](https://bugzilla.mozilla.org/show_bug.cgi?id=1905313)

### Issue #4: Edge Option Elements Disappearing
**Affects:** Edge 16-18 (legacy Edge)
**Problem:** Option elements disappear when focusing the input via tab
**Status:** Fixed in Edge 79+ (Chromium-based)
**Bug Report:** [Microsoft Edge Issue #20066595](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/20066595/)

### Issue #5 & #8: iOS Safari Issues
**Affects:** iOS Safari 12.2 and later
**Problems:**
- UIWebView apps may cause input to become unusable
- WKWebView and Safari work properly
- If both value and label are provided, only the value displays as suggestion

**Workaround:** Test thoroughly on both UIWebView and WKWebView environments; consider platform-specific testing

### Issue #6: Firefox Dynamic Datalist Bug
**Affects:** Firefox (all versions)
**Problem:** Autocomplete must be set to "off" for dynamic datalists
**Workaround:** Set `autocomplete="off"` on inputs using dynamic datalists
**Bug Report:** [Firefox Bug #1474137](https://bugzilla.mozilla.org/show_bug.cgi?id=1474137)

### Issue #7: Firefox Date/Time Support
**Affects:** Firefox 102+
**Problem:** No support for datalists on date and time input fields
**Bug Report:** [Firefox Bug #1905313](https://bugzilla.mozilla.org/show_bug.cgi?id=1905313)

## Additional Notes

While most commonly used on text fields, datalists can be applied to various input types:

- **IE11:** Supports datalists on `range` fields
- **Chrome & Opera:** Support datalists on `range`, `color`, and date/time fields, allowing users to select suggested values
- **Firefox:** Only supports datalists on text inputs; other types fall back to standard behavior
- **Safari 12.1+:** Supports text inputs with full functionality

### Feature Detection

```javascript
function supportsDatalist() {
  const input = document.createElement('input');
  return 'list' in input;
}
```

### Polyfills and Alternatives

For better cross-browser support, especially for older browsers and non-text input types, consider:

- [WebShim](https://afarkas.github.io/webshim/demos/) - Comprehensive HTML5 library with datalist support
- [Minimal Datalist Polyfill](https://github.com/thgreasi/datalist-polyfill) - Lightweight polyfill with tutorial
- [Datalist Polyfill by mfranzke](https://github.com/mfranzke/datalist-polyfill) - Minimal, dependency-free vanilla JavaScript polyfill

## Practical Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>Datalist Example</title>
</head>
<body>
  <h1>Browser Selection</h1>
  <label for="browser-input">Select or type a browser:</label>
  <input
    id="browser-input"
    type="text"
    list="browsers"
    placeholder="Chrome, Firefox, Safari..."
    autocomplete="off"
  />

  <datalist id="browsers">
    <option value="Chrome">Chrome</option>
    <option value="Firefox">Firefox</option>
    <option value="Safari">Safari</option>
    <option value="Edge">Edge</option>
    <option value="Opera">Opera</option>
    <option value="Internet Explorer">Internet Explorer</option>
  </datalist>

  <script>
    // Optional: Feature detection
    if (!('list' in document.createElement('input'))) {
      console.warn('Datalist is not supported in this browser');
      // Load polyfill if needed
    }
  </script>
</body>
</html>
```

## Recommendation for Production Use

### When to Use Datalist

- Modern web applications targeting current browser versions (Chrome 69+, Firefox 4+, Safari 12.1+)
- Progressive enhancement is acceptable
- Need for native, accessible autocomplete without JavaScript overhead
- Supporting text input autocomplete as the primary use case

### When to Consider Alternatives

- Need to support IE9 and earlier versions
- Require complex autocomplete with filtering/searching logic
- Need datalist support on non-text input types in Firefox
- Require consistent behavior across all browsers and input types
- Using older versions of Safari (< 12.1) or Firefox with extensive datalist features

## Related Resources

### Official Documentation
- [MDN Web Docs - datalist element](https://developer.mozilla.org/en/HTML/Element/datalist)
- [WebPlatform Docs - datalist](https://webplatform.github.io/docs/html/elements/datalist)
- [HTML Standard Specification](https://html.spec.whatwg.org/multipage/forms.html#the-datalist-element)

### Articles and Guides
- [Mozilla Hacks - HTML5 Forms in Firefox 4](https://hacks.mozilla.org/2010/11/firefox-4-html5-forms/)
- [Eiji Kitamura's Datalist Demos & Tests](https://demo.agektmr.com/datalist/)

### Polyfills
- [WebShim - HTML5 Library](https://afarkas.github.io/webshim/demos/)
- [Datalist Polyfill - thgreasi](https://github.com/thgreasi/datalist-polyfill)
- [Datalist Polyfill - mfranzke](https://github.com/mfranzke/datalist-polyfill)

## See Also

- HTML Input Element: `<input>`
- HTML Option Element: `<option>`
- HTML Select Element: `<select>` (alternative for fixed option lists)
- HTML Optgroup Element: `<optgroup>`

---

*Documentation generated from caniuse data. Last updated: 2025-12-13*
