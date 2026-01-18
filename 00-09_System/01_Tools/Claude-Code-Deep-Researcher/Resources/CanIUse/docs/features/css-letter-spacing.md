# CSS `letter-spacing` Property

## Overview

The `letter-spacing` CSS property controls the spacing between characters in text, commonly referred to as "tracking" in typographical terms. This property allows developers to adjust the horizontal distance between individual letters to improve readability, enhance visual design, or achieve specific typographic effects.

**Note:** The `letter-spacing` property is distinct from kerning. While letter-spacing applies uniform spacing across all characters, kerning adjusts spacing between specific character pairs based on their shapes.

---

## Specification

- **Status:** W3C Recommendation (REC)
- **Specification URL:** https://www.w3.org/TR/CSS2/text.html#propdef-letter-spacing
- **Category:** CSS Text Properties

---

## Categories

- CSS

---

## Benefits and Use Cases

### Design & Typography
- **Elegant Headings:** Increase letter-spacing for large, prominent headings to create a sophisticated, luxurious appearance
- **Logo and Branding:** Fine-tune letter spacing for brand logos and wordmarks to achieve perfect visual balance
- **Decorative Text:** Add character spacing to create stylized or artistic text effects

### Readability & Accessibility
- **Improved Legibility:** Increase spacing for body text, especially in display scenarios, to enhance readability
- **Accessibility:** Wider spacing can help users with dyslexia or visual impairments read text more easily
- **All-Caps Text:** Increase letter-spacing when using all-caps typography to prevent visual crowding

### Content & Document Formatting
- **Technical Documentation:** Add subtle spacing to improve readability in technical manuals and guides
- **Poetry and Literature:** Adjust spacing for creative typography in literary websites
- **Labels and UI Elements:** Fine-tune spacing for form labels, buttons, and interface elements

### Responsive Design
- **Breakpoint-Specific Spacing:** Adjust letter-spacing at different viewport sizes for optimal readability
- **Mobile Optimization:** Reduce or increase spacing based on screen size and viewing distance

---

## Syntax

```css
/* Keyword value */
letter-spacing: normal;

/* Length values */
letter-spacing: 0.3em;
letter-spacing: 3px;
letter-spacing: 0.5rem;
letter-spacing: -1px;

/* Global values */
letter-spacing: inherit;
letter-spacing: initial;
letter-spacing: revert;
letter-spacing: unset;
```

### Values
- **`normal`:** Default spacing as defined by the font (typically 0)
- **`<length>`:** Specifies letter spacing as a fixed distance (positive or negative values)
- **Negative values:** Decrease spacing between characters
- **Positive values:** Increase spacing between characters

---

## Browser Support

CSS `letter-spacing` has excellent support across all modern browsers. The feature is universally supported, with only legacy versions of Internet Explorer and early browser releases showing partial support (marked as "A - Supported with bugs/limitations").

### Support Summary by Browser

| Browser | First Full Support | Status |
|---------|-------------------|--------|
| **Chrome** | 30+ | Full Support |
| **Edge** | 12+ | Full Support |
| **Firefox** | 2+ | Full Support |
| **Safari** | 6.1+ | Full Support |
| **Opera** | 17+ | Full Support |
| **iOS Safari** | 4.0+ | Full Support |
| **Android Browser** | 4.4+ | Full Support |
| **Samsung Internet** | 4+ | Full Support |

### Detailed Browser History

#### Desktop Browsers

**Internet Explorer**
- **5.5:** Unsupported (U)
- **6-8:** Partial support with bugs (A) - Note #1: Truncates or rounds fractional portions of values
- **9-11:** Full support (Y)

**Chrome**
- **4-29:** Partial support with bugs (A) - Note #1: Truncates or rounds fractional portions of values
- **30+:** Full support (Y)

**Firefox**
- **2+:** Full support (Y)

**Safari**
- **3.1:** Unsupported (U)
- **3.2-6:** Partial support with bugs (A) - Note #1: Truncates or rounds fractional portions of values
- **6.1+:** Full support (Y)

**Opera**
- **9-9.6:** Unsupported (U)
- **10.0-16:** Partial support with bugs (A) - Note #1: Truncates or rounds fractional portions of values
- **17+:** Full support (Y)

#### Mobile Browsers

**iOS Safari**
- **3.2:** Unsupported (U)
- **4.0+:** Full support (Y)

**Android Browser**
- **2.1-2.2:** Unsupported (U)
- **2.3-4.3:** Partial support with bugs (A) - Note #1: Truncates or rounds fractional portions of values
- **4.4+:** Full support (Y)

**Samsung Internet**
- **4+:** Full support (Y)

**Opera Mobile**
- **10-12.1:** Partial support with bugs (A) - Note #1: Truncates or rounds fractional portions of values
- **80+:** Full support (Y)

**Android Chrome**
- **142+:** Full support (Y)

**Android Firefox**
- **144+:** Full support (Y)

**Opera Mini**
- **All versions:** Not supported (N)

#### Other Browsers

**BlackBerry Browser**
- **7, 10:** Partial support with bugs (A) - Note #1: Truncates or rounds fractional portions of values

**IE Mobile**
- **10-11:** Full support (Y)

**UC Browser (Android)**
- **15.5+:** Full support (Y)

**KaiOS Browser**
- **2.5+:** Full support (Y)

