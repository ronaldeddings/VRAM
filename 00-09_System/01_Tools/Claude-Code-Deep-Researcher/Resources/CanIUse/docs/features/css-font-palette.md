# CSS font-palette

## Overview

The `font-palette` CSS property allows selecting a palette from a color font. In combination with the `@font-palette-values` at-rule, custom palettes can be defined.

**Specification Status:** Working Draft (WD)
**First Published:** 2022
**Current Usage:** 91.38% of global traffic

---

## Description

CSS font-palette is a powerful feature for working with color fonts (COLR/CPAL formats). Color fonts contain built-in color palettes that can be used to render glyphs in multiple colors. The `font-palette` property enables developers to:

- Select predefined palettes from color fonts
- Define custom color palettes using `@font-palette-values`
- Apply consistent theming to color font glyphs
- Create dark/light mode variants with minimal CSS changes

This feature is particularly useful for:
- Emoji and symbol fonts with multiple color variations
- Branded icons and illustrations
- Accessible color customization for users with color vision deficiency
- Dynamic theming in web applications

---

## Specification

- **W3C CSS Fonts Module Level 4**
- **Specification Link:** https://www.w3.org/TR/css-fonts-4/#propdef-font-palette
- **Status:** Working Draft

---

## Categories

- CSS

---

## Benefits and Use Cases

### 1. **Theming and Branding**
Color fonts enable consistent brand color application across all glyphs without requiring separate image assets or multiple font files.

### 2. **Dark/Light Mode Support**
Easily switch between light and dark theme color palettes using CSS, reducing the need for separate icon sets.

### 3. **Accessibility**
Define alternative color palettes optimized for users with color vision deficiency or specific accessibility needs.

### 4. **Reduced File Size**
Single color font file can replace multiple monochrome font files or SVG sprite sheets.

### 5. **Dynamic Theming**
Change color palettes at runtime using CSS variables and dynamic palette definitions.

### 6. **Enhanced User Experience**
Create visually rich, multi-colored emoji and icon experiences with native font rendering.

---

## Browser Support

### Support by Browser

| Browser | First Version | Current Status |
|---------|:-------------:|:--------------:|
| **Chrome** | 101+ | ✅ Full Support |
| **Edge** | 105+ | ✅ Full Support |
| **Firefox** | 107+ | ✅ Full Support |
| **Safari** | 15.4+ | ✅ Full Support |
| **Opera** | 87+ | ✅ Full Support |
| **iOS Safari** | 15.4+ | ✅ Full Support |
| **Chrome Mobile** | 142+ | ✅ Full Support |
| **Firefox Mobile** | 144+ | ✅ Full Support |
| **Opera Mobile** | 80+ | ✅ Full Support |
| **Samsung Internet** | 19.0+ | ✅ Full Support |
| **Internet Explorer** | N/A | ❌ Not Supported |
| **Opera Mini** | N/A | ❌ Not Supported |

### Global Browser Coverage

- **With Full Support:** 91.38% of global web traffic
- **Partial Support:** 0%
- **Without Support:** 8.62%

### Browser Timeline

**2022:**
- Safari 15.4 (first major browser support)

**2023:**
- Chrome 101
- Firefox 107
- Edge 105
- Opera 87

**Mobile:**
- iOS Safari 15.4
- Chrome Android 142
- Firefox Android 144

### Legacy Browser Support

- **Internet Explorer:** No support (11.0 and below)
- **Opera Mini:** No support (all versions)
- **BlackBerry Browser:** No support (10.0 and below)
- **UC Browser:** No support (15.5 and below)

---

## Syntax

### Basic Property Usage

```css
/* Use a predefined palette from the font */
.element {
  font-family: 'ColorFont';
  font-palette: 0; /* First palette */
  font-palette: 1; /* Second palette */
}

/* Use light or dark palette based on preference */
.element {
  font-palette: light;
  font-palette: dark;
}
```

### Custom Palette Definition

```css
@font-palette-values --custom-palette {
  font-family: 'ColorFont';
  base-palette: 0; /* Start from predefined palette */
  override-colors: 0 #FF0000, 1 #00FF00, 2 #0000FF;
}

.element {
  font-family: 'ColorFont';
  font-palette: --custom-palette;
}
```

### With CSS Variables

```css
@font-palette-values --theme-palette {
  font-family: 'ColorFont';
  base-palette: 0;
  override-colors:
    0 var(--primary-color),
    1 var(--secondary-color),
    2 var(--accent-color);
}

:root {
  --primary-color: #FF0000;
  --secondary-color: #00FF00;
  --accent-color: #0000FF;
}

.themed-icon {
  font-palette: --theme-palette;
}
```

---

## Usage Examples

### Example 1: Simple Theme Switching

```html
<style>
  @font-palette-values --light {
    font-family: 'Noto Color Emoji';
    base-palette: 0;
    override-colors: 0 #000000, 1 #FFFFFF;
  }

  @font-palette-values --dark {
    font-family: 'Noto Color Emoji';
    base-palette: 0;
    override-colors: 0 #FFFFFF, 1 #000000;
  }

  .emoji {
    font-family: 'Noto Color Emoji', sans-serif;
  }

  .emoji.light-mode {
    font-palette: --light;
  }

  .emoji.dark-mode {
    font-palette: --dark;
  }
</style>

<span class="emoji light-mode">👍</span>
<span class="emoji dark-mode">👍</span>
```

