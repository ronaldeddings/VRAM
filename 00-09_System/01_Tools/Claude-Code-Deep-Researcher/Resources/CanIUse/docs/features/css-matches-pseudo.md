# :is() CSS Pseudo-Class

## Overview

The `:is()` pseudo-class (formerly `:matches()`, formerly `:any()`) checks whether the element at its position in the outer selector matches any of the selectors in its selector list. It's useful syntactic sugar that allows you to avoid writing out all the combinations manually as separate selectors. The effect is similar to nesting in Sass and most other CSS preprocessors.

## Specification

- **Status**: Working Draft (WD)
- **Specification URL**: [W3C Selectors Level 4](https://www.w3.org/TR/selectors4/#matches)

## Categories

- CSS

## Benefits and Use Cases

### Reduced CSS Code Duplication
Instead of writing separate selectors for multiple element patterns, combine them into a single `:is()` selector, reducing file size and maintenance burden.

### Improved Readability
The `:is()` syntax is more intuitive and self-documenting compared to writing out long selector chains manually.

### Cleaner CSS Architecture
Write more maintainable CSS by grouping related selectors logically without creating redundant code blocks.

### Sass-like Functionality in Native CSS
Provides CSS nesting-like capabilities at the selector level, reducing the need for CSS preprocessors for certain use cases.

### Enhanced Selector Flexibility
Easily create flexible selectors that match multiple element patterns without affecting specificity calculations (`:is()` uses specificity of the most specific selector in its list).

## Browser Support

### Current Support Status

| Browser | Full Support | Notes |
|---------|:---:|---|
| **Chrome** | 88+ | Partial support (webkit prefix) from 15-87 |
| **Edge** | 88+ | Partial support (webkit prefix) from 79-87 |
| **Firefox** | 78+ | Partial support (moz prefix) from 4-77 |
| **Safari** | 14+ | Partial support (webkit prefix) from 5.1-13 |
| **Opera** | 75+ | Partial support from 15-74 |
| **iOS Safari** | 14+ | Partial support from 7.0-13.4 |
| **Android** | 142+ | Partial support from 4-4.4.4 |
| **Internet Explorer** | Not supported | — |
| **Opera Mini** | Not supported | — |

### Global Usage

- **Full Support**: 92.21%
- **Partial Support**: 1.05%
- **No Support**: 6.74%

## Support Details by Browser

### Desktop Browsers

#### Chrome
- **Full Support**: Version 88+
- **Partial Support**: Versions 15-87 (requires `-webkit-any()` prefix)
- **Flag Support**: Versions 65-87 with `Experimental Web Platform features` flag enabled

#### Edge
- **Full Support**: Version 88+
- **Partial Support**: Versions 79-87 (requires `-webkit-any()` prefix)
- **Flag Support**: Versions 79-87 with `Experimental Web Platform features` flag enabled

#### Firefox
- **Full Support**: Version 78+
- **Partial Support**: Versions 4-77 (requires `-moz-any()` prefix)
- **Note**: Long period of partial support through the extended Firefox release cycle

#### Safari
- **Full Support**: Version 14+
- **Partial Support**: Versions 5.1-13 (supports both `-webkit-any()` and `:matches()`)
- **Earlier Versions**: Unsupported in versions 3.1-5

#### Opera
- **Full Support**: Version 75+
- **Partial Support**: Versions 15-74 (requires `-webkit-any()` prefix)
- **Flag Support**: Versions 52-74 with experimental flag

#### Internet Explorer
- **Not Supported**: All versions (IE 5.5-11)

### Mobile Browsers

#### iOS Safari
- **Full Support**: Version 14.0+
- **Partial Support**: Versions 7.0-13.4 (supports both `-webkit-any()` and `:matches()`)

#### Android Browser
- **Full Support**: Version 142+
- **Partial Support**: Versions 4-4.4.3 (requires `-webkit-any()` prefix)

#### Samsung Internet
- **Full Support**: Version 15.0+
- **Partial Support**: Versions 4-14.0 (requires `-webkit-any()` prefix)

#### Opera Mobile
- **Full Support**: Version 80+
- **Not Supported**: Versions 10-12.1

#### Android Chrome
- **Full Support**: Version 142+

#### Android Firefox
- **Full Support**: Version 144+

#### Other Mobile Browsers
- **Opera Mini**: Not supported
- **IE Mobile**: Not supported (IE 10-11)
- **BlackBerry**: Partial support (BB 10 with `-webkit-any()`)
- **UC Browser**: Full support (15.5+)
- **Baidu**: Full support (13.52+)
- **KaiOS**: Full support (3.0-3.1)

## Naming History

The `:is()` pseudo-class has evolved through multiple naming conventions:

1. **`:any()`** - Original proposed name (not widely adopted)
2. **`:matches()`** - Early implementation name (still recognized but deprecated)
3. **`:is()`** - Current standard name (recommended for all new code)

### Vendor-Specific Prefixes

- **`:-webkit-any()`** - WebKit implementation (Chrome, Safari, Opera)
- **`:-moz-any()`** - Mozilla Firefox implementation (deprecated)

## Usage Examples

### Basic Syntax

```css
/* Matches any h1, h2, h3, h4, h5, or h6 element */
:is(h1, h2, h3, h4, h5, h6) {
  margin: 0.83em 0;
  font-weight: bold;
}

/* Traditional equivalent - much more verbose */
h1, h2, h3, h4, h5, h6 {
  margin: 0.83em 0;
  font-weight: bold;
}
```

### Complex Selectors

```css
/* Matches paragraphs inside articles or sections */
:is(article, section) p {
  line-height: 1.6;
  text-align: justify;
}

/* Matches links in headers with specific classes */
:is(header, footer) :is(.nav, .footer-nav) a {
  color: #0066cc;
  text-decoration: none;
}
```

### With Pseudo-classes and Pseudo-elements

```css
/* Interactive elements in focus state */
:is(a, button, input, textarea):focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Paragraphs in different containers at hover */
:is(article, aside, main) p:hover {
  background-color: #f0f0f0;
}
```

## Specificity Behavior

The `:is()` pseudo-class has special specificity rules:

- The specificity of `:is()` is replaced by the specificity of the most specific selector in its argument list
- This differs from `:where()`, which always has 0 specificity

```css
/* This has the specificity of .intro (0, 1, 0) */
:is(.intro, .headline) {
  font-size: 1.5em;
}

/* This has the specificity of a compound selector (0, 0, 1) */
:where(p, div) {
  margin: 1em 0;
}
```

## Differences from :where()

| Feature | `:is()` | `:where()` |
|---------|:-------:|:---------:|
| **Specificity** | Uses most specific selector's specificity | Always 0 specificity |
| **Use Case** | When specificity matters | When you want to avoid specificity issues |
| **Browser Support** | Same (88+ for full support) | Same (88+ for full support) |

## Known Limitations

### Partial Support in Older Browsers

Browsers with versions older than the full support version listed above only support vendor-prefixed versions:
- Chrome, Safari, Opera: Requires `-webkit-any()` prefix
- Firefox: Requires `-moz-any()` prefix

These older implementations may not work identically to the current standard and should be tested thoroughly.

### Experimental Features Flag

Certain browsers allow enabling `:is()` support via an experimental features flag before full standardization:

- **Chrome/Edge Versions 65-87**: Enable "Experimental Web Platform features" flag
- **Opera Versions 52-74**: Enable experimental features flag

### No Support in Internet Explorer

Internet Explorer (all versions) does not support `:is()`, `:-webkit-any()`, or `:-moz-any()`. If IE support is required, use traditional multi-selector syntax.

### Selector Validation

Invalid selectors within `:is()` will invalidate the entire selector list (unlike `:where()` and `:has()` which use forgiving selector parsing).

## Browser Vendor Information

- **WebKit/Blink Blog**: [CSS Selectors Inside Selectors - Discover :matches(), :not(), and nth-child()](https://webkit.org/blog/3615/css-selectors-inside-selectors-discover-matches-not-and-nth-child/)
- **Chrome Issue Tracker**: [Chrome support for :is()](https://bugs.chromium.org/p/chromium/issues/detail?id=568705)

## Related Features

### Related CSS Pseudo-classes

- **`:where()`** - Similar to `:is()` but with 0 specificity
- **`:not()`** - Matches elements that don't match a selector
- **`:has()`** - Parent selector that matches elements containing specific descendants
- **`:is()`** - Groups selectors for matching (this feature)

### Related CSS Concepts

- **CSS Nesting** - Upcoming CSS feature providing nesting similar to preprocessors
- **CSS Selectors Level 4** - Specification containing modern selector features
- **CSS Preprocessors** - Tools like Sass that have offered similar functionality for years

## Browser Testing Resources

- **CodePen Modern Tests**: [MWKErBe](https://codepen.io/atjn/full/MWKErBe)
- **JS Bin Legacy Tests**: [lehina](https://output.jsbin.com/lehina)
- **MDN Web Docs**: [CSS :is() - Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/CSS/:is)

## Migration Path

### From `:matches()` and `:any()`

If you're currently using `:matches()` or `:-webkit-any()` / `:-moz-any()`:

```css
/* Old syntax - deprecated but still supported */
:-webkit-any(.nav, .menu) a {
  color: blue;
}

/* New standard syntax - recommended */
:is(.nav, .menu) a {
  color: blue;
}
```

### Fallback Support for Older Browsers

For projects requiring broader browser support:

```css
/* Fallback for browsers without :is() support */
.nav a, .menu a {
  color: blue;
}

/* Enhanced syntax for modern browsers */
:is(.nav, .menu) a {
  color: blue;
}
```

## Recommendations

1. **Use `:is()` for new projects** targeting modern browsers (88+ across major vendors)
2. **Consider vendor prefixes** only if supporting Chrome/Safari/Firefox versions from 2015-2020
3. **Use `:where()` when specificity issues arise** with `:is()` in complex stylesheets
4. **For IE support**, use traditional comma-separated selectors as a fallback
5. **Test thoroughly** with the resources provided if supporting partial-support browsers

---

**Last Updated**: Based on CanIUse data as of 2025
