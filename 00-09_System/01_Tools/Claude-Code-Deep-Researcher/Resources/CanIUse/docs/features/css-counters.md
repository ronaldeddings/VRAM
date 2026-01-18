# CSS Counters

![Status: Recommended](https://img.shields.io/badge/Status-Recommended-brightgreen)
![Global Support: 93.72%](https://img.shields.io/badge/Global_Support-93.72%25-brightgreen)
![Category: CSS2](https://img.shields.io/badge/Category-CSS2-blue)

## Overview

CSS Counters provide a method for controlling numerical values in generated content using the `counter-reset` and `counter-increment` properties, along with the `counter()` and `counters()` functions. This feature allows developers to automatically number elements without relying on scripting, making it ideal for creating numbered lists, chapter numbering, and automatic section counting.

## Specification

- **Status**: Recommendation (REC)
- **Specification**: [CSS Level 2 Revision 1 - Counters](https://www.w3.org/TR/CSS21/generate.html#counters)
- **Module**: CSS2 (CSS Level 2 Revision 1)

## Categories

- CSS2

## Key Features & Benefits

### Core Functionality

- **Automatic Numbering**: Create self-numbering elements without JavaScript
- **Generated Content**: Use counters with the `content` property in `::before` and `::after` pseudo-elements
- **Custom Styling**: Apply CSS styles to counter values and surrounding text
- **Nested Counters**: Support for nested counters with the `counters()` function (e.g., "1.2.3")
- **Counter Reset**: Reset counters at specific elements to manage numbering scope
- **Counter Increment**: Increment counter values automatically as elements appear

### Use Cases

1. **Document Numbering**
   - Chapter and section numbering
   - Figure and table captions
   - Footnote and endnote numbering

2. **List Customization**
   - Custom ordered lists beyond default styling
   - Hierarchical list numbering
   - Complex list navigation

3. **Auto-Generated Content**
   - Page number references
   - Automatic heading numbering
   - Dynamic breadcrumb trails

4. **Accessibility**
   - Semantic numbering for screen readers
   - Enhanced document structure
   - Better search engine indexing

5. **Print Styling**
   - Print-friendly document layouts
   - Proper pagination and cross-references
   - Professional document generation

### Example Usage

```css
/* Basic counter setup */
body {
  counter-reset: section;
}

h1 {
  counter-increment: section;
}

h1::before {
  content: "Chapter " counter(section) ": ";
}

/* Nested counters */
ol {
  counter-reset: item;
}

li {
  counter-increment: item;
}

li::before {
  content: counters(item, ".") ". ";
}
```

## Browser Support

### Summary

CSS Counters have excellent browser support across all modern browsers. The feature is supported in **93.72% of global browser usage** and has been widely supported since CSS2 was released.

### Desktop Browsers

| Browser | First Version | Current Support | Notes |
|---------|---------------|-----------------|-------|
| **Chrome/Chromium** | 4+ | ✅ Full Support | Fully supported since Chrome 4 (2009) |
| **Firefox** | 2+ | ✅ Full Support | Fully supported since Firefox 2 (2006) |
| **Safari** | 3.1+ | ✅ Full Support | Fully supported since Safari 3.1 (2007) |
| **Opera** | 9+ | ✅ Full Support | Fully supported since Opera 9 (2006) |
| **Edge** | 12+ | ✅ Full Support | Fully supported since Edge 12 (2015) |
| **Internet Explorer** | 8+ | ✅ Full Support | Supported from IE 8; not in IE 5.5-7 |

### Mobile Browsers

| Browser | First Version | Current Support |
|---------|---------------|-----------------|
| **Safari iOS** | 3.2+ | ✅ Full Support |
| **Chrome Android** | 4+ | ✅ Full Support |
| **Firefox Android** | 4+ | ✅ Full Support |
| **Samsung Internet** | 4+ | ✅ Full Support |
| **Opera Mobile** | 10+ | ✅ Full Support |
| **Opera Mini** | All versions | ✅ Full Support |
| **Android Browser** | 2.1+ | ✅ Full Support |
| **BlackBerry** | 7+ | ✅ Full Support |
| **IE Mobile** | 10+ | ✅ Full Support |
| **UC Browser** | 15.5+ | ✅ Full Support |
| **KaiOS** | 2.5+ | ✅ Full Support |
| **QQ Browser** | 14.9+ | ✅ Full Support |
| **Baidu Browser** | 13.52+ | ✅ Full Support |

### Support Breakdown

```
Global Usage: 93.72% (Full Support)
Regional Support:
  - Modern Browsers: 99%+
  - All Listed Browsers: 93.72%+
  - Legacy Support: IE 8+ (2009+)
```

## Technical Details

### Properties

**`counter-reset`**
- Creates a new counter instance
- Syntax: `counter-reset: <identifier> <integer>?`
- Scope: Block-level and replaced elements

**`counter-increment`**
- Increments counter value
- Syntax: `counter-increment: <identifier> <integer>?`
- Default increment: 1

### Functions

**`counter(name)`**
- Returns current counter value as a number
- Used in `content` property

**`counter(name, style)`**
- Returns counter value with specified numbering style
- Supports: `decimal`, `lower-alpha`, `upper-alpha`, `lower-roman`, `upper-roman`, etc.

**`counters(name, string)`**
- Returns nested counter values separated by string
- Supports hierarchical numbering (e.g., "1.2.3")

**`counters(name, string, style)`**
- Nested counters with specified numbering style

### Scope & Inheritance

- Counters are scoped to their containing block
- Child elements inherit counter values from parents
- `counter-reset` creates a new scoped counter
- Counters do not inherit to out-of-flow elements

## Known Issues & Limitations

### No Known Critical Bugs
The CSS Counters feature is stable and well-established with no reported critical bugs or compatibility issues.

### Practical Considerations

1. **Generated Content Only**: Counters can only be used in the `content` property, which applies only to `::before` and `::after` pseudo-elements
2. **No Numeric Calculations**: Counters cannot perform arithmetic operations (e.g., adding or multiplying values)
3. **Print Context**: Some print stylesheets may interact unpredictably with counters in certain browsers
4. **Dynamic Content**: Counters do not automatically update when DOM is modified (JavaScript intervention required)

## Implementation Guide

### Basic Example

```css
/* Ordered list with custom numbering */
ol {
  counter-reset: item;
}

li {
  counter-increment: item;
}

li::before {
  content: counter(item) ". ";
  font-weight: bold;
}
```

### Nested Example

```css
/* Hierarchical numbering */
ol {
  counter-reset: section;
}

ol ol {
  counter-reset: subsection;
}

li {
  counter-increment: section;
}

li li {
  counter-increment: subsection;
}

li::before {
  content: counter(section) ".";
}

li li::before {
  content: counters(section, ".") "." counter(subsection) ".";
}
```

### Print Styling Example

```css
/* Chapter numbering for printing */
h1 {
  counter-increment: chapter;
  counter-reset: section;
}

h1::before {
  content: "Chapter " counter(chapter) ": ";
}

h2 {
  counter-increment: section;
}

h2::before {
  content: counter(chapter) "." counter(section) " ";
}

a[href]::after {
  content: " (page " target-counter(attr(href), page) ")";
}
```

## Related Features & Links

### Related CSS Features
- [CSS Generated Content Module Level 3](https://drafts.csswg.org/css-content-3/)
- [`content` Property](https://developer.mozilla.org/en-US/docs/Web/CSS/content)
- [Pseudo-elements `::before` and `::after`](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)
- [CSS Lists and Counters Module Level 3](https://drafts.csswg.org/css-lists/)

### Learning Resources

- [MDN Web Docs - CSS Counters](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Counter_Styles/Using_CSS_counters)
- [CSS Counters Tutorial and Information](https://onwebdev.blogspot.com/2012/02/css-counters-tutorial.html)
- [WebPlatform Docs - counter-reset](https://webplatform.github.io/docs/css/properties/counter-reset)

### Browser Compatibility

- [CanIUse - CSS Counters](https://caniuse.com/css-counters)
- [MDN Browser Compatibility Table](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Counter_Styles/Using_CSS_counters#browser_compatibility)

## Recommendations

### When to Use CSS Counters

✅ Use CSS Counters when:
- Creating numbered lists with custom styling
- Building print-friendly documents with automatic numbering
- Implementing chapter/section numbering without JavaScript
- Enhancing semantic content for accessibility
- Styling ordered lists beyond browser defaults

### When to Avoid

❌ Consider alternatives when:
- You need dynamic counter updates without page reload
- Complex mathematical operations on counter values are required
- Browser support for IE 7 or earlier is essential
- Simple `<ol>` styling would suffice

## Migration & Legacy Support

### From Internet Explorer 7 and Earlier

If you need to support IE 7 or earlier, consider:

1. **Fallback to `<ol>` tags**: Default numbered lists without customization
2. **Server-side numbering**: Pre-calculate and render numbers
3. **JavaScript enhancement**: Use JavaScript to add counter styling
4. **Browser detection**: Serve alternate stylesheets based on browser

```css
/* Graceful degradation */
li::before {
  content: counter(item) ". ";
  /* Fallback: browser default numbering works */
}
```

## Browser Compatibility Details

### Chrome/Edge/Chromium
- Fully supported since Chrome 4 (2009)
- No known issues or limitations
- Consistent behavior across all versions

### Firefox
- Fully supported since Firefox 2 (2006)
- Excellent standards compliance
- Consistent behavior across all versions

### Safari
- Fully supported since Safari 3.1 (2007)
- Reliable implementation
- Works consistently on macOS and iOS

### Internet Explorer
- **IE 8-11**: Fully supported
- **IE 7 and earlier**: Not supported
- Upgrade recommendation for production sites

---

**Last Updated**: December 2024
**Data Source**: CanIUse CSS Counters Feature Database
**Specification Version**: CSS Level 2 Revision 1
