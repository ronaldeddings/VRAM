# background-position-x & background-position-y

## Overview

**Status:** Unofficial Standard
**Specification:** [CSS Backgrounds Module Level 4](https://w3c.github.io/csswg-drafts/css-backgrounds-4/#background-position-longhands)
**Global Support:** 93.57%

## Description

`background-position-x` and `background-position-y` are CSS longhand properties that allow developers to define the horizontal and vertical positions of a background image separately. These properties provide a more granular and explicit way to control background positioning compared to the shorthand `background-position` property.

Instead of specifying both coordinates in a single property:
```css
background-position: center bottom;
```

You can now specify each axis independently:
```css
background-position-x: center;
background-position-y: bottom;
```

## Categories

- **CSS**

## Syntax

### `background-position-x`
Controls the horizontal position of the background image.

```css
/* Keyword values */
background-position-x: left;
background-position-x: center;
background-position-x: right;

/* <percentage> values */
background-position-x: 0%;
background-position-x: 50%;
background-position-x: 100%;

/* <length> values */
background-position-x: 0;
background-position-x: 1cm;
background-position-x: 8.5mm;

/* Side-relative values */
background-position-x: right 3cm;
background-position-x: left 25%;
```

### `background-position-y`
Controls the vertical position of the background image.

```css
/* Keyword values */
background-position-y: top;
background-position-y: center;
background-position-y: bottom;

/* <percentage> values */
background-position-y: 0%;
background-position-y: 50%;
background-position-y: 100%;

/* <length> values */
background-position-y: 0;
background-position-y: 2em;
background-position-y: 10px;

/* Side-relative values */
background-position-y: top 1em;
background-position-y: bottom 25%;
```

## Benefits and Use Cases

### 1. **Clearer Intent**
Breaking background positioning into separate x and y properties makes CSS more readable and self-documenting. You explicitly declare which axis you're controlling.

### 2. **Easier Maintenance**
When you need to adjust only horizontal or vertical positioning, you can modify a single property without affecting the other axis.

### 3. **Dynamic Positioning with CSS Variables**
These longhand properties work seamlessly with CSS custom properties (variables) for dynamic positioning:

```css
:root {
  --bg-x: center;
  --bg-y: bottom;
}

.hero {
  background-position-x: var(--bg-x);
  background-position-y: var(--bg-y);
}
```

### 4. **Responsive Design**
You can independently override positioning for different breakpoints:

```css
.banner {
  background-position-x: left;
  background-position-y: center;
}

@media (max-width: 768px) {
  .banner {
    background-position-x: center; /* Only change horizontal */
  }
}
```

### 5. **JavaScript Manipulation**
These properties are easier to manipulate via JavaScript for interactive effects:

```javascript
element.style.backgroundPositionX = mouseMoveX + '%';
element.style.backgroundPositionY = mouseMoveY + '%';
```

### 6. **Parallax Effects**
Ideal for creating parallax scrolling effects where X and Y movements are controlled independently.

### 7. **Sprite Animation**
Useful for controlling sprite sheet animations where you need to update only one axis at a time.

## Browser Support

### Desktop Browsers

| Browser | Version | Support |
|---------|---------|---------|
| **Chrome** | 4+ | ✅ Full Support |
| **Firefox** | 49+ | ✅ Full Support |
| **Safari** | 3.1+ | ✅ Full Support |
| **Edge** | 12+ | ✅ Full Support |
| **Opera** | 15+ | ✅ Full Support |
| **Internet Explorer** | 5.5+ | ✅ Full Support |

### Mobile Browsers

| Browser | Version | Support |
|---------|---------|---------|
| **iOS Safari** | 3.2+ | ✅ Full Support |
| **Android Browser** | 2.1+ | ✅ Full Support |
| **Chrome Android** | Latest | ✅ Full Support |
| **Firefox Android** | 49+ | ✅ Full Support |
| **Samsung Internet** | 4+ | ✅ Full Support |
| **Opera Mobile** | 80+ | ✅ Full Support |
| **Opera Mini** | All | ❌ No Support |

### Extended Support Status

#### First Version with Full Support by Vendor

- **Internet Explorer:** 5.5
- **Edge:** 12
- **Chrome:** 4
- **Firefox:** 49
- **Safari:** 3.1
- **Opera:** 15

#### Mobile-Specific Notes

- **Opera Mini:** Not supported (entire version range)
- **BlackBerry:** Supported (7+)
- **UC Browser:** Supported (15.5+)
- **QQ Browser:** Supported (14.9+)
- **Baidu Browser:** Supported (13.52+)
- **KaiOS:** Supported (3.0+)

## Known Issues and Workarounds

### Firefox Support History
Firefox did not support `background-position-x` and `background-position-y` until version 49. For Firefox 31-48, a workaround using CSS variables was necessary.

#### Workaround for Older Firefox Versions (Firefox 31-48)

If you need to support these older Firefox versions, you can use CSS variables with `background-position`:

```css
:root {
  --pos-x: center;
  --pos-y: bottom;
}

.element {
  /* Fallback for browsers that don't support longhand properties */
  background-position: var(--pos-x) var(--pos-y);

  /* Modern browsers */
  background-position-x: var(--pos-x);
  background-position-y: var(--pos-y);
}
```

See [this Stack Overflow answer](https://stackoverflow.com/a/29282573/94197) for additional examples and discussion.

### Modern Browser Compatibility
For modern browser targeting (Firefox 49+), `background-position-x` and `background-position-y` can be used without hesitation.

## Practical Examples

### Basic Example
```css
.header-background {
  background-image: url('header.jpg');
  background-size: cover;
  background-position-x: center;
  background-position-y: top;
}
```

### Responsive Positioning
```css
.hero-section {
  background-image: url('hero.jpg');
  background-size: cover;
  background-position-x: left;
  background-position-y: center;
}

@media (max-width: 768px) {
  .hero-section {
    background-position-x: center;
  }
}
```

### With CSS Variables
```css
:root {
  --bg-horizontal: 50%;
  --bg-vertical: 50%;
}

.dynamic-bg {
  background-image: url('pattern.png');
  background-position-x: var(--bg-horizontal);
  background-position-y: var(--bg-vertical);
}
```

### Parallax Effect
```javascript
const element = document.querySelector('.parallax-bg');

document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;

  element.style.backgroundPositionX = x + '%';
  element.style.backgroundPositionY = y + '%';
});
```

## Related Resources

### Official Documentation
- **[MDN - background-position-x](https://developer.mozilla.org/en-US/docs/Web/CSS/background-position-x)** - Complete MDN reference for the x property
- **[MDN - background-position-y](https://developer.mozilla.org/en-US/docs/Web/CSS/background-position-y)** - Complete MDN reference for the y property

### Related Properties
- **[background-position](https://developer.mozilla.org/en-US/docs/Web/CSS/background-position)** - The shorthand property
- **[background-size](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size)** - Controls background image sizing
- **[background-attachment](https://developer.mozilla.org/en-US/docs/Web/CSS/background-attachment)** - Controls background scrolling behavior

### Discussions and Implementation
- **[Firefox Implementation Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=550426)** - Original Firefox implementation tracking
- **[Blog Post on background-position-x & y](https://snook.ca/archives/html_and_css/background-position-x-y)** - Jon Snook's discussion on these properties

## Summary

`background-position-x` and `background-position-y` are well-supported CSS properties with excellent cross-browser compatibility. They provide a more explicit and maintainable way to control background positioning compared to the shorthand `background-position` property. With 93.57% global support and universal coverage in modern browsers, these properties can be safely used in production code without compatibility concerns.

The only notable limitation is Opera Mini, which does not support these properties. For all other modern browsers (including older IE), full support is available.

---

*Last Updated: 2025-12-13*
*Data Source: CanIUse*
