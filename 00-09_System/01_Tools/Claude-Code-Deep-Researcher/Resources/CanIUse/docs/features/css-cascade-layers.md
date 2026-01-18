# CSS Cascade Layers

## Overview

CSS Cascade Layers introduces a powerful new way to manage CSS specificity and the cascade through the `@layer` at-rule. This feature allows developers to explicitly organize their stylesheets into layers, giving authors fine-grained control over style priority before specificity and source order are considered.

The `@layer` at-rule enables authors to explicitly layer their styles in the cascade, establishing a clear order of precedence that goes beyond traditional CSS specificity rules. This is particularly valuable for managing styles across large projects, frameworks, and third-party libraries.

## Specification

- **Status**: Candidate Recommendation (CR)
- **Specification URL**: [CSS Cascade Module Level 5](https://www.w3.org/TR/css-cascade-5/)
- **First Published**: CSS Cascade Module Level 5 specification

## Categories

- CSS

## Key Benefits & Use Cases

### Benefits

- **Predictable Style Priority**: Explicitly define layer order without relying on specificity wars
- **Framework Integration**: Easily integrate multiple stylesheets and frameworks with controlled precedence
- **Maintenance**: Reduce specificity-related bugs by organizing styles into logical layers
- **Scalability**: Manage large codebases more effectively with clear style hierarchies
- **Specificity Independence**: Lower specificity selectors can override higher specificity in previous layers

### Common Use Cases

1. **Multi-Framework Projects**: Manage styles when using multiple CSS frameworks or libraries
2. **Design System Integration**: Layer design system styles separately from application styles
3. **Third-Party Libraries**: Control precedence of third-party CSS without increasing specificity
4. **Legacy Code Migration**: Gradually migrate styles while maintaining predictable cascade
5. **Component Libraries**: Establish clear style boundaries and override capabilities
6. **Theming Systems**: Create layered theme structures with override layers
7. **Reset/Normalize Layers**: Organize CSS resets, normalizes, and utility layers systematically

## Browser Support

### Current Support Status

| Browser | First Version with Full Support | Notes |
|---------|--------------------------------|-------|
| **Chrome** | 99 | Full support from version 99+ |
| **Edge** | 99 | Full support from version 99+ |
| **Firefox** | 97 | Full support from version 97+ |
| **Safari** | 15.4 | Full support from version 15.4+ |
| **Opera** | 86 | Full support from version 86+ |
| **Chrome (Android)** | 142 | Full support from version 142+ |
| **Firefox (Android)** | 144 | Full support from version 144+ |
| **Safari (iOS)** | 15.4 | Full support from version 15.4+ |
| **Samsung Internet** | 18.0 | Full support from version 18.0+ |
| **Opera Mobile** | 80 | Full support from version 80+ |
| **UC Browser** | 15.5 | Full support from version 15.5+ |

### Legacy/Unsupported Browsers

- **Internet Explorer**: Not supported (all versions)
- **Opera Mini**: Not supported
- **BlackBerry Browser**: Not supported
- **UC Browser (older versions)**: Not supported

### Global Usage

- **Supported by**: 91.98% of tracked users
- **With prefix**: No

## Implementation Notes

### Chrome/Chromium Notes

In Chrome versions 96-98, CSS Cascade Layers support can be enabled using the runtime flag:
```
--enable-blink-features=CSSCascadeLayers
```

This support was available through Chrome Canary before becoming stable in version 99.

### Firefox Notes

In Firefox versions 94-96, support can be enabled via the feature flag:
```
about:config → layout.css.cascade-layers.enabled
```

Full support became standard starting with Firefox 97.

## Basic Syntax

### Declaring Layers

```css
/* Define layers in order */
@layer reset, base, theme, utilities;

/* Define styles within layers */
@layer reset {
  * { margin: 0; padding: 0; }
}

@layer base {
  body { font-family: sans-serif; }
}

@layer theme {
  button { background-color: blue; }
}

@layer utilities {
  .text-center { text-align: center; }
}
```

### Layer Precedence

Layers declared earlier have lower precedence. Later layers override earlier ones:

```css
@layer first, second, third;

@layer first { p { color: red; } }      /* Lowest precedence */
@layer second { p { color: green; } }   /* Medium precedence */
@layer third { p { color: blue; } }     /* Highest precedence in layers */
```

The paragraph text will be blue due to layer precedence, regardless of specificity.

### Unlayered Styles

Unlayered styles always have the highest precedence:

```css
@layer utilities { p { color: blue; } }

p { color: red; } /* This wins - unlayered styles override all layers */
```

## Known Issues & Browser Behaviors

### No Known Critical Bugs

As of the current data snapshot, there are no reported critical bugs or incompatibilities with CSS Cascade Layers implementation across supported browsers.

### Considerations

- **Old Browser Support**: Will require fallback strategies for projects supporting Internet Explorer or other legacy browsers
- **Feature Detection**: Use `@supports` rules or CSS feature detection for progressive enhancement
- **Layering Order**: Layer order is determined by the order of `@layer` declarations, not by specificity

## Related Resources

### Official Documentation & Articles

- [The Future of CSS: Cascade Layers (CSS @layer)](https://www.bram.us/2021/09/15/the-future-of-css-cascade-layers-css-at-layer/) - Comprehensive introduction by Bramus Van Damme
- [Collection of CSS Cascade Layers Demos](https://codepen.io/collection/BNjmma) - Interactive CodePen examples

### Issue Tracking

- [Chromium Issue Tracker](https://crbug.com/1095765)
- [Firefox Bugzilla](https://bugzilla.mozilla.org/show_bug.cgi?id=1699215)
- [WebKit Bug Tracker](https://bugs.webkit.org/show_bug.cgi?id=220779)

### Browser Support References

- CanIUse: CSS Cascade Layers - For detailed compatibility tables
- MDN Web Docs: CSS @layer - For comprehensive technical documentation

## Compatibility Matrix

### Desktop Browsers

```
Chrome         ███████████████████████████████████ ✓ (99+)
Firefox        ████████████████████████████░░░░░░░ ✓ (97+)
Safari         ██████████░░░░░░░░░░░░░░░░░░░░░░░░ ✓ (15.4+)
Edge           ███████████████████████████████████ ✓ (99+)
Opera          ██████████████████████░░░░░░░░░░░░ ✓ (86+)
IE             ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ✗ (Never)
```

### Mobile Browsers

```
Chrome Mobile  ███████████████████████████████████ ✓ (142+)
Firefox Mobile ███████████████████████████████████ ✓ (144+)
Safari iOS     ██████████░░░░░░░░░░░░░░░░░░░░░░░░ ✓ (15.4+)
Samsung        ███████████████████░░░░░░░░░░░░░░░ ✓ (18.0+)
Opera Mobile   ██████████████████░░░░░░░░░░░░░░░░ ✓ (80+)
UC Browser     ██████████░░░░░░░░░░░░░░░░░░░░░░░░ ✓ (15.5+)
Opera Mini     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ✗ (Never)
```

## Migration & Feature Detection

### Feature Detection

Detect support for CSS Cascade Layers:

```css
@supports (@layer test) {
  /* CSS Cascade Layers supported */
  @layer utilities {
    .text-center { text-align: center; }
  }
}
```

### JavaScript Detection

```javascript
const supportsCascadeLayers = CSS.supports('@layer test');
```

### Graceful Degradation

```css
/* Fallback for unsupported browsers */
.text-center { text-align: center; }

/* Enhanced with layers for supporting browsers */
@supports (@layer test) {
  @layer utilities {
    .text-center { text-align: center; }
  }
}
```

## Best Practices

1. **Declare Layer Order First**: Always declare your layer order at the beginning of your stylesheet
2. **Clear Naming**: Use semantic names for layers (reset, base, components, utilities, etc.)
3. **Consistent Organization**: Keep all styles for a layer in one place
4. **Avoid Specificity Wars**: Rely on layer precedence rather than increasing specificity
5. **Document Intent**: Comment on your layer structure to help team members understand precedence
6. **Test Cross-Browser**: While support is good, test in your target browsers
7. **Combine with @supports**: Use feature queries for progressive enhancement

## Summary

CSS Cascade Layers is a modern CSS feature that has achieved widespread browser support (91.98% of tracked users). It provides a cleaner, more maintainable approach to CSS organization that addresses long-standing issues with specificity and cascade predictability. With support across all major browsers and mobile platforms, it's ready for production use with appropriate fallback strategies for legacy browser support requirements.

---

**Last Updated**: 2025-12-13
**Data Source**: CanIUse Database
