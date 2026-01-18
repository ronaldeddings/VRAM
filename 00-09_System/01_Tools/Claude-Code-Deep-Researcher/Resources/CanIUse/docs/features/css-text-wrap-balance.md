# CSS text-wrap: balance

## Overview

`text-wrap: balance` is a CSS property that allows multiple lines of text to have their lines broken in such a way that each line is roughly the same width. This feature is commonly used to make headlines, titles, and other multi-line text more readable and visually appealing by creating more balanced typography.

## Description

The `text-wrap: balance` property instructs the browser to distribute text across multiple lines in a balanced manner, where each line has approximately equal width. This results in a more aesthetically pleasing layout, particularly beneficial for:

- **Headlines and titles** - Creates visually centered, balanced headlines
- **Pull quotes** - Makes quoted text more visually prominent
- **Navigation items** - Improves layout of multi-line menu items
- **Card titles** - Enhances visual hierarchy in card-based layouts

When applied, the browser calculates the optimal break points to minimize the width of the last line while keeping other lines roughly equal.

## Specification Status

- **Status**: Working Draft (WD)
- **Specification**: [CSS Text Module Level 4](https://www.w3.org/TR/css-text-4/#text-wrap)
- **W3C Standards Track**: Yes

## Categories

- **CSS Text** - Part of the CSS Text Module Level 4

## Benefits and Use Cases

### Visual Improvements

1. **Improved Readability** - Balanced line lengths reduce eye strain and improve comprehension
2. **Professional Appearance** - Creates polished, magazine-quality typography
3. **Better Hierarchy** - Helps emphasize headlines and important text
4. **Responsive Design** - Automatically adjusts to viewport width while maintaining balance

### Practical Applications

- **E-commerce**: Product titles and descriptions
- **Publishing**: Article headlines and pull quotes
- **Marketing**: Campaign taglines and hero text
- **Documentation**: Section headings and emphasis text
- **UI Design**: Navigation menus and card titles
- **Social Media**: Post titles and captions

### Advantages Over Manual Solutions

- **No JavaScript required** - Pure CSS solution
- **Responsive** - Automatically adapts to container width changes
- **Performance** - Native browser implementation, no layout shifts
- **Maintainability** - No need for manual line break markup or hyphens

## Usage

### Basic Syntax

```css
/* Apply balanced text wrapping */
h1 {
  text-wrap: balance;
}

/* Multi-line text benefit */
.headline {
  text-wrap: balance;
  max-width: 600px;
}

/* With other text properties */
.intro {
  text-wrap: balance;
  font-size: 2rem;
  line-height: 1.3;
}
```

### Examples

#### Balanced Headlines

```html
<style>
  h1 {
    text-wrap: balance;
    max-width: 800px;
  }
</style>

<h1>This Long Headline Will Be Balanced</h1>
```

#### With Container Constraints

```html
<style>
  .card-title {
    text-wrap: balance;
    max-width: 300px;
    font-size: 1.5rem;
  }
</style>

<div class="card-title">Featured Product or Service Title</div>
```

## Browser Support

Support data reflects feature availability across major browsers. Note that some browsers only support `text-wrap: balance` without the full `text-wrap-style` property syntax.

### Desktop Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| **Chrome** | 130+ | ✅ Supported | Enabled as of Chrome 130 |
| **Chrome** | 114-129 | 🔄 Preview | Available with feature flag (#1) |
| **Edge** | 130+ | ✅ Supported | Enabled as of Edge 130 |
| **Edge** | 114-129 | 🔄 Preview | Available with feature flag (#1) |
| **Firefox** | 121+ | ✅ Supported | Enabled as of Firefox 121 |
| **Firefox** | 1-120 | ❌ Not Supported | - |
| **Safari** | 17.5+ | ✅ Supported | Enabled as of Safari 17.5 |
| **Safari** | 1-17.4 | ❌ Not Supported | - |
| **Opera** | 116+ | ✅ Supported | Enabled as of Opera 116 |
| **Opera** | 99-115 | 🔄 Preview | Available with feature flag (#1) |
| **Internet Explorer** | All | ❌ Not Supported | - |

### Mobile Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| **Safari iOS** | 17.5+ | ✅ Supported | Enabled as of iOS Safari 17.5 |
| **Safari iOS** | 1-17.4 | ❌ Not Supported | - |
| **Chrome Android** | 142+ | ✅ Supported | - |
| **Firefox Android** | 144+ | ✅ Supported | - |
| **Samsung Internet** | 23+ | 🔄 Preview | Available with feature flag (#1) |
| **Samsung Internet** | 1-22 | ❌ Not Supported | - |
| **Opera Mobile** | 80+ | 🔄 Preview | Available with feature flag (#1) |
| **Opera Mobile** | 1-79 | ❌ Not Supported | - |
| **UC Browser** | All | ❌ Not Supported | - |
| **Opera Mini** | All | ❌ Not Supported | - |

### Legend

- **✅ Supported** - Feature fully implemented and enabled by default
- **🔄 Preview** - Feature available through feature flags or experimental settings
- **❌ Not Supported** - Feature not implemented

## Current Support Summary

- **Full Support (Enabled)**: ~80.14% of global users
- **Partial Support (Feature Flag)**: ~5.46% of global users
- **No Support**: ~14.40% of global users

## Implementation Notes

### Note #1: Limited Syntax Support

Some browsers (Chrome, Edge, Opera, and Samsung Internet versions with preview support) only support the `text-wrap: balance` shorthand notation. They do not support the full `text-wrap-style: balance` property syntax.

```css
/* Supported in preview/partial support browsers */
text-wrap: balance;

/* Not supported in preview/partial support browsers */
text-wrap-style: balance;
```

## Fallback Strategies

For browsers that don't support `text-wrap: balance`, consider these alternatives:

### 1. Hyphenation

```css
h1 {
  text-wrap: balance;
  hyphens: auto;
  word-break: break-word;
}
```

### 2. Forced Line Breaks

Use `<br>` elements for critical text that must break in specific places:

```html
<h1>Long Headline That Should<br>Break Here</h1>
```

### 3. JavaScript Polyfill

Use the [Adobe balance-text polyfill](https://github.com/adobe/balance-text) for older browsers:

```html
<script src="https://unpkg.com/balance-text"></script>
<script>
  balanceText();
</script>
```

### 4. Feature Detection

```javascript
// Detect support
const isSupported = CSS.supports('text-wrap', 'balance');

if (!isSupported) {
  // Apply fallback styles
  document.documentElement.classList.add('no-text-wrap-balance');
}
```

## Compatibility Considerations

### When to Use

- ✅ Headlines and titles
- ✅ Pull quotes and callouts
- ✅ Navigation labels
- ✅ Card titles
- ✅ Hero sections

### When to Avoid

- ❌ Long body text (may impact readability negatively)
- ❌ Performance-critical applications with thousands of elements
- ❌ Text that requires precise layout control
- ❌ Code blocks and pre-formatted text

### Browser Capabilities Timeline

- **Safari**: Adoption started in September 2023 (Safari 17.5)
- **Chrome/Edge**: Adoption started January 2025 (Chrome 130, Edge 130)
- **Firefox**: Adoption started January 2025 (Firefox 121)
- **Opera**: Adoption started January 2025 (Opera 116)

## Related Resources

### Official Documentation

- [W3C CSS Text Module Level 4 Specification](https://www.w3.org/TR/css-text-4/#text-wrap)

### Issue Tracking

- [WebKit Support Bug](https://bugs.webkit.org/show_bug.cgi?id=249840)
- [Firefox Support Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1731541)

### Additional Resources

- [Blog Post: Text Balance in CSS is Coming](https://dev.to/hunzaboy/text-balance-in-css-is-coming-17e3) - Educational article explaining the feature
- [Adobe balance-text Polyfill](https://github.com/adobe/balance-text) - JavaScript fallback solution for older browsers
- [Can I Use: text-wrap](https://caniuse.com/css-text-wrap-balance) - Real-time browser support data

## Recommendations

### Best Practices

1. **Use for headings** - Apply `text-wrap: balance` to all major headings for improved visual hierarchy
2. **Limit scope** - Reserve for text elements with controlled width (max-width constraints)
3. **Test responsively** - Ensure balanced text remains readable at all breakpoints
4. **Provide fallbacks** - For critical text, consider feature detection and fallback solutions
5. **Monitor performance** - Use sparingly on pages with thousands of text elements

### Progressive Enhancement

```css
/* Progressive enhancement approach */
h1 {
  /* Standard approach for older browsers */
  display: inline-block;
}

@supports (text-wrap: balance) {
  h1 {
    text-wrap: balance;
    display: block; /* Reset if needed */
  }
}
```

## Browser-Specific Notes

### Chrome/Edge/Opera Preview

When using the preview version, enable the feature flag:
- Chrome: `chrome://flags` → Search for "text-wrap-balance"
- Edge: `edge://flags` → Search for "text-wrap-balance"

### Safari Considerations

Safari 17.5 and later provides full support. For iOS apps targeting older versions, ensure fallback styles are in place.

### Firefox Implementation

Firefox 121+ supports the feature with full CSS Text Module Level 4 compliance.

---

**Last Updated**: December 2024
**Data Source**: [Can I Use](https://caniuse.com/)
