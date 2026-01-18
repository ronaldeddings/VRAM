# `:focus-within` CSS Pseudo-class

## Overview

The `:focus-within` pseudo-class selector matches an element that either itself has focus or contains a descendant that has focus. This enables styling of container elements when any child element receives keyboard or mouse focus, making it valuable for form validation UI, complex input patterns, and accessibility enhancements.

## Description

The `:focus-within` pseudo-class matches elements that either themselves match `:focus` or that have descendants which match `:focus`. This allows developers to style parent containers based on the focus state of their children without requiring JavaScript.

## Specification

- **Status**: Unofficial (in development)
- **Specification URL**: [W3C CSS Selectors Level 4](https://w3c.github.io/csswg-drafts/selectors-4/#the-focus-within-pseudo)

## Categories

- CSS

## Benefits and Use Cases

### 1. **Form Styling and Validation**
Highlight form containers when any input field within them receives focus:
```css
.form-group:focus-within {
  border-color: #0066ff;
  background-color: rgba(0, 102, 255, 0.05);
}
```

### 2. **Complex Input Patterns**
Style multi-field input components (credit card forms, date pickers) when any part is active:
```css
.input-group:focus-within {
  box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
}
```

### 3. **Accessible Label Highlighting**
Highlight labels when their associated inputs receive focus:
```css
.label-wrapper:focus-within label {
  color: #0066ff;
  font-weight: 600;
}
```

### 4. **Search Interface Enhancement**
Highlight search containers when the input is focused:
```css
.search-container:focus-within {
  border-color: #0066ff;
}

.search-container:focus-within .search-icon {
  color: #0066ff;
}
```

### 5. **Modal and Dialog Styling**
Style modal backdrops or containers when content inside receives focus:
```css
.dialog:focus-within {
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.8);
}
```

### 6. **Keyboard Navigation Indicators**
Provide visual feedback for keyboard users navigating through nested components:
```css
.card:focus-within {
  outline: 2px solid #0066ff;
  outline-offset: 2px;
}
```

## Browser Support

| Browser | First Version with Full Support | Badge |
|---------|--------------------------------|-------|
| Chrome | 60 | ✅ |
| Firefox | 52 | ✅ |
| Safari | 10.1 | ✅ |
| Edge | 79 | ✅ |
| Opera | 47 | ✅ |
| iOS Safari | 10.3 | ✅ |
| Android Chrome | 142+ | ✅ |
| Android Firefox | 144+ | ✅ |

### Overall Support

- **Global Support**: 92.98% of users (as of the last data update)
- **No Android support in Opera Mini** (all versions)

### Version Details by Browser

#### Desktop Browsers
- **Internet Explorer**: Not supported (versions 5.5-11)
- **Chrome**: Fully supported from version 60 onwards
  - Version 59: Partial support (disabled, requires "Experimental Web Platform Features" flag)
- **Firefox**: Fully supported from version 52 onwards
- **Safari**: Fully supported from version 10.1 onwards
- **Opera**: Fully supported from version 47 onwards
- **Edge (Chromium)**: Fully supported from version 79 onwards

#### Mobile Browsers
- **iOS Safari**: Fully supported from version 10.3 onwards
- **Android Browser**: Limited early support; Chrome 142+ provides full support
- **Samsung Internet**: Fully supported from version 8.2 onwards
- **Opera Mobile**: Fully supported from version 80 onwards
- **Opera Mini**: Not supported (all versions)

## Known Issues and Notes

### Experimental Flag
- **Chrome 59**: Can be enabled via the "Experimental Web Platform Features" flag in `chrome://flags/`

### No Reported Bugs
At the time of documentation, there are no significant known bugs or compatibility issues for `:focus-within` implementation.

## Technical Details

- **Selector Type**: Pseudo-class
- **Inheritance**: Non-inherited
- **JavaScript Equivalent**: Can detect focus within an element using `document.activeElement`
- **Vendor Prefixes**: Not required (unprefixed support across all modern browsers)

## Polyfills and Fallbacks

### JavaScript Polyfill
For browsers without native support, consider using:
- **[ally.js](https://allyjs.io/)** - Provides `ally.style.focusWithin()` polyfill

### Fallback Approaches
1. **JavaScript-based Focus Detection**:
   ```javascript
   element.addEventListener('focusin', (e) => {
     element.classList.add('has-focus');
   });

   element.addEventListener('focusout', (e) => {
     if (!element.contains(e.relatedTarget)) {
       element.classList.remove('has-focus');
     }
   });
   ```

2. **`:focus` for Direct Elements**:
   ```css
   input:focus {
     border-color: blue;
   }
   ```

## Implementation Example

### HTML
```html
<div class="form-group">
  <label for="email">Email Address</label>
  <input type="email" id="email" placeholder="Enter your email">
</div>
```

### CSS
```css
.form-group {
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  transition: all 0.2s ease;
}

/* Highlight the entire form group when the input is focused */
.form-group:focus-within {
  border-color: #0066ff;
  background-color: rgba(0, 102, 255, 0.05);
  box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
}

/* Optional: Style the label within the focused group */
.form-group:focus-within label {
  color: #0066ff;
  font-weight: 600;
}
```

## Related Links

- [MDN Web Docs - :focus-within](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-within)
- [The Future Generation of CSS Selectors: Level 4 - Generalized Input Focus Pseudo-class](https://www.sitepoint.com/future-generation-css-selectors-level-4/#generalized-input-focus-pseudo-class-focus-within)
- [ally.js Polyfill - focusWithin Documentation](https://allyjs.io/api/style/focus-within.html)
- [WebKit Bug #140144 - Add support for CSS4 :focus-within pseudo](https://bugs.webkit.org/show_bug.cgi?id=140144)
- [Chromium Issue #617371 - Implement :focus-within pseudo-class from Selectors Level 4](https://bugs.chromium.org/p/chromium/issues/detail?id=617371)
- [Mozilla Bug #1176997 - Add support for pseudo class :focus-within](https://bugzilla.mozilla.org/show_bug.cgi?id=1176997)
- [JS Bin Test Case](https://jsbin.com/qevoqa/edit?html,css,output)

## Summary

The `:focus-within` pseudo-class provides a modern, accessible way to style container elements based on the focus state of their children. With 92.98% global browser support, it's safe to use in most production applications. Modern versions of all major browsers support it, with older Internet Explorer being the only notable exception. For applications requiring IE support, JavaScript-based solutions or polyfills are available.
