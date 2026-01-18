# Context Menu Item (menuitem element)

## Overview

The `<menuitem>` element was intended to provide a standardized way to define context menu items in HTML. However, this feature is **no longer recommended** and has been removed from the HTML specification.

## Status

- **Specification Status:** Unofficial/Deprecated
- **Current Status:** Removed from HTML specification
- **Category:** HTML5
- **Last Updated:** As per CanIUse data

## Description

The `<menuitem>` element was a method of defining context menu items within HTML5. It was originally designed to allow developers to create native-looking context menus without relying on JavaScript libraries or custom implementations. However, due to lack of browser support and implementation challenges, the feature was deprecated and subsequently removed from the HTML specification.

For more information, see the [HTML specification issue](https://github.com/whatwg/html/issues/2730).

## Use Cases & Benefits

While the feature is deprecated, understanding it provides context for:

- **Historical web development:** Understanding deprecated HTML features and their evolution
- **Legacy application maintenance:** Working with older codebases that may have attempted to use this feature
- **Context menu alternatives:** Learning why developers should use alternative approaches like custom JavaScript implementations or the Popover API

## Browser Support Summary

**Overall Support Status:** Virtually no production support

| Browser | Support Status | Notes |
|---------|---|---|
| **Chrome** | ✗ Not Supported | No support; partially supported (deprecated) in versions 41-60 with feature flag |
| **Firefox** | ≈ Partial | Supported from version 8 onwards for context menus only (not toolbar menus) |
| **Safari** | ✗ Not Supported | No support across any version |
| **Opera** | ✗ Not Supported | Partially supported (deprecated) in versions 35-46 with feature flag |
| **Edge** | ✗ Not Supported | No support across any version |
| **Internet Explorer** | ✗ Not Supported | No support across any version |
| **Mobile Browsers** | ✗ Not Supported | No support in iOS Safari, Android, or mobile Chrome/Firefox |

### Support Legend

- **✓ Full Support:** Feature fully implemented and working
- **≈ Partial Support:** Feature partially implemented with limitations
- **⚗ With Flag:** Feature available but requires enabling a browser flag/preference
- **✗ Not Supported:** Feature not implemented
- **d** = Disabled by default

## Detailed Browser Support

### Desktop Browsers

#### Firefox
- **Versions 8-84:** Partial support (limited to context menus only, not toolbar menus)
- **Versions 85+:** Not supported; disabled by default (requires `dom.menuitem.enabled` preference in `about:config`)

#### Chrome
- **Versions 41-60:** Not supported; disabled by default (available as deprecated feature)
- **Versions 61+:** Not supported

#### Opera
- **Versions 35-46:** Not supported; disabled by default
- **Versions 47+:** Not supported

#### Safari
- **All versions:** Not supported

#### Edge
- **All versions:** Not supported

#### Internet Explorer
- **All versions:** Not supported

### Mobile Browsers

- **iOS Safari:** No support across all versions
- **Android Browser:** No support across all versions
- **Chrome Mobile:** No support
- **Firefox Mobile (version 144):** Disabled by default (requires preference)
- **Samsung Internet:** No support
- **UC Browser:** No support
- **Opera Mobile:** No support
- **Opera Mini:** No support across all versions

## Recommendations

### Don't Use

The `<menuitem>` element should **not** be used in new projects due to:

1. **Lack of cross-browser support:** Only limited support in Firefox
2. **Removed from specification:** Feature has been formally removed from HTML standards
3. **Better alternatives exist:** More reliable methods are available

### Alternatives

For implementing context menus, consider:

1. **Custom JavaScript Implementation:**
   - Use event listeners for `contextmenu` events
   - Build custom menus with HTML/CSS/JavaScript
   - Provides complete control and cross-browser compatibility

2. **jQuery ContextMenu:**
   - Lightweight library with cross-browser support
   - Easy to implement and customize

3. **Popover API:**
   - Modern approach for creating popover content
   - Better standardization and browser support

4. **Web Components:**
   - Create custom elements with consistent behavior
   - Full control over functionality and styling

## Technical Details

### Element Syntax

```html
<menu>
  <menuitem label="Save" onclick="save()"></menuitem>
  <menuitem label="Close" onclick="close()"></menuitem>
</menu>
```

### Feature Flags

If exploring this feature for historical/research purposes:

- **Firefox:** Enable `dom.menuitem.enabled` preference in `about:config`
- **Chrome:** Available as deprecated feature in earlier versions (41-60)
- **Opera:** Available as deprecated feature in earlier versions (35-46)

## Related Resources

### Specifications & Documentation

- [W3C HTML5.1 Specification](https://www.w3.org/TR/2016/REC-html51-20161101/interactive-elements.html#context-menus)
- [GitHub Issue - HTML Specification Removal](https://github.com/whatwg/html/issues/2730)

### Testing & Detection

- [Demo (Mozilla Archive)](https://bug617528.bugzilla.mozilla.org/attachment.cgi?id=554309)
- [has.js Context Menu Event Test](https://raw.github.com/phiggins42/has.js/master/detect/events.js#event-contextmenu)

### Polyfills & Alternatives

- [jQuery ContextMenu Polyfill](https://github.com/swisnl/jQuery-contextMenu)

### Browser Issues & Tracking

- [Firefox Support Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=746087)
- [Chromium Implementation Request](https://bugs.chromium.org/p/chromium/issues/detail?id=87553)

## Support Statistics

- **Full Support (%):** 0%
- **Partial Support (%):** 0.11%
- **No Support (%):** 99.89%

---

## Notes

### Firefox Partial Support Details

Starting with Firefox version 8, partial support was added with the following limitations:

- **Context menus only:** The feature only works with context menus (`<contextmenu>` elements), not toolbar menus
- **Preference required:** Modern Firefox versions (85+) require manually enabling the `dom.menuitem.enabled` preference through `about:config` to use this feature

This limitation was a significant factor in the feature's lack of adoption across the industry.

---

## Summary

The `<menuitem>` element represents an example of a web platform feature that seemed promising but ultimately failed to gain traction due to implementation challenges, limited browser support, and the availability of superior alternatives. Modern developers should avoid this feature and instead use JavaScript-based solutions, the Popover API, or custom web components for context menu functionality.
