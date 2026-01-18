# CSS3 Multiple Column Layout

## Overview

**CSS3 Multiple Column Layout** (also known as CSS Multi-column) is a CSS module that provides a method of flowing information across multiple columns. This feature allows content to automatically spread across multiple columns similar to traditional newspaper or magazine layouts, significantly improving readability and space utilization on the web.

## Description

The Multiple Column Layout module enables developers to flow content vertically down columns and automatically balance or fill columns as needed. Instead of manually creating columns with floats or flexbox, developers can use a simple set of CSS properties to define how many columns should be used or what width each column should be, with the browser automatically distributing the content.

## Current Specification Status

**Status:** Candidate Recommendation (CR)

**Specification:** [W3C CSS Multi-column Layout Module](https://www.w3.org/TR/css3-multicol/)

The specification has been in development for many years and is approaching standardization. While most modern browsers support the core functionality, some properties and values still have incomplete implementation across different browsers.

## Categories

- **CSS3**

## Benefits & Use Cases

### Content Organization
- **Newspaper/Magazine Layouts:** Create multi-column text layouts similar to traditional print media
- **Article Formatting:** Distribute long-form content across multiple columns for better readability on wide screens
- **Documentation:** Organize dense documentation or lists across multiple columns

### Responsive Design
- **Fluid Content Flow:** Content automatically reflows between columns as viewport size changes
- **Space Efficiency:** Better utilization of horizontal screen space on large displays
- **Reading Experience:** Improved readability by controlling line length through column width

### User Interface
- **List Organization:** Display lists, tags, or categories across multiple columns
- **Grid-like Layouts:** Create grid-like layouts without complex grid configuration
- **Content Cards:** Organize card-based content across multiple columns with automatic balancing

### Technical Advantages
- **Automatic Reflow:** Browser automatically handles content distribution
- **Responsive:** Content naturally adapts to available space
- **Semantic HTML:** Requires no additional markup for column division
- **Accessible:** Maintains proper document structure and reading order

## Key Properties

### Core Properties
- **`column-count`** - Specifies the number of columns
- **`column-width`** - Specifies the ideal width of each column
- **`columns`** - Shorthand for column-count and column-width
- **`column-gap`** - Specifies the gap between columns
- **`column-rule`** - Adds visual separator between columns
- **`column-rule-width`** - Width of the column separator
- **`column-rule-style`** - Style of the column separator (solid, dashed, etc.)
- **`column-rule-color`** - Color of the column separator
- **`column-span`** - Allows an element to span across multiple columns
- **`column-fill`** - Determines how columns are filled (balanced or sequential)

### Break Control Properties
- **`break-before`** - Controls breaks before an element
- **`break-after`** - Controls breaks after an element
- **`break-inside`** - Controls breaks inside an element

## Browser Support

### Support Legend
- **✅ Full Support (y)** - Feature is fully supported
- **⚠️ Partial Support (a)** - Feature has partial or incomplete support
- **❌ No Support (n)** - Feature is not supported
- **x** - Requires vendor prefix
- **#1, #2, #3, #4** - Notes (see "Compatibility Notes" section)

### Desktop Browsers

| Browser | Support | Version Range | Notes |
|---------|---------|----------------|-------|
| **Chrome** | Partial | 4+ | All versions have partial support with bugs (#3). Versions 4-49 require `-webkit-` prefix (#1, #2). |
| **Firefox** | Partial | 2+ | All versions have partial support (#1). Versions 2-51 and 65+ have known limitations (#1, #3, #4). |
| **Safari** | Mixed | 3.1+ | Full support from v10+. Partial support (with prefix) in v3.1-v9. Known rendering issues in v5-v8, min-height bugs in v5.1-10+. |
| **Opera** | Mixed | 9+ | No support in v9-v11. Full support from v11.1-v12.1. Partial support (with limitations) from v15+. |
| **IE/Edge** | Partial | IE 10+ | IE 10-11 have partial support; Edge 12-18 have full support. Newer Edge versions (79+) have partial support (#3). |

### Mobile Browsers

| Browser | Support | Version Range | Notes |
|---------|---------|----------------|-------|
| **iOS Safari** | Mixed | 3.2+ | Full support from v10+. Partial support in earlier versions. |
| **Android Browser** | Partial | 2.1+ | Partial support with limitations. Latest version (142) has partial support (#3). |
| **Chrome (Android)** | Partial | Latest | Partial support (#3). |
| **Firefox (Android)** | Partial | Latest (144) | Partial support (#4). |
| **Samsung Internet** | Partial | 4+ | Partial support across all versions (#1/#2 in v4, #3 in v5+). |
| **Opera Mobile** | Mixed | 10+ | No support in v10-v11. Full support v11.1-v12.1. Partial support from v80+ (#3). |
| **IE Mobile** | Full | 10-11 | Full support for both versions. |

### Other Platforms

| Browser | Support | Notes |
|---------|---------|-------|
| **Opera Mini** | Full | Supported in all versions. |
| **BlackBerry** | Partial | Partial support with limitations. |
| **UC Browser (Android)** | Partial | Partial support (#3). |
| **Baidu Browser** | Partial | Partial support (#3). |
| **KaiOS** | Partial | Partial support (#1). |

## Compatibility Notes

### Note #1: Break Properties Not Supported
**Affected Browsers:** Chrome (4-49), Firefox (2-51), Safari (3.1-8), Opera (15-36), Android browsers, BlackBerry, KaiOS

Does not support the properties `break-after`, `break-before`, and `break-inside`. WebKit- and Blink-based browsers have equivalent support with the non-standard `-webkit-column-break-*` properties, but only for the values `auto` and `always`. Firefox does not support the `break-*` properties but supports the now-obsolete `page-break-*` properties in the paging (printing) context.

**Workaround:** Use `-webkit-column-break-*` properties as a fallback in older WebKit/Blink browsers.

### Note #2: Missing column-fill Support
**Affected Browsers:** Chrome (4-49), Firefox (2-51), Safari (3.1-6.1), Opera (15-36), Android browsers, BlackBerry

Does not support the `column-fill` property. This property controls whether columns are balanced or filled sequentially.

**Workaround:** Rely on default browser behavior or use alternative layout methods if column-fill control is critical.

### Note #3: Incomplete break-* Property Support
**Affected Browsers:** Edge (79+), Chrome (50+), Opera (37+), Android Chrome, UC Browser, Baidu, Samsung

Does not support the values `avoid` (in the column context), `avoid-column`, and `avoid-page` for the properties `break-after`, `break-before`, and `break-inside`. Also does not support the value `column` for the properties `break-after` and `break-before`.

**Workaround:** Use basic break control values (`auto`, `always`) or avoid using these specific values.

### Note #4: Limited break-* Values
**Affected Browsers:** Firefox (92+)

Does not support the values `avoid` (in the column context) for the properties `break-after`, `break-before`, and `break-inside`. Also does not support the values `avoid-column`, `avoid-page`, and `column` for the properties `break-before` and `break-after`.

**Workaround:** Similar to Note #3; use basic break control or rely on default browser behavior.

## Known Issues & Bugs

### Firefox Issues
1. **break-* Properties:** Versions 1-64 don't support break properties. Versions 65-91 have partial support. Version 92+ still lacks certain values. [Bug #775628](https://bugzilla.mozilla.org/show_bug.cgi?id=775628)
2. **column-span Not Working:** The `column-span` property doesn't work. [Bug #616436](https://bugzilla.mozilla.org/show_bug.cgi?id=616436)
3. **Tables Not Splittable:** Firefox does not split tables into columns.
4. **Fieldset Not Supported:** Columns don't work on `fieldset` elements. [Bug #727164](https://bugzilla.mozilla.org/show_bug.cgi?id=727164)

### Chrome Issues
1. **Incorrect Height Calculation:** Chrome often miscalculates container height and breaks on margins/padding.
2. **Visual Artifacts:** May display one pixel of the next column at the bottom of the previous column.
3. **Workaround:** Adding `-webkit-perspective: 1;` to the column container creates a new stacking context, causing Chrome to recalculate column layout.
4. **Fieldset Not Supported:** Columns don't work on `fieldset` elements.

### Safari Issues
1. **Uneven Column Rendering:** Safari 5-8 renders columns less evenly than other browsers.
2. **min-height Bugs:** Safari 5.1-10+ doesn't work as expected with `min-height`. [Webkit Bug #65691](https://bugs.webkit.org/show_bug.cgi?id=65691)

### IE Issues
1. **text-shadow Bug:** IE 10 has a bug where `text-shadow` doesn't work inside columns. [Testcase](https://jsfiddle.net/0bwwrtda/)
2. **Column Breaks:** IE incorrectly breaks on elements across columns when having more than three columns.

### Cross-Browser Issues
1. **Ordered List Numbers:** Browsers handle flowing `ol` list numbers differently:
   - IE and Safari: Display numbers only in the first column
   - Chrome: Doesn't display any numbers
   - Firefox: Correct behavior (displays in all columns)

## Browser Support Summary

- **Global Usage:** 11.05% full support + 82.59% partial support = 93.64% total coverage
- **Modern Browsers:** Generally well-supported in recent versions
- **Old IE:** Not supported in IE9 and earlier
- **Mobile:** Good support in modern mobile browsers

## Recommended Approach

### Safe Usage Patterns
1. **Use core properties:** Rely on `column-count`, `column-width`, and `column-gap`
2. **Test thoroughly:** Different browsers have different quirks
3. **Provide fallbacks:** Use feature detection or graceful degradation
4. **Avoid problematic features:** Be cautious with `column-span`, break properties, and tables in columns
5. **Use vendor prefixes:** Include `-webkit-`, `-moz-`, and `-o-` prefixes for older browser support

### Progressive Enhancement
```css
/* Basic multi-column support (widely supported) */
.article {
  column-count: 2;
  column-gap: 2rem;
}

/* Add enhancements for better browsers */
@supports (column-fill: balance) {
  .article {
    column-fill: balance;
  }
}

/* Include vendor prefixes for older browsers */
.article {
  -webkit-column-count: 2;
  -moz-column-count: 2;
  column-count: 2;

  -webkit-column-gap: 2rem;
  -moz-column-gap: 2rem;
  column-gap: 2rem;
}
```

## Related Resources

### Official Documentation
- [W3C CSS Multi-column Layout Specification](https://www.w3.org/TR/css3-multicol/)
- [WebPlatform Docs - column-width](https://webplatform.github.io/docs/css/properties/column-width)

### Learning Resources
- [Dev.Opera - CSS3 Multi-Column Layout](https://dev.opera.com/articles/view/css3-multi-column-layout/)
- [TutsPlus - Introduction to CSS3 Multiple Column Layout](https://webdesign.tutsplus.com/articles/an-introduction-to-the-css3-multiple-column-layout-module--webdesign-4934)

### Tools & Polyfills
- [GitHub - Multicolumn Polyfill](https://github.com/hamsterbacke23/multicolumn-polyfill)
- [Chrome Platform Status - CSS column-fill](https://www.chromestatus.com/feature/6298909664083968)

## Related CSS Features
- **CSS Grid Layout** - Modern multi-dimensional layout alternative
- **CSS Flexbox** - One-dimensional layout alternative
- **CSS Regions** - Flow content through multiple regions
- **Media Queries** - Responsive column adjustments

## Keywords
`column-count`, `column-width`, `column-gap`, `column-rule`, `column-rule-type`, `column-span`, `column-fill`, `break-before`, `break-after`, `break-inside`
