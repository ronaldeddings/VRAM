# Scoped Attribute

## Overview

The `scoped` attribute on the `<style>` element was a deprecated method for achieving scoped CSS styles in HTML documents. This feature has been removed from the web standards and replaced by the modern `@scope` CSS rule.

## Description

The `<style scoped>` attribute allowed CSS rules within a `<style>` element to be limited in scope to the parent element and its children, preventing global style pollution and namespace conflicts. While promising, this feature was ultimately abandoned due to implementation complexity and the emergence of better alternatives such as:

- CSS Shadow DOM/Web Components
- CSS Modules
- The modern `@scope` CSS rule

The feature has been [removed from the HTML specification](https://github.com/whatwg/html/issues/552).

## Specification Status

**Status:** Unofficial/Deprecated
**Spec URL:** [W3C HTML 5.1 - style scoped attribute](https://www.w3.org/TR/html51/document-metadata.html#element-attrdef-style-scoped)

## Categories

- CSS
- HTML5

## Use Cases & Benefits

While now deprecated, `<style scoped>` was historically proposed for:

- **Style Encapsulation:** Limiting CSS scope to specific DOM subtrees
- **Avoiding Conflicts:** Preventing accidental style conflicts between components
- **CSS Organization:** Grouping related styles with their markup
- **Component Styling:** Providing simple scoping for component-based architectures

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| **Chrome** | ❌ No | Experimental flag support in versions 20-36 (disabled by default) |
| **Firefox** | ⚠️ Limited | Full support in versions 21-54; disabled behind `layout.css.scoped-style.enabled` flag in 55-60; removed in 61+ |
| **Safari** | ❌ No | Never supported |
| **Edge** | ❌ No | Never supported |
| **IE** | ❌ No | Never supported |
| **Opera** | ❌ No | Never supported |
| **iOS Safari** | ❌ No | Never supported |
| **Android Browser** | ❌ No | Never supported |
| **KaiOS** | ⚠️ Partial | Limited support (v2.5 only) |

### Support Timeline

- **Firefox 21-54:** Full native support
- **Firefox 55-60:** Support disabled behind experimental flag
- **Firefox 61+:** Feature completely removed
- **Chrome 20-36:** Experimental support behind feature flag
- **Chrome 37+:** Feature removed

## Comparison with Modern Alternatives

### Modern `@scope` CSS Rule

The recommended replacement for scoped styles:

```css
@scope (.card) {
  p {
    font-size: 1.1rem;
  }
  h2 {
    color: #333;
  }
}
```

### Web Components / Shadow DOM

```javascript
class MyComponent extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        p { color: blue; } /* Scoped to shadow DOM */
      </style>
      <p>This is scoped</p>
    `;
  }
}
```

### CSS Modules (Build-Time)

```css
/* button.module.css */
.primary {
  background-color: blue;
  color: white;
}
```

## Syntax Reference

The deprecated syntax was:

```html
<style scoped>
  p { color: blue; }
  h1 { font-size: 2rem; }
</style>

<article>
  <p>Only this paragraph would be blue</p>
</article>
```

## Technical Notes

- **Flag Support:** The feature could be enabled in some browsers through experimental feature flags or about:config settings
- **Limited Implementation:** Only Firefox and Chrome (via flag) provided meaningful support
- **No Polyfill Perfection:** Full polyfill support was impossible without parsing and rewriting CSS
- **Standardization Issues:** The feature presented challenges for style scoping mechanisms that led to its eventual removal

## Experimental Feature Flags

If you encounter this feature in legacy code, it could be toggled via:

- **Chrome:** `chrome://flags` → "experimental Web Platform features" (versions 20-36)
- **Firefox:** `about:config` → `layout.css.scoped-style.enabled` (versions 55-60)

## Migration Guide

### From `<style scoped>` to Modern Solutions

**Original Code:**
```html
<section>
  <style scoped>
    .title { color: navy; }
  </style>
  <h2 class="title">Scoped Title</h2>
</section>
```

**Modern Alternative - Web Components:**
```javascript
class ScopedSection extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        .title { color: navy; }
      </style>
      <h2 class="title">Scoped Title</h2>
    `;
  }
}
customElements.define('scoped-section', ScopedSection);
```

**Modern Alternative - @scope Rule:**
```html
<style>
  @scope (.scoped-section) {
    .title { color: navy; }
  }
</style>

<section class="scoped-section">
  <h2 class="title">Scoped Title</h2>
</section>
```

## Related Features

- **[@scope CSS Rule](/css-cascade-scope)** - Modern, standardized CSS scoping mechanism
- **[Web Components](/web-components)** - Provides true style encapsulation
- **[Shadow DOM](/shadow-dom)** - Enables style isolation
- **[CSS Cascade Layers](/css-cascade-layers)** - Helps organize CSS specificity

## Resources

- **[Polyfill for Scoped Styles](https://github.com/PM5544/scoped-polyfill)** - Experimental polyfill implementation
- **[HTML5 Doctor: The Scoped Attribute](https://html5doctor.com/the-scoped-attribute/)** - Historical overview and explanation
- **[HTML5Rocks: Introducing Style Scoped](https://developer.chrome.com/blog/a-new-experimental-feature-style-scoped/)** - Original experimental feature documentation
- **[Firefox Bug Tracker: Issue #1291515](https://bugzilla.mozilla.org/show_bug.cgi?id=1291515)** - Firefox removal tracking

## Global Usage

- **Supported:** 0.07% of users (historical, declining)
- **Partial Support:** 0% (feature fully deprecated)
- **Not Supported:** 99.93%

## Summary

The `<style scoped>` attribute represents an early attempt at CSS scoping that has been superseded by more robust and standardized solutions. Developers should not use this feature in new projects. If encountered in legacy code, migrate to Web Components, the `@scope` CSS rule, or other modern CSS-in-JS solutions.

---

**Last Updated:** 2025
**Recommendation:** Use `@scope` CSS rule or Web Components for style scoping needs