### Example 2: Dynamic Theme with CSS Variables

```html
<style>
  :root {
    --color-0: #E64C3B;
    --color-1: #F9B233;
    --color-2: #4ECDC4;
  }

  @font-palette-values --dynamic {
    font-family: 'ColorIcon';
    base-palette: 0;
    override-colors:
      0 var(--color-0),
      1 var(--color-1),
      2 var(--color-2);
  }

  .icon {
    font-family: 'ColorIcon';
    font-palette: --dynamic;
  }

  /* Switch theme at runtime */
  @media (prefers-color-scheme: dark) {
    :root {
      --color-0: #FF6B6B;
      --color-1: #FFD93D;
      --color-2: #6BCB77;
    }
  }
</style>

<span class="icon">🎨</span>
```

### Example 3: Accessibility - Color Vision Deficiency

```css
@font-palette-values --deuteranopia {
  font-family: 'AccessibleEmoji';
  base-palette: 0;
  /* Optimized for red-green color blindness */
  override-colors:
    0 #0173B2,  /* Blue */
    1 #DE8F05,  /* Orange */
    2 #CC78BC;  /* Purple */
}

.accessible-icon {
  font-palette: --deuteranopia;
}
```

---

## Technical Details

### Property Values

- `normal` - Use default or first palette from the font
- `light` - Use the light palette (if available)
- `dark` - Use the dark palette (if available)
- `[integer]` - Use the nth palette (0-indexed)
- `[custom-ident]` - Use a custom palette defined with `@font-palette-values`

### At-Rule: `@font-palette-values`

Defines a custom color palette with the following descriptors:

- `font-family` - Name of the color font to apply the palette to
- `base-palette` - Starting palette index to override
- `override-colors` - List of color index and color pairs to customize

### Support for Color Font Formats

- **COLR/CPAL** - Fully supported (standard format)
- **SVG** - May have limited support depending on browser implementation
- **CBDT/CBLC** - Limited support

---

## Notes and Known Issues

### Browser Implementation Notes

No known critical bugs reported. The feature is stable across all supporting browsers.

### Known Limitations

1. **Font Format Support:** Only COLR/CPAL color fonts are guaranteed to work consistently across all browsers
2. **Palette Count:** The number of available palettes varies by font; not all fonts have multiple palettes
3. **Performance:** Large numbers of `override-colors` may impact rendering performance on low-end devices
4. **CSS Variables:** Not all browsers support CSS variables in `override-colors` equally; test thoroughly

### Implementation Considerations

- Always provide a fallback color scheme for unsupported browsers
- Test with actual color fonts (Noto Color Emoji, etc.) as support varies
- Consider file size impact of including color fonts in your distribution

---

## Migration and Fallback Strategies

### Progressive Enhancement

```css
/* Fallback for non-supporting browsers */
.icon {
  /* Fallback: use monochrome version */
  font-family: 'IconFont-Mono', sans-serif;
  color: #333;
}

/* Enhanced with font-palette support */
@supports (font-palette: normal) {
  .icon {
    font-family: 'IconFont-Color';
    font-palette: --custom;
  }
}
```

### Feature Detection

```javascript
const supportsFontPalette = CSS.supports('font-palette', 'light');

if (supportsFontPalette) {
  document.documentElement.classList.add('has-font-palette');
} else {
  document.documentElement.classList.add('no-font-palette');
}
```

---

## Related Links

### Official Resources
- [W3C CSS Fonts Module Level 4 Specification](https://www.w3.org/TR/css-fonts-4/#propdef-font-palette)
- [Can I use: CSS font-palette](https://caniuse.com/font-palette)

### Browsers and Implementation
- [Safari 15.4 Beta Release Notes](https://webkit.org/blog/12445/new-webkit-features-in-safari-15-4/#typography)
- [Firefox Support Bug (Bugzilla)](https://bugzilla.mozilla.org/show_bug.cgi?id=1461588)

### Learning and Examples
- [Interactive Demo](https://yisibl.github.io/color-font-palette/)
- [CSS Fonts Working Group Palette Explainer](https://github.com/drott/csswg-drafts/blob/paletteExplainer/css-fonts-4/palette-explainer.md)

### Related Features
- [Color Fonts (COLR/CPAL Format)](https://en.wikipedia.org/wiki/Color_font)
- [CSS `@font-face` Rule](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face)
- [CSS `font-family` Property](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family)

### Recommended Color Fonts
- **Noto Color Emoji** - Unicode emoji with multiple color palettes
- **Twemoji** - Twitter's emoji font
- **OpenMoji** - Free, open-source emoji font

---

## Summary Table

| Aspect | Details |
|--------|---------|
| **Specification Status** | Working Draft |
| **First Major Browser Support** | Safari 15.4 (March 2022) |
| **Global Support** | 91.38% of users |
| **Recommended Since** | 2023 |
| **Progressive Enhancement** | Required for older browsers |
| **Dependencies** | Color fonts (COLR/CPAL format) |
| **Performance Impact** | Minimal; improves on monochrome alternatives |
| **Accessibility** | Enables custom accessible color schemes |

---

## Last Updated

Generated from Can I Use feature data. For the latest support information, visit [caniuse.com/font-palette](https://caniuse.com/font-palette).
