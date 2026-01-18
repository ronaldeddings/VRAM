# CSS Scrollbar Styling

## Overview

**CSS scrollbar styling** provides methods to customize the appearance of scrollbars using CSS properties, including color and width modifications. This feature enables developers to create visually cohesive user interfaces by styling scrollbars to match design systems and brand guidelines.

## Description

Methods of styling scrollbars' color and width through CSS properties. This specification allows developers to control scrollbar appearance on both container elements and the document root, enabling better visual integration with overall page design.

## Specification Status

| Property | Value |
|----------|-------|
| **Status** | Candidate Recommendation (CR) |
| **Spec URL** | [CSS Scrollbars Module Level 1](https://w3c.github.io/csswg-drafts/css-scrollbars-1/) |

## Categories

- **CSS** - Cascading Style Sheets

## Use Cases & Benefits

### Primary Use Cases

1. **Brand Consistency** - Match scrollbar styling to brand colors and design system
2. **Dark Mode Support** - Adapt scrollbar colors for dark and light theme variants
3. **Enhanced UX** - Improve visual hierarchy and user experience through cohesive design
4. **Accessibility** - Improve scrollbar visibility for users with specific accessibility needs
5. **Custom Interfaces** - Create unique visual experiences in web applications
6. **Application-like Feel** - Achieve native application appearance in web browsers

### Key Benefits

- Native CSS-based styling without JavaScript dependencies
- Improved user experience through visual consistency
- Enhanced accessibility through better contrast control
- Reduced need for custom scrollbar libraries
- Cross-browser standardization of scrollbar appearance

## CSS Properties

### Standard W3C Properties

```css
/* Defines the color of scrollbar components */
scrollbar-color: track-color thumb-color;

/* Defines the width of the scrollbar */
scrollbar-width: auto | thin | <length>;
```

### WebKit Pseudo-Elements (Non-Standard)

While not part of the official specification, WebKit-based browsers support styling via pseudo-elements:

```css
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
```

## Browser Support

### Legend

| Symbol | Meaning |
|--------|---------|
| **y** | Full support |
| **a** | Partial support (prefixed/non-standard) |
| **n** | No support |
| **u** | Unknown support |
| **d** | Support disabled by default |

### Support Table

#### Desktop Browsers

| Browser | Support | Versions | Notes |
|---------|---------|----------|-------|
| **Chrome** | Full | 121+ | Partial support (WebKit) 4-120 with `-webkit` prefix |
| **Firefox** | Full | 64+ | Enabled by default from 64+ |
| **Safari** | Partial | 5.1+ | Uses `-webkit-` pseudo-elements (non-standard) |
| **Edge** | Full | 121+ | Partial support (WebKit) 79-120 with `-webkit` prefix |
| **Opera** | Full | 107+ | Partial support (WebKit) 15-106 with `-webkit` prefix |
| **Internet Explorer** | Partial | 5.5-11 | Supports proprietary prefixed properties |

#### Mobile Browsers

| Browser | Support | Notes |
|---------|---------|-------|
| **iOS Safari** | Partial | 7.0+ supports WebKit pseudo-elements (no longer in 14.0+) |
| **Android Chrome** | Full | 142+ |
| **Android Firefox** | Full | 144+ |
| **Android Browser** | Partial | WebKit support from 2.3+ |
| **Samsung Internet** | Full | 25+ |
| **Opera Mobile** | Partial | WebKit support from 80+ |
| **Opera Mini** | No | No support |
| **BlackBerry Browser** | Partial | 7, 10 with WebKit support |

### Implementation Details

#### Specification Compliance

- **Firefox 64+** - Full standard support for `scrollbar-color` and `scrollbar-width`
- **Chrome 121+** - Full standard support
- **Edge 121+** - Full standard support (Chromium-based)
- **Opera 107+** - Full standard support (Chromium-based)

#### WebKit/Blink Implementation

- **Safari 5.1+** - Non-standard pseudo-elements
- **Chrome 4-120** - Non-standard pseudo-elements with `-webkit` prefix
- **Opera 15-106** - Non-standard pseudo-elements with `-webkit` prefix
- **Android browsers** - WebKit implementation varies by version

## Known Issues & Bugs

### Firefox

> **Bug**: In Firefox 64, `scrollbar-color: auto` resolves to two colors rather than auto itself
>
> - Firefox 63 supported legacy properties: `scrollbar-face-color` and `scrollbar-track-color` (now removed from spec)
> - These were replaced with the unified `scrollbar-color` property in Firefox 64+
> - Flag-controlled support available in Firefox 63 via:
>   - `layout.css.scrollbar-colors.enabled`
>   - `layout.css.scrollbar-width.enabled`

### WebView Issues

- Scrollbar styling doesn't work in iOS WKWebView (see [Apache Cordova issue CB-10123](https://issues.apache.org/jira/browse/CB-10123))

## Cross-Browser Considerations

### Feature Fragmentation

Due to browser implementation differences, achieving consistent scrollbar styling across all browsers requires:

1. **Standard Properties** (for modern browsers)
   ```css
   scrollbar-color: #888 #f1f1f1;
   scrollbar-width: thin;
   ```

2. **WebKit Prefix** (for older Chrome, Safari, Edge, Opera)
   ```css
   ::-webkit-scrollbar { width: 10px; }
   ::-webkit-scrollbar-track { background: #f1f1f1; }
   ::-webkit-scrollbar-thumb { background: #888; }
   ```

3. **Internet Explorer** (proprietary properties)
   ```css
   scrollbar-base-color: #888;
   scrollbar-face-color: #888;
   scrollbar-track-color: #f1f1f1;
   ```

### Progressive Enhancement

Use feature detection or CSS `@supports` to provide fallbacks:

```css
@supports (scrollbar-color: auto) {
  /* Modern browsers */
  html {
    scrollbar-color: #888 #f1f1f1;
    scrollbar-width: thin;
  }
}
```

## Related Resources

### W3C Specification
- [CSS Scrollbars Module Level 1](https://w3c.github.io/csswg-drafts/css-scrollbars-1/) - Official W3C specification

### Browser Support & Issues
- [Firefox Support Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1460109) - Track Firefox implementation progress
- [WebKit Blog: Styling Scrollbars](https://webkit.org/blog/363/styling-scrollbars/) - Non-standard WebKit implementation documentation

### Community Resources
- [StackOverflow Discussion](https://stackoverflow.com/questions/9251354/css-customized-scroll-bar-in-div/14150577#14150577) - Cross-browser support discussion
- [CodeMug Tutorial](http://codemug.com/html/custom-scrollbars-using-css/) - IE & WebKit/Blink browser tutorial

### Libraries & Tools
- [Perfect Scrollbar](https://perfectscrollbar.com/) - Minimal custom scrollbar plugin
- [jQuery Custom Content Scroller](https://manos.malihu.gr/jquery-custom-content-scroller/) - jQuery-based solution

## Practical Example

### Basic Implementation (Modern Browsers)

```css
/* Style document scrollbar */
html {
  scrollbar-color: #888 #f1f1f1;
  scrollbar-width: thin;
}

/* Style element scrollbar */
.scrollable-container {
  scrollbar-color: #888 #f1f1f1;
  scrollbar-width: thin;
}
```

### Fallback with WebKit Support

```css
/* Modern browsers */
html {
  scrollbar-color: #888 #f1f1f1;
  scrollbar-width: thin;
}

/* WebKit browsers (Chrome, Safari, Edge, Opera) */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
```

### Dark Mode Support

```css
/* Light mode */
html {
  scrollbar-color: #888 #f1f1f1;
  scrollbar-width: thin;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  html {
    scrollbar-color: #777 #2a2a2a;
  }

  ::-webkit-scrollbar-track {
    background: #2a2a2a;
  }

  ::-webkit-scrollbar-thumb {
    background: #777;
  }
}
```

## Global Support Summary

- **Global Usage**: 74.96% of users have browser support (full or partial)
- **Partial Support**: 9.61% of users on browsers with non-standard implementations
- **Full Standard Support**: ~65% with modern browsers (Chrome 121+, Firefox 64+, Edge 121+, Opera 107+)

## See Also

- [CSS Overflow Module](https://w3c.github.io/csswg-drafts/css-overflow-3/) - Related overflow handling
- [Pointer Events Specification](https://www.w3.org/TR/pointerevents/) - Interaction with scrollbars
- [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/) - Color values for scrollbar styling

---

**Last Updated**: 2024
**Spec Status**: Candidate Recommendation (CR)
**Browser Coverage**: 84.57% with full or partial support
