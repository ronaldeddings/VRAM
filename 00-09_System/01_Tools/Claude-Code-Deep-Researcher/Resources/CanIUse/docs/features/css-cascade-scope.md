# CSS Cascade Scope (@scope rule)

## Overview

The `@scope` rule is a CSS feature that allows CSS rules to be scoped to part of the document, with upper and lower limits described by selectors. This provides a powerful mechanism for limiting the reach of CSS declarations to specific portions of the DOM, reducing style conflicts and improving code maintainability.

**Status**: ![Working Draft](https://img.shields.io/badge/status-Working%20Draft-yellow)

## Specification

- **Specification**: [CSS Cascade Level 6 - Scoped Styles](https://drafts.csswg.org/css-cascade-6/#scoped-styles)
- **Status**: Working Draft (WD)
- **Current Usage**: 83.32% of users have full support

## Categories

- CSS

## About Scoped Styles

### What is @scope?

The `@scope` rule enables you to define a scope boundary for CSS rules using selectors. Styles declared within a `@scope` block will only apply to elements that match the selectors within that scope, helping to:

1. **Prevent Style Leakage**: Keep styles contained within their intended context
2. **Reduce Naming Collisions**: Avoid CSS class name conflicts across large codebases
3. **Improve Maintainability**: Make relationships between styles and elements explicit
4. **Enable Component Isolation**: Style individual components without affecting others

### Basic Syntax

```css
@scope (.component) {
  /* Styles here only apply to .component and its children */
  p { color: blue; }
}
```

### Scope Boundaries

You can define both upper and lower scope limits:

```css
/* Lower bound only - styles apply to .parent and descendants */
@scope (.parent) {
  h1 { font-size: 2em; }
}

/* Upper and lower bounds - styles apply only within the scope */
@scope (.container) to (.widget) {
  /* Styles here don't cross .widget boundary */
  button { background: blue; }
}
```

## Benefits and Use Cases

### Component Styling
- Style individual components without class name namespacing
- Prevent accidental style inheritance to child components
- Simplify CSS architecture in component-based frameworks

### Design System Development
- Isolate design system component styles
- Prevent theme styles from affecting unintended elements
- Create component variants with scoped overrides

### Legacy Code Modernization
- Gradually refactor large stylesheets into scoped rules
- Reduce specificity wars when integrating new and old code
- Enable safe parallel development of feature areas

### Plugin and Third-Party Code
- Style third-party widgets without affecting page styles
- Prevent third-party code from affecting host page styles
- Enable style encapsulation for dynamic content

### Shadow DOM Alternative
- Simpler alternative to Shadow DOM for light DOM styling
- More performant than Shadow DOM for some use cases
- Better interop with CSS frameworks and tooling

## Browser Support

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | 118+ | Full Support | ✅ |
| Edge | 118+ | Full Support | ✅ |
| Firefox | 146+ | Full Support | ✅ |
| Safari | 17.4+ | Full Support | ✅ |
| Opera | 106+ | Full Support | ✅ |
| iOS Safari | 17.4+ | Full Support | ✅ |
| Android Chrome | 142+ | Full Support | ✅ |
| Samsung Internet | 25+ | Full Support | ✅ |
| Opera Mobile | 80+ | Full Support | ✅ |

### Experimental/In Development

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | 104-117 | Experimental | Behind `chrome://flags` - "Experimental Web Platform features" |
| Edge | 104-117 | Experimental | Behind experimental flag |
| Opera | 90-105 | In Development | Under development |

### No Support

| Browser | Status |
|---------|--------|
| Internet Explorer | Never supported |
| Firefox (< 146) | Not supported |
| Android Firefox | Not supported |
| UC Browser | Not supported |
| QQ Browser | Not supported |
| Baidu Browser | Not supported |
| KaiOS | Not supported |
| Opera Mini | Not supported |
| BlackBerry | Not supported |

## Usage Statistics

- **Full Support**: 83.32%
- **Partial/No Support**: 16.68%

This high support rate makes `@scope` viable for most modern web applications, with consideration needed primarily for older browser compatibility requirements.

## Implementation Notes

### Related Standards

This implementation **replaces an older concept** of [scoping CSS rules](https://caniuse.com/style-scoped), which used the `scoped` attribute on `<style>` elements. The `@scope` rule is the modern, standardized approach.

### Key Differences from Previous Approach

- Uses CSS at-rule syntax (`@scope`) instead of HTML attribute (`scoped`)
- Provides explicit scope boundary definitions
- More powerful selector-based boundary control
- Better integration with modern CSS cascade and specificity rules

### Enabling in Unsupported Browsers

For browsers in the experimental phase (Chrome/Edge 104-117, Opera 90-105), you can enable the feature through browser flags:

- **Chrome/Edge**: Visit `chrome://flags` and enable "Experimental Web Platform features"
- **Opera**: Visit `opera://flags` and enable experimental features

## Examples

### Basic Component Scoping

```css
@scope (.card) {
  h2 { font-size: 1.5rem; }
  p { margin: 1rem 0; }
  button { padding: 0.5rem 1rem; }
}

/* Styles only apply within .card, no conflicts with other components */
```

### Preventing Deep Style Inheritance

```css
@scope (.modal) to (.modal__close) {
  /* Styles here don't apply to or beyond .modal__close */
  button { background: blue; }
}
```

### Multiple Scoped Regions

```css
@scope (.header) {
  nav { display: flex; }
  a { color: white; }
}

@scope (.footer) {
  nav { display: block; }
  a { color: gray; }
}

/* Same elements styled differently in different scopes */
```

## Related Resources

- [Explainer: CSS Scoped Styles](https://css.oddbird.net/scope/explainer/) - Comprehensive explanation and rationale
- [Firefox Support Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1830512) - Track Firefox implementation progress
- [WebKit Position: Support](https://github.com/WebKit/standards-positions/issues/13) - Safari/WebKit implementation tracking
- [An Introduction to @scope in CSS](https://fullystacked.net/posts/scope-in-css/) - Practical guide and use cases

## Known Issues and Bugs

No known bugs reported in major browser implementations.

## See Also

- [CSS Cascade and Inheritance](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Cascade)
- [CSS Cascade Level 6 Specification](https://drafts.csswg.org/css-cascade-6/)
- [Shadow DOM (Alternative approach)](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
- [BEM Methodology (Alternative naming strategy)](http://getbem.com/)

---

**Last Updated**: 2024
**Data Source**: [Can I use @scope rule](https://caniuse.com/css-cascade-scope)
