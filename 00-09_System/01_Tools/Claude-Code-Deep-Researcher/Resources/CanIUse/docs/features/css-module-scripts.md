# CSS Module Scripts

## Overview

CSS Module Scripts enable importing stylesheets directly into JavaScript as module objects, allowing for dynamic, scoped CSS management without polluting the global namespace. This feature bridges the gap between JavaScript modules and CSS, providing a more integrated approach to styling in modern web applications.

**Description:** Import stylesheets in JavaScript

**Specification Status:** Living Standard (LS)
**Specification Link:** [WHATWG HTML Specification - Creating a CSS Module Script](https://html.spec.whatwg.org/multipage/webappapis.html#creating-a-css-module-script)

---

## Categories

- **JS API** - JavaScript API for module-based CSS handling

---

## Benefits and Use Cases

### Primary Benefits

1. **Modular CSS Management**
   - Treat stylesheets as first-class JavaScript modules
   - Co-locate styles with component logic
   - Avoid global namespace pollution

2. **Dynamic Styling**
   - Load stylesheets conditionally based on application state
   - Enable runtime stylesheet selection and composition
   - Support for dynamic theme switching

3. **Component-Based Architecture**
   - Encapsulate styles with JavaScript components
   - Facilitate framework integration (Web Components, custom elements)
   - Simplify CSS scope management in large applications

4. **Type Safety and Tooling**
   - Enable static analysis of CSS imports
   - Support TypeScript type definitions for stylesheets
   - Improve IDE autocomplete and refactoring tools

5. **Better Code Organization**
   - Maintain semantic relationships between styles and logic
   - Reduce boilerplate for stylesheet injection
   - Enable tree-shaking of unused CSS modules

### Common Use Cases

- **Web Components:** Inject styles into shadow DOM alongside component definitions
- **Design Systems:** Modularize design tokens and component styles
- **Framework Integration:** Use with React, Vue, Angular for scoped styling
- **Micro Frontends:** Manage styles independently in distributed applications
- **Dynamic Theme Systems:** Switch between theme modules at runtime
- **CSS-in-JS Alternatives:** Cleaner approach than runtime style injection

---

## Syntax and Usage

### Basic Import Syntax

```javascript
// Using import attributes syntax (standard)
import styles from './styles.css' with { type: 'css' };

// Apply to constructed stylesheets (e.g., in Shadow DOM)
shadowRoot.adoptedStyleSheets = [styles];
```

### Web Components Example

```javascript
import buttonStyles from './button.css' with { type: 'css' };

class MyButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.adoptedStyleSheets = [buttonStyles];
    this.shadowRoot.innerHTML = '<button><slot></slot></button>';
  }
}

customElements.define('my-button', MyButton);
```

### Dynamic Theme Switching

```javascript
import lightTheme from './themes/light.css' with { type: 'css' };
import darkTheme from './themes/dark.css' with { type: 'css' };

function setTheme(isDark) {
  document.adoptedStyleSheets = isDark ? [darkTheme] : [lightTheme];
}
```

---

## Browser Support

### Support Status Legend

- **✅ Full Support** - Feature fully supported
- **⚠️ Partial Support** - Feature supported with notes (see below)
- **❌ Not Supported** - Feature not supported
- **ℹ️ Unknown** - Implementation status uncertain (marked as "u")

### Desktop Browsers

| Browser | First Full Support | Status | Notes |
|---------|-------------------|--------|-------|
| **Chrome** | 123 | ✅ Full Support | Partial support from v93-122 |
| **Edge** | 123 | ✅ Full Support | Partial support from v93-122 |
| **Firefox** | Not yet supported | ❌ No Support | No implementation timeline announced |
| **Safari** | Not yet supported | ❌ No Support | Not on public roadmap |
| **Opera** | (Chromium-based) | ℹ️ Unknown | Status marked as "u" (unknown) |
| **Internet Explorer** | N/A | ❌ Not Supported | End-of-life browser |

### Mobile Browsers

| Browser | Status | Notes |
|---------|--------|-------|
| **Chrome Android** | ❌ No Support | Marked as "d #1" (differs with notes) |
| **Firefox Android** | ❌ No Support | Version 144 not supported |
| **Safari iOS** | ❌ No Support | No version supports this feature |
| **Opera Mini** | ❌ No Support | Not supported on any version |
| **Android Browser** | ❌ No Support | Not supported on any version |
| **Samsung Internet** | ❌ No Support | No version supports this feature |
| **UC Browser** | ❌ No Support | Not supported |
| **QQ Browser** | ❌ No Support | Not supported |
| **Baidu Browser** | ❌ No Support | Not supported |
| **KaiOS Browser** | ❌ No Support | Not supported |

### Version Timeline

#### Desktop Support Timeline

```
Chrome:  |---n---|=====a(#1)===|===y===
         0                      123    146+
         (No support)    (Partial)    (Full)

Edge:    |---n---|=====a(#1)===|===y===
         0                      123    143+
         (No support)    (Partial)    (Full)

Firefox: |---n---|
         0        148+
         (No support - not implemented)

Safari:  |---n---|
         0       26.2+
         (No support - not implemented)
```

#### Current Support Metrics (as of last data update)

- **Full Support (y):** 28.58% of users
- **Partial Support (a):** 5.1% of users
- **No Support (n):** Remaining percentage

---

## Important Notes

### Note #1: Import Assertions vs. Import Attributes

**Issue:** Partial support in Chrome 93-122 and Edge 93-122 uses the deprecated `import assertions` syntax (`assert`) rather than the standardized `import attributes` syntax (`with`).

**Deprecated Syntax:**
```javascript
// Old import assertions (deprecated, may not work in newer versions)
import styles from './styles.css' assert { type: 'css' };
```

**Current Standard Syntax:**
```javascript
// New import attributes (recommended, works in v123+)
import styles from './styles.css' with { type: 'css' };
```

**Migration Path:**
- Update any code using `assert` to use `with` when targeting modern browsers
- Consider using bundler configuration to handle syntax transpilation for older support
- Check your tooling (webpack, esbuild, vite) for compatibility with new syntax

### Additional Notes

- No critical bugs have been documented in the specification
- Feature is still relatively new; implementations are evolving
- Primarily useful in modern development workflows with module-based architectures
- Works best with Web Components and shadow DOM

---

## Polyfills and Workarounds

### For Unsupported Browsers

Until browser support improves, consider these alternatives:

1. **CSS-in-JS Libraries**
   - styled-components
   - Emotion
   - CSS Modules (with bundler support)

2. **Shadow DOM with Dynamic Injection**
   ```javascript
   // Pre-requisite for browsers without CSS Module Scripts
   function applyCSSToShadowDOM(cssText, shadowRoot) {
     const style = document.createElement('style');
     style.textContent = cssText;
     shadowRoot.appendChild(style);
   }
   ```

3. **Bundler-Based CSS Modules**
   - Use webpack CSS Modules
   - Vite CSS Modules support
   - CSS Modules with TypeScript

4. **PostCSS and Build Tools**
   - Transform CSS imports into JavaScript objects
   - Scoped CSS with CSS-in-JS solutions

---

## Framework-Specific Integration

### Web Components (Native)
```javascript
// Natively supported for Web Components
import styles from './component.css' with { type: 'css' };

class MyComponent extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.adoptedStyleSheets = [styles];
  }
}
```

### React (with Bundler Support)
```javascript
// Requires bundler configuration
import styles from './Component.module.css';

function MyComponent() {
  return <div className={styles.container}>Content</div>;
}
```

### Vue
```javascript
// Use scoped styles or CSS Modules
<style scoped>
  /* Scoped to this component */
</style>
```

### Custom Elements Registry
Works directly with all custom elements registered via `customElements.define()`

---

## Known Limitations

1. **Browser Coverage:** Limited to Chrome/Edge 123+; no Firefox or Safari support
2. **Mobile Support:** Not yet available on mobile browsers
3. **Syntax Compatibility:** Migration required from deprecated `assert` to `with` syntax
4. **Framework Support:** Most frameworks have their own CSS Module systems that may be preferred
5. **Bundler Dependency:** Many build tools may not yet fully support the syntax

---

## Related Links and Resources

- **Official Specification:** [WHATWG HTML - CSS Module Script](https://html.spec.whatwg.org/multipage/webappapis.html#creating-a-css-module-script)
- **Usage Guide:** [Blog post on Constructable Stylesheets](https://fullystacked.net/constructable/)
- **MDN Web Docs:** [CSS Module Scripts on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#importing_styles)
- **Chrome Platform Status:** [CSS Module Scripts in Chrome](https://chromestatus.com/feature/5948572598009856)
- **Constructable StyleSheets API:** [WICG Constructable StyleSheets](https://wicg.github.io/construct-stylesheets/)
- **Import Assertions/Attributes:** [TC39 Import Assertions Proposal](https://github.com/tc39/proposal-import-attributes)

---

## Testing CSS Module Scripts Support

```javascript
// Feature detection
function supportsCSSModuleScripts() {
  return import.meta.supports?.('css-module-scripts') || false;
}

// Graceful degradation
async function loadStylesWithFallback() {
  try {
    // Modern approach
    const styles = await import('./styles.css', {
      with: { type: 'css' }
    });
    return styles.default;
  } catch (e) {
    // Fallback: load CSS traditionally
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './styles.css';
    document.head.appendChild(link);
  }
}
```

---

## Summary

**CSS Module Scripts** represent an important step toward more modular and maintainable CSS management in JavaScript applications. While currently limited to Chromium-based browsers, adoption is expected to expand as other browser vendors implement the feature. For maximum compatibility, consider using established CSS Module systems from bundlers or CSS-in-JS libraries until broader browser support is available.

**Current Recommendation:** Use CSS Module Scripts for modern Chromium-based applications targeting users with Chrome 123+; for broader compatibility, continue using traditional CSS Modules or CSS-in-JS solutions.
