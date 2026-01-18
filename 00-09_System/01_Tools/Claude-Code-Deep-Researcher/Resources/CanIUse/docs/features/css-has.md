# CSS :has() Relational Pseudo-Class

## Overview

The `:has()` CSS relational pseudo-class enables selecting elements based on their content and relationships with other elements. This powerful selector allows developers to write parent and sibling selectors, solving a long-standing limitation in CSS.

**Example**: `a:has(img)` selects all `<a>` elements that contain an `<img>` child element.

---

## Specification

**Status**: Working Draft (WD)
**Specification URL**: [W3C Selectors Level 4](https://w3c.github.io/csswg-drafts/selectors-4/#relational)

---

## Categories

- **CSS**

---

## Benefits and Use Cases

### Why :has() Matters

The `:has()` pseudo-class addresses a critical gap in CSS that has existed for decades, enabling developers to:

#### 1. **Parent Selectors**
Previously impossible, now you can style a parent based on its children:
```css
/* Style list items that contain checkboxes */
li:has(input[type="checkbox"]) {
  border-left: 4px solid green;
}

/* Style article if it has a featured image */
article:has(img.featured) {
  background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);
}
```

#### 2. **Sibling Selectors**
Select elements based on siblings that follow them:
```css
/* Style form labels followed by required fields */
label:has(+ input[required]) {
  font-weight: bold;
  color: #c00;
}

/* Style buttons preceded by error messages */
button:has(+ .error-message) {
  margin-top: 2rem;
}
```

#### 3. **Descendant-Based Styling**
Adapt component styling based on their content structure:
```css
/* Style card containers with video content differently */
.card:has(video) {
  padding: 0;
}

/* Style sections with code blocks */
section:has(code) {
  background-color: #f5f5f5;
}
```

#### 4. **Context-Aware Layouts**
Create responsive, context-aware designs:
```css
/* Stack horizontally only if heading is short */
.header:has(h1:not(:has(br))) {
  display: flex;
  gap: 1rem;
}
```

#### 5. **Advanced State Management**
Manage complex state with CSS selectors:
```css
/* Style container if it has an active tab */
.tabs:has(.tab-content.active) {
  border-color: blue;
}

/* Style form if all fields are valid */
form:has(input:valid) {
  --form-valid: true;
}
```

### Common Use Cases

- **Component Styling**: Adjust component appearance based on internal state or children
- **Form Management**: Conditional styling of form containers based on input states
- **Content Adaptation**: Tailor layout and styling to content type
- **Progressive Enhancement**: Apply styles based on feature presence
- **Accessibility**: Improve accessible designs by adapting to content availability

---

## Browser Support

### Desktop Browsers

| Browser | First Version | Release Date | Status |
|---------|---------------|------|--------|
| **Chrome** | 105 | Sep 2022 | ✅ Full Support |
| **Edge** | 105 | Sep 2022 | ✅ Full Support |
| **Safari** | 15.4 | Mar 2022 | ✅ Full Support |
| **Opera** | 91 | Aug 2022 | ✅ Full Support |
| **Firefox** | 121 | Dec 2023 | ✅ Full Support |

### Mobile Browsers

| Platform | Browser | First Version | Status |
|----------|---------|---------------|--------|
| **iOS** | Safari | 15.4 | ✅ Full Support |
| **Android** | Chrome | 105 | ✅ Full Support |
| **Android** | Firefox | 144 | ✅ Full Support |
| **Samsung** | Internet | 20.0 | ✅ Full Support |
| **Opera Mobile** | Opera | 80 | ✅ Full Support |
| **Opera Mini** | All versions | - | ❌ Not Supported |

### Legacy & Unsupported

| Browser | Support |
|---------|---------|
| **Internet Explorer** | ❌ Not Supported |
| **BlackBerry Browser** | ❌ Not Supported |
| **UC Browser** | ❌ Not Supported |
| **Baidu Browser** | ❌ Not Supported |
| **KaiOS Browser** | ❌ Not Supported |

### Current Global Support

- **Global Usage Coverage**: 91% of users
- **Partial Support**: 0% (with flags)

---

## Implementation Notes

### Experimental Flag Support

#### Chrome/Edge (Before Release)
Versions 101-104 support `:has()` behind an experimental flag:
- **Flag**: `chrome://flags/#enable-experimental-web-platform-features`
- **Status**: Experimental (not enabled by default)

#### Firefox (Before Full Release)
Versions 103-120 support `:has()` with flag:
- **Flag**: `layout.css.has-selector.enabled`
- **Status**: Nightly builds only (enabled by default in Nightly)
- **Full Support**: Firefox 121+ (stable)

---

## Known Limitations & Considerations

### Performance Implications

The `:has()` selector, especially with complex selectors, can impact CSS evaluation performance:

- **Simple selectors** (e.g., `:has(> img)`) have minimal performance impact
- **Complex selectors** (e.g., `:has(.deep .nested .selector)`) may cause layout thrashing
- **Aggressive use** with descendant combinators can be expensive

**Best Practice**: Use specific child combinators (`>`) when possible:
```css
/* Good - checks direct children only */
article:has(> .featured-image) { }

/* Less efficient - checks all descendants */
article:has(.featured-image) { }
```

### Browser Compatibility Strategy

For maximum compatibility, consider progressive enhancement:

```css
/* Fallback for older browsers */
.card {
  padding: 1rem;
  background: white;
}

/* Enhanced styling with :has() support */
@supports selector(:has(>*)) {
  .card:has(> img) {
    padding: 0;
    background: none;
  }
}
```

### Polyfill Status

No JavaScript polyfill can effectively replicate `:has()` behavior due to its reactive nature. Consider:
- Using feature detection with `@supports`
- Providing fallback CSS rules
- Leveraging progressive enhancement patterns

---

## Syntax Reference

### Basic Syntax

```css
element:has(selector) {
  /* styles */
}
```

### Common Patterns

```css
/* Child selector */
parent:has(> child) { }

/* Adjacent sibling */
element:has(+ sibling) { }

/* General sibling */
element:has(~ sibling) { }

/* Descendant */
ancestor:has(descendant) { }

/* Multiple conditions */
element:has(child):has(> other-child) { }

/* Complex selectors */
form:has(input[type="text"]:focus) { }
```

---

## Usage Examples

### Example 1: Conditional Card Layout

```css
/* Cards without images - normal layout */
.card {
  display: flex;
  flex-direction: column;
}

/* Cards with hero images - special treatment */
.card:has(img.hero) {
  overflow: hidden;
  border-radius: 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card:has(img.hero) img {
  height: 200px;
  object-fit: cover;
}
```

### Example 2: Form Validation Styling

```css
/* Style form group if input is invalid */
.form-group:has(input:invalid) {
  border-left: 3px solid #e74c3c;
  padding-left: 1rem;
}

/* Style submit button if form has invalid fields */
button[type="submit"]:has(~ input:invalid) {
  opacity: 0.6;
  cursor: not-allowed;
}
```

### Example 3: List Item Styling

```css
/* Highlight list items with active links */
li:has(a.active) {
  background-color: #f0f0f0;
  border-left: 3px solid #007bff;
}

/* Style lists with checkboxes differently */
li:has(input[type="checkbox"]) {
  padding: 0.5rem;
  border-radius: 4px;
}
```

### Example 4: Component Adaptation

```css
/* Adjust container based on content */
.media-container:has(video) {
  aspect-ratio: 16 / 9;
  background: #000;
}

.media-container:has(img) {
  aspect-ratio: auto;
  background: transparent;
}

/* Style wrapper if it has interactive children */
.button-group:has(button:hover) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
```

---

## Related Features

- [CSS Selectors Level 4](https://www.w3.org/TR/selectors-4/) - Complete selector specification
- [:is() pseudo-class](/features/css-matches) - Another powerful selector
- [:where() pseudo-class](/features/css-matches) - Zero specificity alternative to :is()
- [CSS Grid](/features/css-grid) - Layout system that benefits from :has()
- [CSS Flexbox](/features/css-flexbox) - Flexible layouts enhanced with :has()

---

## Related Links

- **[MDN Web Docs - :has()](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)** - Comprehensive documentation and examples
- **[WebKit Blog - Using :has() as a CSS Parent Selector](https://webkit.org/blog/13096/css-has-pseudo-class/)** - Deep dive into :has() capabilities
- **[Chrome Bug Tracker](https://bugs.chromium.org/p/chromium/issues/detail?id=669058)** - Implementation tracking
- **[Firefox Support Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=418039)** - Mozilla development status
- **[WebKit Bug Tracker](https://bugs.webkit.org/show_bug.cgi?id=227702)** - Safari implementation details

---

## Support Timeline

- **2022 (Mar)**: Safari 15.4 releases :has() support
- **2022 (Aug-Sep)**: Chrome, Edge, and Opera launch support
- **2023 (Dec)**: Firefox ships full support in version 121
- **2024+**: Universal support across all modern browsers

---

## Conclusion

The `:has()` pseudo-class represents a watershed moment in CSS evolution, finally enabling parent and context-aware selectors. With support reaching 91% of users, it's now a practical tool for modern web development. While older browsers require fallbacks, the progressive enhancement patterns make :has() accessible today with graceful degradation for unsupported environments.

For projects targeting modern browsers (2023+), :has() can significantly simplify CSS architecture and reduce JavaScript dependencies for styling logic.
