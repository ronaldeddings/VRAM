# text-decoration styling

## Overview

The `text-decoration` styling feature provides methods for defining the type, style, and color of lines in the text-decoration property. These properties can be defined as a shorthand (e.g., `text-decoration: line-through dashed blue`) or as individual properties (e.g., `text-decoration-color: blue`).

## Description

This CSS3 feature allows developers to control text decoration lines with fine-grained control over:

- **Decoration Line Types**: `underline`, `overline`, `line-through`, `blink`
- **Decoration Styles**: `solid`, `double`, `dotted`, `dashed`, `wavy`
- **Decoration Colors**: Any valid CSS color value
- **Skip Behavior**: Control how decorations interact with descenders and spaces

### Related Properties

- `text-decoration-line` - Specifies the type of line decoration
- `text-decoration-color` - Specifies the color of the decoration line
- `text-decoration-style` - Specifies the style of the decoration line
- `text-decoration-skip` - Controls decoration line behavior around text features

## Specification Status

- **Status**: Candidate Recommendation (CR)
- **Specification**: [W3C CSS Text Decoration Module Level 3](https://www.w3.org/TR/css-text-decor-3/#line-decoration)

## Categories

- CSS3

## Use Cases & Benefits

- **Enhanced Typography**: Add visual emphasis with custom decoration styles beyond simple underlines
- **Accessible Links**: Style links with colored, dashed, or dotted underlines for better visual hierarchy
- **Design Flexibility**: Create custom underlines with different colors and styles than the text
- **Branding**: Apply brand colors to text decorations for visual consistency
- **UI Components**: Create decorative elements for buttons, links, and interactive elements
- **Accessibility**: Provide alternative visual indicators beyond color alone
- **Text Emphasis**: Add decorative lines above or below text for special emphasis

## Browser Support

### Support Legend

- `y` - Fully Supported
- `a` - Partial Support
- `n` - Not Supported
- `x` - Requires Prefix
- `d` - Behind a Flag/Feature Flag

### Desktop Browsers

| Browser | Versions | Support | Notes |
|---------|----------|---------|-------|
| **Chrome** | 4-56 | `n` (with flag) | Enabled via "experimental Web Platform features" flag (#1) |
| | 57+ | `a` | Partial support - `text-decoration-skip` only supports `objects` and `ink` (#5) |
| **Firefox** | 2-5 | `n` | Not supported |
| | 6-35 | `a x` | Partial support with prefix; no `text-decoration-skip` (#4) |
| | 36+ | `a` | Partial support; no `text-decoration-skip` (#4) |
| **Safari** | 3.1-7 | `n` | Not supported |
| | 7.1 | `a x` | Partial support with prefix; missing `text-decoration-style` and `text-decoration-skip` (#2, #4) |
| | 8-12.0 | `a x` | Partial support with prefix; includes `-webkit-text-decoration-skip` (#2, #3) |
| | 12.1+ | `a` | Partial support; no `text-decoration-style` and `text-decoration-skip` (#2, #3) |
| **Edge** | 12-18 | `n` | Not supported |
| | 79+ | `a` | Partial support; `text-decoration-skip` only supports `objects` and `ink` (#5) |
| **Opera** | 9-34 | `n` | Not supported |
| | 35-43 | `n` (with flag) | Enabled via experimental feature flag (#1) |
| | 44+ | `a` | Partial support; `text-decoration-skip` only supports `objects` and `ink` (#5) |
| **Internet Explorer** | 5.5-11 | `n` | Not supported |

### Mobile Browsers

| Browser | Versions | Support | Notes |
|---------|----------|---------|-------|
| **Safari iOS** | 3.2-7.1 | `n` | Not supported |
| | 8+ | `a x` | Partial support with prefix; missing `text-decoration-style` (#2) |
| **Chrome Android** | 4-141 | `n` | Not supported |
| | 142+ | `a` | Partial support (#5) |
| **Firefox Android** | 144+ | `a` | Partial support; no `text-decoration-skip` (#4) |
| **Opera Mini** | All | `n` | Not supported |
| **Opera Mobile** | 10-79 | `n` | Not supported |
| | 80+ | `a` | Partial support (#5) |
| **UC Browser** | 15.5+ | `a` | Partial support (#5) |
| **Samsung Internet** | 4-6 | `n` | Not supported |
| | 7.2+ | `a` | Partial support (#5) |
| **Android Browser** | 2.1-4.4.3 | `n` | Not supported |
| | 142+ | `y` | Fully supported |
| **Android UC Browser** | 15.5+ | `a` | Partial support (#5) |
| **QQ Browser Android** | 14.9+ | `a` | Partial support (#5) |
| **Baidu Browser** | 13.52+ | `a` | Partial support (#5) |
| **Blackberry Browser** | 7, 10 | `n` | Not supported |
| **IE Mobile** | 10-11 | `n` | Not supported |
| **KaiOS** | 2.5-3.1 | `a` | Partial support; no `text-decoration-skip` (#4) |

## Implementation Notes

### CSS2 Compatibility

All browsers support the CSS2 version of `text-decoration`, which only matches the `text-decoration-line` values (`underline`, `overline`, `line-through`, etc.). The enhanced CSS3 features provide more granular control.

### Partial Support Breakdown

**Note #1**: Available in Chrome and Opera through the "experimental Web Platform features" flag in `chrome://flags`

**Note #2**: Partial support refers to not supporting the `text-decoration-style` property

**Note #3**: Safari 8+ supports `-webkit-text-decoration-skip` with values `none` and `skip` (other values behave like `none` or `skip`)

**Note #4**: Partial support refers to not supporting the `text-decoration-skip` property

**Note #5**: Partial support refers to `text-decoration-skip` only supporting values `objects` and `ink`

## Usage Statistics

- **Full Support**: 0.46% of browsers
- **Partial Support**: 92.66% of browsers
- **No Support**: 7.88% of browsers

## Example Usage

### Basic Shorthand

```css
/* All-in-one shorthand */
text-decoration: underline dashed blue;
text-decoration: line-through wavy red;
```

### Individual Properties

```css
/* Using individual properties for granular control */
text-decoration-line: underline;
text-decoration-color: #0066cc;
text-decoration-style: dashed;
text-decoration-skip: objects;
```

### Practical Example

```css
/* Custom styled links */
a {
  text-decoration: underline dotted #ff6b6b;
  text-decoration-skip: spaces;
}

/* Emphasis with wavy underline */
.emphasis {
  text-decoration: underline wavy #ff9800;
}

/* Strikethrough with custom style */
.deleted {
  text-decoration: line-through double #999;
}
```

## Recommendations

### For Maximum Compatibility

Since partial support is dominant, test thoroughly across target browsers. Consider:

1. **Fallback**: Always ensure basic `text-decoration` works as fallback
2. **Feature Detection**: Use CSS feature queries to provide alternatives
3. **Progressive Enhancement**: Start with basic underlines and enhance with colors/styles where supported
4. **Testing**: Verify appearance across major browsers before deploying

### Feature Detection

```css
@supports (text-decoration-color: red) {
  /* Enhanced text decoration support */
  a {
    text-decoration-color: blue;
  }
}
```

## Browser-Specific Concerns

### Firefox

- Firefox 6+ supports most features with partial implementation
- `text-decoration-skip` is not supported
- Prefixed versions in early Firefox versions

### Safari & WebKit

- Requires `-webkit-` prefix on earlier versions
- `text-decoration-style` not fully supported
- `-webkit-text-decoration-skip` has limited value support

### Chrome & Edge

- Solid support from version 57+ (Chrome) and 79+ (Edge)
- `text-decoration-skip` limited to `objects` and `ink` values
- Early versions required experimental flag

## Related Resources

- [MDN: text-decoration-style](https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-style)
- [MDN: text-decoration-color](https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-color)
- [MDN: text-decoration-line](https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-line)
- [MDN: text-decoration-skip](https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-skip)
- [Firefox Implementation Bug #812990](https://bugzilla.mozilla.org/show_bug.cgi?id=812990)
- [W3C CSS Text Decoration Module Level 3](https://www.w3.org/TR/css-text-decor-3/#line-decoration)

## Summary

The `text-decoration` styling feature is widely supported in modern browsers with 92.66% having partial support. While all browsers recognize the CSS2 basic `text-decoration` property, full CSS3 features like `text-decoration-color` and `text-decoration-style` have varying levels of support. This feature is excellent for enhancing typography and creating visually distinctive UI elements, though developers should test thoroughly and provide fallbacks for maximum compatibility.
