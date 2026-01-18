# Extended System Fonts (`ui-serif`, `ui-sans-serif`, `ui-monospace`, `ui-rounded`)

## Overview

The extended system fonts feature provides CSS `font-family` keywords that allow developers to reference system interface fonts directly, giving better control and consistency when choosing fonts that match the user's operating system interface.

## Description

This CSS feature introduces four new generic font family values:

- **`ui-serif`** - System serif font used in the user interface
- **`ui-sans-serif`** - System sans-serif font used in the user interface
- **`ui-monospace`** - System monospace font used in the user interface
- **`ui-rounded`** - System rounded sans-serif font used in the user interface

These keywords allow web designers to leverage the native system fonts for a more native-like appearance and better integration with the operating system's visual design language.

## Specification Status

**Status:** Working Draft (WD)

**W3C Specification:** [CSS Fonts Module Level 4 - UI Serif Definition](https://w3c.github.io/csswg-drafts/css-fonts-4/#ui-serif-def)

## Categories

- **CSS**

## Benefits and Use Cases

### Key Benefits

1. **Native Appearance** - Applications can match the look and feel of native system applications
2. **Consistency** - Fonts remain consistent with the user's OS and system settings
3. **Performance** - No need to download custom fonts; uses system fonts already loaded in memory
4. **Accessibility** - Respects user preferences and system accessibility settings
5. **Bandwidth Savings** - Eliminates web font downloads for users who prefer system fonts
6. **Language Support** - Automatically uses appropriate fonts for different languages per system configuration

### Ideal Use Cases

- **Operating System-like Web Applications** - Web apps that want to match native app appearance
- **Electron-based Applications** - Desktop apps built with web technologies
- **System Settings and Admin Interfaces** - Applications that mimic system UI
- **Accessibility-focused Design** - Respecting user's system font preferences
- **Performance-critical Applications** - Where bandwidth and rendering speed matter
- **Fallback Fonts** - As part of a font stack for reliable font loading

## Example Usage

```css
/* Use system sans-serif font */
body {
  font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
}

/* Use system monospace font for code */
code, pre {
  font-family: ui-monospace, Menlo, Consolas, monospace;
}

/* Use system serif font */
.serif-text {
  font-family: ui-serif, Georgia, serif;
}

/* Use system rounded sans-serif font */
.rounded {
  font-family: ui-rounded, -apple-system, BlinkMacSystemFont, sans-serif;
}
```

## Browser Support

| Browser | Support | First Version |
|---------|---------|---------------|
| Chrome | ❌ No | Not supported |
| Edge | ❌ No | Not supported |
| Firefox | ❌ No | Not supported |
| Safari | ✅ Yes | 13.1 |
| Opera | ❌ No | Not supported |
| IE | ❌ No | Not supported |

### Detailed Browser Support Table

#### Desktop Browsers

| Browser | Version | Support |
|---------|---------|---------|
| Safari | 13.1+ | ✅ Full Support |
| Safari | 14.0+ | ✅ Full Support |
| Safari | 15.0+ | ✅ Full Support |
| Safari | 16.0+ | ✅ Full Support |
| Safari | 17.0+ | ✅ Full Support |
| Safari | 18.0+ | ✅ Full Support |
| Safari | 26.0+ (TP) | ✅ Full Support |
| Chrome | All versions | ❌ Not Supported |
| Firefox | All versions | ❌ Not Supported |
| Edge | All versions | ❌ Not Supported |
| Opera | All versions | ❌ Not Supported |

#### Mobile Browsers

| Browser | Version | Support |
|---------|---------|---------|
| iOS Safari | 13.4-13.7 | ✅ Full Support |
| iOS Safari | 14.0+ | ✅ Full Support |
| iOS Safari | 15.0+ | ✅ Full Support |
| iOS Safari | 16.0+ | ✅ Full Support |
| iOS Safari | 17.0+ | ✅ Full Support |
| iOS Safari | 18.0+ | ✅ Full Support |
| Chrome Mobile | All versions | ❌ Not Supported |
| Firefox Mobile | All versions | ❌ Not Supported |
| Samsung Internet | All versions | ❌ Not Supported |
| Opera Mini | All versions | ❌ Not Supported |
| Opera Mobile | All versions | ❌ Not Supported |
| Android Browser | All versions | ❌ Not Supported |

## Implementation Status

**Current Global Usage:** 10.36% (primarily Safari users)

**Support Level:**
- **Full Support:** Safari 13.1+ and iOS Safari 13.4+
- **No Support:** All other major browsers

## Technical Notes

### Fallback Strategy

Since this feature is only supported in Safari, it's recommended to always provide fallback fonts:

```css
body {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
               "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
}
```

### Feature Detection

You can detect support using CSS `@supports`:

```css
@supports (font-family: ui-sans-serif) {
  body {
    font-family: ui-sans-serif;
  }
}

@supports not (font-family: ui-sans-serif) {
  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  }
}
```

### System Font Mappings

On macOS/iOS, these keywords typically map to:
- **`ui-serif`** → SF Pro Display (serif variant)
- **`ui-sans-serif`** → SF Pro Display
- **`ui-monospace`** → SF Mono
- **`ui-rounded`** → SF Pro Rounded

### Related CSS Features

- `system-ui` - Generic font family keyword for system UI fonts
- `-apple-system` - Apple-specific system font fallback
- `font-family` - CSS property for specifying fonts

## References and Links

### Official Specifications
- [CSS Fonts Module Level 4 - Specification](https://w3c.github.io/csswg-drafts/css-fonts-4/#ui-serif-def)

### Browser Implementation
- [WebKit Safari 13.1 Feature Announcement](https://webkit.org/blog/10247/new-webkit-features-in-safari-13-1/)
- [Chromium Issue Tracker](https://bugs.chromium.org/p/chromium/issues/detail?id=1029069)

### Mozilla Firefox Tracking Issues
- [ui-serif Support Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1598879)
- [ui-sans-serif Support Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1598880)
- [ui-monospace Support Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1598881)
- [ui-rounded Support Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1598883)

## Recommendations

### For Apple/Safari-Only Applications
If you're building applications specifically for Safari users or have a Safari-heavy user base, this feature is safe to use with appropriate fallbacks.

### For Cross-Browser Applications
Include fallback fonts and consider using feature detection or progressive enhancement to ensure your site displays correctly in all browsers.

### Best Practices

1. **Always provide fallbacks** - Never rely solely on these keywords
2. **Use feature detection** - Use `@supports` to detect support
3. **Test thoroughly** - Test on both Safari and non-Safari browsers
4. **Monitor browser support** - Check for updates as other browsers implement support
5. **Consider performance** - System fonts are always the best choice for performance

## Related Articles

- [CSS Generic Font Families](https://developer.mozilla.org/en-US/docs/Web/CSS/generic-family)
- [System UI Fonts](https://www.w3.org/TR/css-fonts-4/#system-fonts)
- [Font Loading and Performance](https://web.dev/optimize-web-fonts/)

---

**Last Updated:** December 2025
**Feature ID:** extended-system-fonts
**Keywords:** font-family, ui-serif, ui-sans-serif, ui-monospace, ui-rounded, CSS, system fonts