**Baidu Browser**
- **13.52+:** Full support (Y)

---

## Known Issues and Bugs

### Note #1: Fractional Value Handling
**Affected Versions:** IE 6-8, Chrome 4-29, Safari 3.2-6, Opera 10-16, Android 2.3-4.3, BlackBerry 7-10, Opera Mobile 10-12.1

**Issue:** These browser versions truncate or round fractional portions of letter-spacing values.

**Example:**
```css
.text {
  letter-spacing: 0.5px; /* May be rounded to 0px or 1px */
  letter-spacing: 0.25em; /* May be truncated to 0em */
}
```

**Workaround:** If targeting legacy browsers, test your specific spacing values carefully. Consider using integer pixel values or larger em/rem units to avoid unintended rounding.

---

## Global Usage Statistics

- **Full Support (Y):** 93.65% of users
- **Partial Support (A):** 0.03% of users
- **No Support (N):** Minimal percentage

**Note:** Opera Mini does not support letter-spacing.

---

## Usage Recommendations

### Best Practices

1. **Use Relative Units:** Prefer `em` or `rem` units for better scalability across different font sizes
   ```css
   h1 { letter-spacing: 0.1em; }
   p { letter-spacing: 0.02em; }
   ```

2. **Test Readability:** Always verify that increased spacing improves rather than diminishes readability
   ```css
   /* Good: subtle enhancement */
   .heading { letter-spacing: 0.1em; }

   /* Avoid: excessive spacing */
   .heading { letter-spacing: 1em; }
   ```

3. **Consider Font:** Different fonts may require different spacing adjustments
   ```css
   /* Serif fonts may benefit from slightly more spacing */
   .serif { letter-spacing: 0.05em; }

   /* Sans-serif fonts often look good with tighter spacing */
   .sans-serif { letter-spacing: 0.02em; }
   ```

4. **Responsive Adjustments:** Adapt letter-spacing for different viewport sizes
   ```css
   h1 { letter-spacing: 0.1em; }

   @media (max-width: 768px) {
     h1 { letter-spacing: 0.05em; }
   }
   ```

5. **All-Caps Typography:** Increase spacing when using `text-transform: uppercase`
   ```css
   .uppercase {
     text-transform: uppercase;
     letter-spacing: 0.15em;
   }
   ```

### No Vendor Prefixes Required

The `letter-spacing` property does not require any vendor prefixes (`-webkit-`, `-moz-`, etc.), as it has been widely supported for many years.

---

## Examples

### Basic Letter Spacing

```css
/* Decrease spacing */
.tight { letter-spacing: -0.05em; }

/* Normal spacing */
.normal { letter-spacing: normal; }

/* Increase spacing slightly */
.loose { letter-spacing: 0.05em; }

/* Increase spacing significantly (for headings) */
.wide { letter-spacing: 0.2em; }
```

### Practical Examples

```css
/* Elegant headline */
h1 {
  font-size: 2.5rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-weight: 300;
}

/* Body text (subtle improvement) */
p {
  font-size: 1rem;
  line-height: 1.6;
  letter-spacing: 0.02em;
}

/* Technical documentation */
code, .monospace {
  font-family: 'Courier New', monospace;
  letter-spacing: 0.05em;
}

/* Logo styling */
.logo {
  font-size: 1.5rem;
  letter-spacing: 0.1em;
  font-weight: bold;
}
```

---

## Related Properties

- **`word-spacing`** - Controls spacing between words
- **`line-height`** - Controls vertical spacing between lines
- **`text-transform`** - Transforms text case (often used with letter-spacing adjustments)
- **`font-kerning`** - Controls automatic kerning adjustments
- **`text-indent`** - Indentation of text blocks
- **`white-space`** - Handling of whitespace in text

---

## Related Links

- [MDN Web Docs - CSS letter-spacing](https://developer.mozilla.org/en-US/docs/Web/CSS/letter-spacing)
- [W3C CSS Specification](https://www.w3.org/TR/CSS2/text.html#propdef-letter-spacing)
- [CSS Text Module Level 3](https://www.w3.org/TR/css-text-3/)

---

## Browser Compatibility Chart

```
✓ = Full Support
◐ = Partial Support (with bugs)
✗ = Not Supported

Desktop Browsers:
- Chrome: ✓ (v30+)
- Firefox: ✓ (v2+)
- Safari: ✓ (v6.1+)
- Edge: ✓ (v12+)
- Opera: ✓ (v17+)
- IE: ◐ (v6-8), ✓ (v9-11)

Mobile Browsers:
- iOS Safari: ✓ (v4.0+)
- Android: ✓ (v4.4+)
- Samsung Internet: ✓ (v4+)
- Opera Mobile: ✓ (v80+)
- Opera Mini: ✗ (All versions)

Modern support is virtually universal across all major browsers.
```

---

## Summary

The `letter-spacing` CSS property is a well-established, universally supported feature for controlling character spacing in text. With 93.65% of users on browsers with full support and minimal issues in modern browsers, it's safe to use without polyfills or fallbacks. The property is particularly valuable for typography-focused designs, accessibility enhancements, and responsive text styling.

For legacy browser support (IE 6-8, Chrome 4-29, Safari 3.2-6), be aware of the fractional value truncation issue and test accordingly. Overall, this is a reliable and essential tool in any modern web designer's toolkit.
