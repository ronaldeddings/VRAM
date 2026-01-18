# CSS3 tab-size

## Overview

The `tab-size` CSS property allows you to customize the width of the tab character (U+0009) in HTML documents. This property is particularly useful when displaying code snippets or preformatted text where tab indentation needs to be controlled.

## Description

The `tab-size` property specifies the width of a tab character. It only has an effect when used in conjunction with the `white-space` property set to `pre`, `pre-wrap`, or `break-spaces`. These whitespace values preserve the exact formatting of whitespace characters in the source content, making the `tab-size` property meaningful.

Without an appropriate `white-space` value, tab characters are typically collapsed or converted to spaces by the browser, making `tab-size` ineffective.

## Specification Status

**Status:** Candidate Recommendation (CR)

**Specification URL:** [W3C CSS Text Module Level 3 - tab-size](https://www.w3.org/TR/css3-text/#tab-size)

## Categories

- CSS3

## Benefits & Use Cases

### Primary Use Cases

1. **Code Display**
   - Controlling indentation width in code blocks and syntax highlighters
   - Ensuring consistent code formatting across different browsers
   - Making code examples more readable and properly aligned

2. **Preformatted Text**
   - Customizing tab width in `<pre>` elements
   - Displaying terminal output with appropriate indentation
   - Rendering ASCII art and formatted text data

3. **Developer Tools**
   - Implementing code editors in the browser
   - Building documentation viewers with proper code formatting
   - Creating interactive code playgrounds

### Key Benefits

- **Consistent Formatting:** Standardizes tab width across all browsers, ensuring predictable layout
- **Flexible Indentation:** Allows developers to choose appropriate indentation widths (1-8 spaces typically)
- **Improved Readability:** Makes code and preformatted text easier to read and understand
- **Better UX:** Provides users with control over how indented content appears

## Browser Support

### Support Key

- **✅ Yes (y)** - Full support
- **⚠️ Partial (a)** - Partial support (typically `<integer>` values only, not `<length>` values)
- **❌ No (n)** - Not supported
- **⚠️ x** - Requires prefix or has limitations

### Desktop Browsers

| Browser | Version Range | Status | Notes |
|---------|---------------|--------|-------|
| **Chrome** | 21-40 | ⚠️ Partial | Partial support with limitations |
| **Chrome** | 42+ | ✅ Yes | Full support |
| **Edge** | 12-78 | ❌ No | Not supported |
| **Edge** | 79+ | ✅ Yes | Full support |
| **Firefox** | 2-3.6 | ❌ No | Not supported |
| **Firefox** | 4-52 | ⚠️ Partial | Partial support (requires `-moz-` prefix); `<length>` values not supported |
| **Firefox** | 53+ | ✅ Yes | Full support (unprefixed) |
| **Safari** | 3.1-6 | ❌ No | Not supported |
| **Safari** | 6.1-13 | ⚠️ Partial | Partial support (requires prefix) |
| **Safari** | 13.1+ | ✅ Yes | Full support |
| **Opera** | 9-10.5 | ❌ No | Not supported |
| **Opera** | 10.6-28 | ⚠️ Partial | Partial support with prefix |
| **Opera** | 29+ | ✅ Yes | Full support |

### Mobile & Alternative Browsers

| Browser | Version Range | Status | Notes |
|---------|---------------|--------|-------|
| **iOS Safari** | 3.2-6.1 | ❌ No | Not supported |
| **iOS Safari** | 7.0-13.3 | ⚠️ Partial | Partial support |
| **iOS Safari** | 13.4+ | ✅ Yes | Full support |
| **Android Browser** | 2.1-4.3 | ❌ No | Not supported |
| **Android Browser** | 4.4+ | ⚠️ Partial | Partial support |
| **Android Browser** | 142+ | ✅ Yes | Full support |
| **Chrome (Android)** | 142+ | ✅ Yes | Full support |
| **Firefox (Android)** | 144+ | ✅ Yes | Full support |
| **Opera Mobile** | 10-79 | ⚠️ Partial | Partial support with prefix |
| **Opera Mobile** | 80+ | ✅ Yes | Full support |
| **Opera Mini** | All versions | ⚠️ Partial | Limited support |
| **Samsung Internet** | 4+ | ✅ Yes | Full support |
| **UC Browser (Android)** | 15.5+ | ✅ Yes | Full support |
| **Baidu Browser** | 13.52+ | ✅ Yes | Full support |
| **QQ Browser (Android)** | 14.9+ | ✅ Yes | Full support |
| **BlackBerry** | 7-10 | ⚠️ Partial | Partial support |
| **KaiOS** | 2.5-3.1 | ⚠️ Partial | Partial support with limitations |

### Global Usage

- **Full Support (Y):** 92.79% of users
- **Partial Support (A):** 0.51% of users
- **No Support:** ~6.7% of users

## Known Issues & Limitations

### Firefox Limitation

**Versions 4-52:** Firefox did not support `<length>` values (e.g., `tab-size: 1.5em`). Only `<integer>` values (e.g., `tab-size: 2`) were supported. This limitation was fixed in Firefox 53+.

**Reference:** [Firefox Bug #943918](https://bugzilla.mozilla.org/show_bug.cgi?id=943918)

### Partial Support Definition

When listed as "Partial" (with note #1), browsers support `<integer>` values but not `<length>` values. The `<integer>` value represents the number of space characters that a tab should render as.

**Supported integer values:** `tab-size: 1`, `tab-size: 2`, `tab-size: 4`, `tab-size: 8`, etc.

**Unsupported length values (in older implementations):** `tab-size: 1em`, `tab-size: 20px`, `tab-size: 1.5rem`, etc.

## Syntax

```css
/* Integer values (most common) */
tab-size: 2;
tab-size: 4;
tab-size: 8;

/* Length values (supported in modern browsers) */
tab-size: 1em;
tab-size: 20px;
tab-size: 1.5rem;
```

### Values

- **`<integer>`** - The number of space characters to use as the tab width (default is 8)
- **`<length>`** - The width of the tab character as an absolute or relative length (CSS values like em, px, rem, etc.)

## Example Usage

### Basic Example

```css
pre {
  tab-size: 4;
  white-space: pre;
}

code {
  tab-size: 2;
  white-space: pre-wrap;
}
```

### HTML Example

```html
<pre>
function example() {
	const data = {
		name: 'test',
		value: 123
	};
	console.log(data);
}
</pre>

<style>
  pre {
    tab-size: 2;
    white-space: pre-wrap;
    background: #f4f4f4;
    padding: 1rem;
  }
</style>
```

## Vendor Prefixes

### Historical Prefix Usage

Some older browser implementations required vendor-specific prefixes:

- **Firefox (4-52):** `-moz-tab-size`
- **Opera (10.6-28):** `-webkit-tab-size` or `-moz-tab-size`
- **Safari (6.1-13):** `-webkit-tab-size`

**Note:** Modern browsers (since 2015-2020) support the unprefixed `tab-size` property. Using the unprefixed version is recommended for new projects.

## Compatibility Recommendations

### For Maximum Compatibility

To support the widest range of browsers, consider this approach:

```css
pre {
  -webkit-tab-size: 4;    /* Safari 6.1-13, Chrome 21-40, Opera 10.6-28 */
  -moz-tab-size: 4;       /* Firefox 4-52, Opera 10.6-28 */
  tab-size: 4;            /* Modern browsers */
  white-space: pre-wrap;
}
```

### For Modern Projects

If supporting browsers released after 2015-2020, the unprefixed property is sufficient:

```css
pre {
  tab-size: 4;
  white-space: pre-wrap;
}
```

## Important Notes

1. **Requires `white-space` property:** The `tab-size` property only affects the rendering of tabs when `white-space` is set to `pre`, `pre-wrap`, or `break-spaces`.

2. **Default behavior:** Without `tab-size`, browsers typically render a tab character as 8 space widths.

3. **Semantic meaning:** The `<integer>` value represents the number of space characters equivalent to one tab character.

4. **Performance:** The property has minimal performance impact and is safe to use in production.

5. **Accessibility:** Ensure that tab-width customization doesn't negatively impact readability for users with visual impairments.

## Related Resources

- **[MDN Web Docs - CSS tab-size](https://developer.mozilla.org/en-US/docs/Web/CSS/tab-size)**
  - Comprehensive documentation with additional examples and browser compatibility details

- **[Firefox Bug #737785](https://bugzilla.mozilla.org/show_bug.cgi?id=737785)**
  - Historical reference for unprefixing `-moz-tab-size` in Firefox

- **[W3C CSS Text Module Level 3](https://www.w3.org/TR/css3-text/#tab-size)**
  - Official W3C specification

## Testing Support in Your Browser

To test if your browser supports `tab-size`:

```html
<pre style="tab-size: 2; white-space: pre;">
function test() {
	return 'If this indentation is 2 spaces wide, tab-size is supported';
}
</pre>
```

If the indentation inside the function appears to be 2 spaces wide (rather than the default 8), your browser supports the property.

---

**Last Updated:** 2025
**Feature Status:** Candidate Recommendation (CR)
**Global Support:** 93.3% (92.79% full + 0.51% partial)
