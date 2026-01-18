# CSS Regions

## Overview

**CSS Regions** is a CSS feature that enables flowing content into multiple elements, allowing magazine-like and newspaper-like layouts on the web. Content can be automatically distributed across defined regions while maintaining a coherent narrative flow.

## Description

CSS Regions provide a method for flowing text and other content through multiple containers, similar to how professional publishing tools handle multi-column and multi-page layouts. The feature allows developers to define content sources and flow them through a series of target elements (regions), automatically wrapping content across boundaries while keeping it semantically linked.

### Current Status

- **Specification Status**: Working Draft (WD)
- **W3C Specification**: [CSS Regions Module Level 3](https://www.w3.org/TR/css3-regions/)

### Important Notice

**This feature is no longer being pursued by any browser.** While it was once supported in WebKit-based browsers (Safari) and Internet Explorer, all major browser vendors have ceased implementation efforts. The feature remains in Working Draft status but has been effectively deprecated in modern web development.

## Categories

- CSS3

## Use Cases & Benefits

### Intended Use Cases

- **Magazine-Style Layouts**: Creating print-like multi-column and multi-page layouts for digital content
- **Newspaper Articles**: Flowing long-form content across multiple text containers
- **Book-like Presentations**: Simulating traditional book and publication layouts on the web
- **Complex Content Distribution**: Automatically distributing content across predefined layout regions
- **Responsive Multi-Column Design**: Adapting content flow across different numbers of columns based on screen size

### Historical Value

While no longer actively supported, CSS Regions represented an important exploration in web layout capabilities, attempting to bridge the gap between web and print design paradigms. The concepts and lessons learned influenced subsequent layout features like CSS Grid and CSS Columns.

## Browser Support

| Browser | Support Status | Notes |
|---------|---|---|
| **Internet Explorer** | 10-11 | Partial support with `-ms-` prefix |
| **Microsoft Edge** | 12-18 | Partial support with `-ms-` prefix |
| **Firefox** | All versions | Not supported |
| **Chrome** | 15-18 | Experimental support with `-webkit-` prefix |
| | 19+ | Disabled and removed |
| **Safari** | 6.1-11 | Full support with `-webkit-` prefix |
| | 11.1+ | Support removed |
| **iOS Safari** | 7.0-11.2 | Full support with `-webkit-` prefix |
| | 11.3+ | Support removed |
| **Opera** | All versions | Not supported |
| **Android Browser** | All versions | Not supported |
| **Samsung Internet** | All versions | Not supported |

### Support Legend

- `y` = Full support
- `a` = Partial/Experimental support
- `x` = Requires vendor prefix
- `n` = Not supported
- `d` = Disabled by default

### Version Details

#### Internet Explorer / Edge
- **IE 10-11**: Partial support with `-ms-flow-into` and `-ms-flow-from` syntax
- **Edge 12-18**: Partial support maintained from IE 10
- **Edge 79+**: Support removed during Chromium migration

#### Chrome/Chromium
- **Chrome 15-18**: Experimental support with `-webkit-` prefix enabled
- **Chrome 19-34**: Disabled by default (feature behind flag)
- **Chrome 35+**: Feature completely removed

#### Safari/WebKit
- **Safari 6.1-11**: Full support with `-webkit-` prefix
- **Safari 11.1+**: Support removed
- **iOS Safari 7.0-11.2**: Full support with `-webkit-` prefix
- **iOS Safari 11.3+**: Support removed

## Technical Notes

### Internet Explorer & Edge Implementation Limitations

Microsoft's implementation of CSS Regions includes the following constraints:

1. **Limited Content Sources**: Support is restricted to using an `<iframe>` as a content source
2. **Vendor-Specific Syntax**: Uses `-ms-flow-into: flow_name;` and `-ms-flow-from: flow_name;` properties instead of standard W3C syntax
3. **Partial Property Support**: Does not support the `region-fragment` property from the full specification

### Safari/WebKit Implementation Notes

- Full `-webkit-` prefixed implementation of the specification
- Support was removed in Safari 11.1 and iOS Safari 11.3
- Previously represented the most complete implementation of the feature

### Removal Rationale

The major browsers decided to discontinue CSS Regions support due to:

- Complexity of implementation and maintenance
- Limited real-world adoption and demand
- Availability of alternative layout solutions (CSS Grid, Flexbox, multi-column layouts)
- Performance concerns with content flow calculations
- Difficulty achieving cross-browser compatibility

## Modern Alternatives

For layouts previously targeted by CSS Regions, consider these modern solutions:

| Use Case | Modern Alternative |
|---|---|
| Multi-column text layout | [CSS Columns](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Columns) |
| Complex grid-based layouts | [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout) |
| Flexible containers | [CSS Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout) |
| Wrapping text around shapes | [CSS Shapes](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Shapes) |
| Page-based layout | Print CSS media queries or dedicated layout frameworks |

## Historical References

### Resources & Documentation

- **[Adobe Demos and Samples](https://web.archive.org/web/20121027050852/http://html.adobe.com:80/webstandards/cssregions/)** (Archived)
  - Historical demonstrations from Adobe's CSS Regions initiative

- **[IE10 Developer Guide](https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/dev-guides/hh673537(v=vs.85))**
  - Microsoft's documentation on IE10 implementation

- **[Firefox Feature Request](https://bugzilla.mozilla.org/show_bug.cgi?id=674802)**
  - Mozilla's tracking issue for the feature request

- **[A Beginner's Guide to CSS Regions](https://www.sitepoint.com/a-beginners-guide-css-regions/)**
  - Educational overview of CSS Regions concepts and syntax

- **[Discussion on Removal in Blink](https://groups.google.com/a/chromium.org/g/blink-dev/c/kTktlHPJn4Q/m/YrnfLxeMO7IJ)**
  - Chromium developers' discussion regarding feature removal

## Usage Statistics

- **Full Support**: 0.25% of tracked browsers
- **Partial Support**: 0.33% of tracked browsers
- **Total Usage**: Less than 1% of browsers

## Summary

CSS Regions represents an ambitious attempt to bring advanced publishing capabilities to the web. While it is no longer supported in modern browsers and should not be used for new projects, understanding its concepts provides valuable context for the evolution of web layout technologies. Developers should use modern alternatives like CSS Grid, Flexbox, and multi-column layouts for content distribution and complex layouts.
