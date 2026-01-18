# CSS3 Border-radius (Rounded Corners)

![Support: 93.65%](https://img.shields.io/badge/support-93.65%25-brightgreen)

## Overview

**CSS3 border-radius** enables developers to create rounded corners on HTML elements without relying on images or complex techniques. The feature covers support for both the shorthand `border-radius` property and individual long-hand properties (`border-top-left-radius`, `border-top-right-radius`, `border-bottom-left-radius`, `border-bottom-right-radius`).

## Specification

- **W3C Status:** Candidate Recommendation (CR)
- **Specification URL:** https://www.w3.org/TR/css3-background/#the-border-radius

## Categories

- CSS3

## Benefits and Use Cases

### Design Flexibility
- Create modern, polished user interfaces without image dependencies
- Design rounded buttons, cards, and modular components
- Implement fluid, organic design patterns

### Performance Optimization
- Eliminate the need for corner images, reducing HTTP requests and file sizes
- Render corners natively using hardware acceleration in modern browsers
- Achieve better performance than image-based alternatives

### Responsive Design
- Apply corner radius using percentage values for fluid, responsive layouts
- Maintain visual consistency across different screen sizes and resolutions
- Create adaptive designs that scale naturally

### Interactive Elements
- Style form elements, input fields, and text areas with rounded corners
- Design consistent button styles across entire applications
- Create visually cohesive UI component libraries

### Visual Hierarchy
- Use border-radius to differentiate UI elements and create depth
- Improve visual grouping and organization of interface elements
- Enhance user experience through consistent design patterns

## Browser Support

### Summary Table

| Browser | First Support | Version |
|---------|---------------|---------|
| **Chrome** | 5 | Full support |
| **Edge** | 12 | Full support |
| **Firefox** | 3 | Partial* (full at 50) |
| **Safari** | 5 | Full support |
| **Opera** | 10.5 | Full support |
| **iOS Safari** | 4.0 | Full support |
| **Android** | 2.2 | Full support |
| **Samsung Internet** | 4 | Full support |
| **Opera Mini** | — | Not supported |
| **Internet Explorer** | 9 | Full support |

*Firefox 2 had partial support with vendor prefix; Firefox 3-49 required vendor prefix (`-moz-`); Firefox 50+ has full native support.

### Desktop Browsers

#### Chrome
- **Full Support:** Version 5+
- **Vendor Prefix:** Required in v4 (`-webkit-border-radius`)
- **Current:** All modern versions fully supported

#### Firefox
- **Partial Support:** Version 3 with vendor prefix (`-moz-border-radius`)
- **Full Support:** Version 50+ (no prefix required)
- **Note:** Bug with dotted/dashed borders fixed in Firefox 50

#### Safari
- **Vendor Prefix:** Required in v3.1-v4 (`-webkit-border-radius`)
- **Full Support:** Version 5+
- **Known Issue:** Safari 5.1-6.1 has issues with image borders (see Notes)

#### Opera
- **Full Support:** Version 10.5+
- **No Support:** Versions 9-10.1

#### Internet Explorer
- **Full Support:** Version 9+
- **No Support:** Versions 5.5-8
- **Known Issue:** Doesn't work on `<fieldset>` elements (IE9 only)

### Mobile Browsers

#### iOS Safari
- **Full Support:** Version 4.0+
- **Vendor Prefix:** Required in v3.2 (`-webkit-border-radius`)
- **Current:** All modern versions fully supported
- **Known Issue:** Does not work on `<iframe>` elements

#### Android Browser
- **Full Support:** Version 2.2+
- **Vendor Prefix:** Required in v2.1 (`-webkit-border-radius`)
- **Known Issue:** Android 2.3 does not support percentage values
- **Known Issue:** Galaxy S4 (Android 4.2) does not support shorthand property

#### Opera Mobile
- **Full Support:** Version 11+
- **No Support:** Version 10

#### Samsung Internet
- **Full Support:** Version 4+

### Legacy & Unsupported

- **Opera Mini:** Not supported (all versions)
- **BlackBerry:** Supported (versions 7+)
- **Internet Explorer Mobile:** Supported (versions 10-11)

## Detailed Browser Support Matrix

### Desktop

```
IE        5.5─6─7─8─[9✓]───11✓
Edge      ──────[12✓]──────143✓
Firefox   2┄ 3┄┄49┄[50✓]──148✓
Chrome    ──┄ 4┄ [5✓]──146✓
Safari    3.1┄4┄[5✓]─26.0✓
Opera     9┄9.5┄10.1[10.5✓]122✓
```

### Mobile

```
iOS Saf   3.2┄[4.0✓]──26.1✓
Android   2.1┄[2.2✓]──142✓
Op. Mini  [All✗]
```

## Implementation Guide

### Basic Syntax

```css
/* Shorthand: applies to all four corners */
border-radius: 10px;

/* Different values for each corner */
border-radius: 10px 20px 30px 40px;

/* Percentage values */
border-radius: 50%;

/* Individual properties */
border-top-left-radius: 10px;
border-top-right-radius: 20px;
border-bottom-right-radius: 30px;
border-bottom-left-radius: 40px;

/* Elliptical corners */
border-radius: 10px 20px / 30px 40px;
```

### With Vendor Prefixes (for legacy support)

```css
/* For maximum compatibility with older browsers */
-webkit-border-radius: 10px;  /* Safari 3.1-5, Chrome 1-4 */
-moz-border-radius: 10px;     /* Firefox 3-49 */
border-radius: 10px;           /* Standard (IE9+, FF50+, modern browsers) */
```

### Responsive Example

```css
/* Responsive border radius using percentages */
.card {
  width: 300px;
  height: 300px;
  border-radius: 10%;  /* Scales with element size */
}

/* For perfect circles */
.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;  /* Always circular */
}
```

## Known Issues and Bugs

### 1. Firefox - Dotted/Dashed Border Rendering
**Affected Versions:** Firefox 2-49
**Status:** Fixed in Firefox 50+
**Description:** Dotted and dashed rounded border corners are rendered as solid borders instead of maintaining the border style.
**Workaround:** Update to Firefox 50 or use solid borders for rounded corners in this version range.
**Reference:** [Mozilla Bug #382721](https://bugzilla.mozilla.org/show_bug.cgi?id=382721)

### 2. Android Browser 2.3 - Percentage Values
**Affected Versions:** Android Browser 2.3
**Description:** The Android Browser 2.3 does not support percentage values for the `border-radius` property. Only pixel-based values work.
**Workaround:** Use fixed pixel values instead of percentages for Android 2.3 compatibility, or use feature detection.

### 3. Samsung Galaxy S4 (Android 4.2) - Shorthand Property
**Affected Versions:** Stock browser on Samsung Galaxy S4 with Android 4.2
**Description:** The shorthand `border-radius` property is not supported. However, individual long-hand properties (`border-top-left-radius`, etc.) work correctly.
**Workaround:** Use the long-hand properties instead of the shorthand when supporting this device.

### 4. Safari - Image Borders
**Affected Versions:** Safari 5.1-6.1
**Description:** `border-radius` does not apply correctly to image borders in these versions.
**Workaround:** Update to Safari 7+ or use wrapper elements with border-radius applied to containers.
**Reference:** [Stack Overflow Discussion](https://stackoverflow.com/q/17202128)

### 5. Safari - iframe Elements
**Affected Versions:** All Safari versions
**Status:** Ongoing
**Description:** `border-radius` does not work on `<iframe>` elements in Safari.
**Workaround:** Use JavaScript to apply border-radius styling, or wrap the iframe in a container with overflow hidden and border-radius applied.

### 6. Internet Explorer 9 - Fieldset Elements
**Affected Versions:** IE9 only
**Description:** `border-radius` does not work on `<fieldset>` elements.
**Workaround:** Apply border-radius to wrapper divs instead of fieldsets, or use JavaScript polyfills.

## Progressive Enhancement

### Feature Detection

```javascript
// Check if border-radius is supported
function supportsBorderRadius() {
  const el = document.createElement('div');
  const style = el.style;

  return (
    style.borderRadius !== undefined ||
    style.WebkitBorderRadius !== undefined ||
    style.MozBorderRadius !== undefined
  );
}
```

### Fallback Strategy

```css
/* Fallback for older browsers */
.rounded-box {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
}

/* Modern browsers */
@supports (border-radius: 10px) {
  .rounded-box {
    border-radius: 10px;
  }
}
```

## Related Features and Standards

- **border** - Basic border styling
- **background-clip** - Controls background clipping with rounded borders
- **box-shadow** - Creates shadows with rounded corners
- **outline** - Outline property interaction with border-radius

## Related Links

### Official Resources
- [MDN Web Docs - CSS border-radius](https://developer.mozilla.org/en/docs/Web/CSS/border-radius) - Comprehensive MDN reference
- [W3C Specification](https://www.w3.org/TR/css3-background/#the-border-radius) - Official W3C CSS Backgrounds and Borders Module

### Tools and Utilities
- [Border-radius CSS Generator](https://border-radius.com) - Interactive tool for generating border-radius values
- [Detailed Compliance Table](https://muddledramblings.com/table-of-css3-border-radius-compliance) - Browser-specific compliance documentation

### Compatibility and Fallbacks
- [CSS3 Pie - Polyfill](http://css3pie.com/) - Polyfill library that includes border-radius support for older IE versions
- [WebPlatform Docs](https://webplatform.github.io/docs/css/properties/border-radius) - Community-maintained documentation

## Statistics

- **Global Support:** 93.65% of global traffic supports border-radius
- **Unsupported Traffic:** 0.36% (Opera Mini users and legacy IE)
- **Adoption:** One of the most widely adopted CSS3 properties

## Best Practices

### 1. Use Standard Property Only
For new projects targeting modern browsers, use only the standard `border-radius` property without vendor prefixes.

```css
/* Modern approach */
border-radius: 8px;
```

### 2. Consider Percentage Values for Flexibility
Use percentage values for responsive designs that scale with element size.

```css
/* Responsive circular elements */
.avatar {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
}
```

### 3. Test on Target Devices
Test rounded corners on actual mobile devices, especially older Android devices, as rendering behavior varies.

### 4. Use Vendor Prefixes Only When Supporting Legacy Browsers
Only include vendor prefixes if your project requires support for browsers older than:
- Chrome 5 (2010)
- Firefox 50 (2016)
- Safari 5 (2010)
- IE 9 (2011)

### 5. Combine with Other CSS Properties
Pair border-radius with box-shadow and transforms for advanced visual effects.

```css
.card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
```

## Browser-Specific Notes

### Chrome
- Excellent support since version 5
- Hardware acceleration provides smooth rendering
- No known bugs in modern versions

### Firefox
- Bug with dotted/dashed borders fixed in version 50
- Excellent rendering quality in modern versions
- No vendor prefix needed since version 50

### Safari
- Avoid using border-radius on iframes
- Image borders may not render correctly in Safari 5.1-6.1
- Full support in modern versions

### Edge
- Full support in all versions (built on Chromium from v79)

### Internet Explorer
- IE9 has full support
- Known issue with fieldset elements
- IE10-11 provide reliable support
- Consider alternatives for IE8 and below

---

**Last Updated:** 2025
**Data Source:** CanIUse.com
**Feature ID:** border-radius
