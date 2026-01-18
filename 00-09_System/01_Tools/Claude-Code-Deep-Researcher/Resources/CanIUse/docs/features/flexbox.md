# CSS Flexible Box Layout Module

## Overview

The **CSS Flexible Box Layout Module** (commonly known as **Flexbox**) is a powerful one-dimensional layout method that allows you to position elements in horizontal or vertical stacks with flexible sizing and alignment capabilities. It revolutionized CSS layout by providing an intuitive way to distribute space and align content within containers.

## Description

Flexbox provides a method of positioning elements in horizontal or vertical stacks with automatic distribution, flexible sizing, and precise alignment. The specification supports:

- **Display modes**: `display: flex` and `display: inline-flex`
- **Flex properties**: All properties prefixed with `flex` (e.g., `flex-direction`, `flex-wrap`, `flex-grow`)
- **Alignment properties**: `align-content`, `align-items`, `align-self`, `justify-content`
- **Ordering**: `order` property for visual reordering without affecting document flow

## Specification Status

| Property | Value |
|----------|-------|
| **Official Spec** | [CSS Flexible Box Layout Module Level 1](https://www.w3.org/TR/css3-flexbox/) |
| **Status** | Candidate Recommendation (CR) |
| **W3C Reference** | W3C CSS Working Group |

## Categories

- CSS3

## Key Benefits & Use Cases

### Benefits

- **Simplified Alignment**: Easily align items vertically and horizontally without complex hacks
- **Responsive Design**: Automatically adjusts to different screen sizes and content lengths
- **Flexible Space Distribution**: Evenly distribute extra space or shrink items proportionally
- **Content-Agnostic**: Works regardless of item count or content size
- **Intuitive**: More natural and intuitive than float or positioning-based layouts

### Common Use Cases

- Navigation bars and menu layouts
- Card-based layouts and grids
- Centering content (both horizontally and vertically)
- Equal-height columns
- Space-between and space-around distributions
- Responsive grid systems
- Mobile app layouts
- Dashboard and component arrangements

## Browser Support

### Support Matrix

| Browser | Version(s) | Status | Notes |
|---------|-----------|--------|-------|
| **Chrome** | 21+ | ✅ Supported | Full support from v21 (with `-webkit-` prefix until v28) |
| **Firefox** | 28+ | ✅ Supported | Full support from v28 (old syntax with `-moz-` prefix in v2-27) |
| **Safari** | 6.1+ | ✅ Supported | Full support from v6.1 (with `-webkit-` prefix until v8) |
| **Edge** | 12+ | ✅ Supported | Full support from first release (Edge 12) |
| **Opera** | 12.1+ | ✅ Supported | Full support from v12.1 |
| **Internet Explorer** | 10-11 | ⚠️ Partial | Significant bugs present (see Known Issues) |
| **iOS Safari** | 7.0+ | ✅ Supported | Full support from v7.0 (with `-webkit-` prefix until v9) |
| **Android** | 4.4+ | ✅ Supported | Full support from v4.4 |
| **Samsung Internet** | 4+ | ✅ Supported | Full support from v4 |
| **Opera Mini** | All | ✅ Supported | Full support across all versions |

### Legacy Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| **IE 9 and below** | ❌ Not supported | No flexbox support |
| **Chrome 4-20** | ⚠️ Partial | Old flexbox specification with `-webkit-` prefix |
| **Firefox 2-27** | ⚠️ Partial | Old flexbox specification with `-moz-` prefix |
| **Safari 3.1-6.0** | ⚠️ Partial | Old flexbox specification with `-webkit-` prefix |

### Global Support

- **Full Support**: 93.24% of users
- **Partial Support**: 0.39% of users
- **No Support**: 6.37% of users

## Known Issues & Browser Bugs

### Critical Issues

1. **IE 10 Default Flex Value**
   - IE10 uses `0 0 auto` as the default value for `flex`, while the spec defines `0 1 auto`
   - **Impact**: Unexpected item sizing behavior in IE10
   - **Workaround**: Explicitly set the `flex` property

2. **IE 10/11 `min-height` with `flex-direction: column`**
   - Containers with `display: flex`, `flex-direction: column`, and `min-height` (but no explicit `height`) don't properly calculate flexed children's sizes
   - **Impact**: Child elements don't size correctly
   - **Workaround**: Use explicit `height` instead of `min-height`, or use a different layout approach

3. **IE 11 `min-height` Vertical Alignment**
   - IE11 doesn't vertically align items correctly when `min-height` is used with `align-items: center`
   - **Impact**: Centered items appear misaligned
   - **Workaround**: Use explicit `height` or `flex-basis`
   - **Reference**: [Microsoft Connect Issue](https://connect.microsoft.com/IE/feedback/details/816293/ie11-flexbox-with-min-height-not-vertically-aligning-with-align-items-center)

### Safari Issues

4. **Safari 10.1 and Below: Percentage Heights**
   - The height of non-flex children with percentage heights are not recognized by Safari
   - **Impact**: Child elements don't respect percentage heights
   - **Fixed in**: Safari 10.1+
   - **Reference**: [WebKit Bug #137730](https://bugs.webkit.org/show_bug.cgi?id=137730)
   - **Note**: Chrome had the same issue, fixed in Chrome 51

5. **Safari 10 and Below: Min/Max Width/Height Calculation**
   - Safari 10 uses min/max width/height for rendering but ignores them when calculating multi-line flex container wrapping
   - **Impact**: Flex items may wrap unexpectedly
   - **Fixed in**: Safari 11+
   - **Reference**: [WebKit Bug #136041](https://bugs.webkit.org/show_bug.cgi?id=136041)

### Firefox Issues

6. **Firefox 51 and Below: Flexbox in Buttons**
   - Firefox 51 and below don't support flexbox inside button elements
   - **Impact**: Flex layouts inside `<button>` elements don't work
   - **Fixed in**: Firefox 52+
   - **Reference**: [Mozilla Bug #984869](https://bugzilla.mozilla.org/show_bug.cgi?id=984869#c2)

### IE 11 Issues

7. **IE 11 `flex-basis` Unit Requirement**
   - IE11 requires a unit to be added to the third argument (flex-basis property) in the `flex` shorthand
   - **Impact**: `flex: 0 0 auto` may not work; use `flex: 0 0 0%` or `flex: 0 0 0px` instead
   - **Reference**: [Microsoft Documentation](https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/dev-guides/hh673531%28v%3dvs.85%29#setting-the-flexibility-of-a-child-element)

### General Issues

8. **`justify-content: space-evenly` Browser Support**
   - The `space-evenly` value for the `justify-content` property (from CSS Box Alignment Module Level 3) is not supported by all browsers
   - **Impact**: Unequal spacing between items in some browsers
   - **Note**: Use `space-around` or `space-between` as fallback

### Comprehensive Flexbox Bugs Reference

For a community-curated list of flexbox issues and cross-browser workarounds:
- **[Flexbugs](https://github.com/philipwalton/flexbugs)**: A comprehensive repository documenting flexbox bugs and solutions

## Syntax & Key Properties

### Basic Display

```css
.container {
  display: flex;        /* Create flex container */
  display: inline-flex; /* Inline flex container */
}
```

### Flex Direction

```css
.container {
  flex-direction: row;            /* Default: left to right */
  flex-direction: row-reverse;    /* Right to left */
  flex-direction: column;         /* Top to bottom */
  flex-direction: column-reverse; /* Bottom to top */
}
```

### Wrapping

```css
.container {
  flex-wrap: nowrap;   /* Default: no wrapping */
  flex-wrap: wrap;     /* Wrap to next line */
  flex-wrap: wrap-reverse; /* Wrap in reverse direction */
}
```

### Alignment

```css
.container {
  justify-content: flex-start;     /* Align along main axis */
  justify-content: flex-end;
  justify-content: center;
  justify-content: space-between;
  justify-content: space-around;
  justify-content: space-evenly;   /* Unequal support - use caution */

  align-items: flex-start;         /* Align along cross axis */
  align-items: flex-end;
  align-items: center;
  align-items: stretch;
  align-items: baseline;

  align-content: flex-start;       /* Align flex lines (multi-line only) */
  align-content: flex-end;
  align-content: center;
  align-content: space-between;
  align-content: space-around;
}
```

### Item Properties

```css
.item {
  flex: 1;                    /* Shorthand: flex-grow, flex-shrink, flex-basis */
  flex-grow: 1;              /* Growth factor */
  flex-shrink: 1;            /* Shrink factor */
  flex-basis: auto;          /* Base size before free space */

  align-self: auto;          /* Override align-items for single item */
  order: 0;                  /* Change visual order */
}
```

## Implementation Best Practices

### Vendor Prefixes

While most modern browsers don't require vendor prefixes, consider these for legacy support:

```css
.container {
  display: -webkit-flex;  /* Safari 6.1-8, older Chrome/Android */
  display: -moz-flex;     /* Firefox 2-27 */
  display: flex;          /* Modern browsers */
}

.item {
  -webkit-flex: 1;
  -moz-flex: 1;
  flex: 1;
}
```

### Fallback for Old Syntax

Browsers using the old flexbox specification need different properties:

```css
.container {
  display: -webkit-box;      /* Old syntax */
  -webkit-box-direction: normal;
  -webkit-box-orient: horizontal;
  display: flex;             /* New syntax */
}
```

### IE 10/11 Workarounds

```css
/* For IE 10/11 with min-height */
.flex-container {
  display: flex;
  flex-direction: column;
  height: 100vh;  /* Use explicit height instead of min-height */
}

/* For IE 11 with flex-basis */
.flex-item {
  flex: 0 0 100%; /* IE11 requires units: use 100%, not 0 */
}
```

## Resources & Learning Materials

### Essential Guides

- **[CSS-Tricks: A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)** - Comprehensive reference with interactive examples
- **[Solved by Flexbox](https://philipwalton.github.io/solved-by-flexbox/)** - Real-world examples of problems solved with flexbox
- **[MDN: CSS Flexible Box Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)** - Official Mozilla documentation

### Tutorials & Learning

- **[Dev.Opera: Advanced Cross-Browser Flexbox](https://dev.opera.com/articles/view/advanced-cross-browser-flexbox/)** - Cross-browser compatibility guide
- **[Adobe DevNet: Working with Flexbox](https://www.adobe.com/devnet/html5/articles/working-with-flexbox-the-new-spec.html)** - Article on the latest specification

### Tools & Generators

- **[Flexplorer](https://bennettfeely.com/flexplorer/)** - Interactive flexbox CSS generator
- **[Flexyboxes](https://the-echoplex.net/flexyboxes/)** - Flexbox playground and code generator
- **[Flexbugs Repository](https://github.com/philipwalton/flexbugs)** - Community-curated flexbox bugs and workarounds

### Utilities & Polyfills

- **[Flexibility (10up)](https://github.com/10up/flexibility)** - IE 8 and 9 flexbox polyfill
- **[Ecligrid](https://github.com/vadimyer/ecligrid)** - Mobile-first flexbox grid system

### Advanced Topics

- **[Width vs Flex-Basis](https://mastery.games/post/the-difference-between-width-and-flex-basis/)** - Understanding the difference between width and flex-basis properties

## Notes

Most partial support refers to supporting an **older version** of the specification or an **older syntax** of the specification:

- **Old Specification (2009)**: An early draft that lacked wrapping and used different property names
- **2012 Syntax**: An intermediate draft with different property names and limited features

Browsers marked as "partial" may support some flexbox features but not the complete, modern specification. It's essential to test thoroughly when targeting older browsers.

## Summary

Flexbox is a mature, widely-supported CSS feature that should be your go-to solution for one-dimensional layouts. With over 93% global support and modern browser compliance, it's safe to use in production for most use cases. For legacy browser support (IE 10-11), be aware of known issues and implement appropriate workarounds. For older browsers requiring support, consider using fallback layouts or polyfills.

---

**Last Updated**: Based on CanIUse data
**Specification Version**: CSS Flexible Box Layout Module Level 1
**Recommendation**: Safe for production use with consideration for known IE 10/11 issues
