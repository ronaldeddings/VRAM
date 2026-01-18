# Declarative Shadow DOM

## Overview

**Declarative Shadow DOM** is a web platform feature that enables server-side rendering of Shadow DOM content through a declarative HTML syntax. Rather than requiring JavaScript to attach shadow roots to elements, developers can now define shadow DOM directly in HTML markup, improving performance, accessibility, and SEO for web components.

## Description

This proposal allows rendering elements with Shadow DOM (also known as web components) using server-side rendering. By using the `<template shadowrootmode>` element, developers can declare Shadow DOM directly in HTML, eliminating the need for JavaScript initialization to create shadow roots. This approach enables faster initial page loads and makes Shadow DOM content available before JavaScript execution.

## Specification Status

- **Status**: Living Standard (LS)
- **Specification URL**: [WHATWG HTML Standard - Template shadowrootmode attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-template-shadowrootmode)
- **Latest Version**: Part of the WHATWG HTML Living Standard

## Categories

- **DOM** - Document Object Model

## Key Benefits & Use Cases

### Benefits

1. **Server-Side Rendering Support**
   - Render web components directly on the server without client-side JavaScript
   - Generate fully functional components with encapsulated styles during SSR

2. **Improved Performance**
   - Eliminate JavaScript execution overhead for component initialization
   - Faster First Contentful Paint (FCP) and Time to Interactive (TTI)
   - Reduces JavaScript bundle size requirements

3. **Better SEO & Accessibility**
   - Search engines can index Shadow DOM content directly from HTML
   - Screen readers can access content without waiting for JavaScript
   - Improved initial page content visibility

4. **Progressive Enhancement**
   - Components work without JavaScript as fallbacks
   - Graceful degradation for users with JavaScript disabled
   - Enhanced security posture

5. **Component Hydration**
   - Seamless integration with JavaScript frameworks
   - Allows hydration of pre-rendered web components
   - Reduces hydration complexity and mismatch issues

### Use Cases

- Building SSR-compatible web components and custom elements
- Creating performant design systems with encapsulated styling
- Implementing micro-frontend architectures with server-rendered components
- Developing progressive web apps with offline-capable components
- Building accessible and SEO-friendly component libraries

## Browser Support

### Support Status Legend

- **y** - Fully supported
- **a** - Partial support with limitations (see notes)
- **n** - Not supported
- **d** - Disabled by default
- **u** - Unknown support

### Desktop Browsers

| Browser | First Support | Latest Stable | Status |
|---------|---------------|---------------|--------|
| **Chrome** | 111 | 146+ | Fully Supported |
| **Firefox** | 123 | 148+ | Fully Supported |
| **Safari** | 16.4 | 18.5+ | Fully Supported |
| **Edge** | 111 | 143+ | Fully Supported |
| **Opera** | 97 | 122+ | Fully Supported |
| **Internet Explorer** | - | 11 | Not Supported |

### Mobile Browsers

| Browser | First Support | Latest Tested | Status |
|---------|---------------|---------------|--------|
| **iOS Safari** | 16.4 | 18.5+ | Fully Supported |
| **Android Chrome** | - | 142+ | Fully Supported |
| **Android Firefox** | - | 144+ | Fully Supported |
| **Opera Mobile** | 80 | Current | Fully Supported |
| **Samsung Internet** | 22 | 29+ | Fully Supported |
| **UC Browser** | 15.5 | Current | Fully Supported |
| **Baidu Browser** | 13.52 | Current | Fully Supported |
| **Opera Mini** | - | All | Not Supported |
| **Android UC** | 15.5 | Current | Fully Supported |

### Legacy Browsers

| Browser | Support |
|---------|---------|
| **Internet Explorer** (5.5-11) | Not Supported |
| **BlackBerry** (7-10) | Not Supported |
| **KaiOS** (2.5-3.1) | Not Supported |

## Implementation Notes

### Current Status

- **Living Standard Status**: The feature is part of the WHATWG HTML Living Standard as a standardized approach for declaring shadow roots
- **Global Support**: Approximately **89.51%** of global browser usage supports the feature fully, with **1.71%** having partial support

### Browser Variations

Some browsers implement an older, non-standard attribute:

1. **Standard Implementation** (`shadowrootmode`)
   - Used by most modern browsers
   - Part of the official WHATWG specification
   - Recommended for new implementations

2. **Non-Standard Implementation** (`shadowroot`)
   - Older implementations use the `shadowroot` attribute
   - May still work in some browsers (marked with note #1)
   - **Note #1**: Some browsers use an older non-standard attribute called `shadowroot` instead of the standardized `shadowrootmode` attribute

### Adoption Timeline

- **Chrome/Edge**: Fully supported since version 111 (April 2023)
- **Firefox**: Fully supported since version 123 (November 2023)
- **Safari/iOS**: Fully supported since version 16.4 (March 2023)
- **Opera**: Fully supported since version 97 (August 2023)

### Partial Support Notes

Browsers marked with "a #1" (partial support) implement the feature but may use the older `shadowroot` attribute name instead of the standard `shadowrootmode`. Most modern versions have transitioned to full support.

## Syntax Example

```html
<!-- Basic declarative shadow DOM -->
<my-component>
  <template shadowrootmode="open">
    <style>
      :host {
        display: block;
        border: 1px solid #ccc;
      }
      p {
        color: blue;
      }
    </style>
    <p>Content inside shadow DOM</p>
  </template>
</my-component>
```

## Polyfill & Compatibility

For browsers without native support or during the transition period:

- **Ponyfill Available**: [@webcomponents/template-shadowroot](https://www.npmjs.com/package/@webcomponents/template-shadowroot)
- **Features**: Provides polyfill functionality for older browsers
- **Usage**: Lightweight alternative to full web components polyfills

## Related Resources

- **Web.dev Article**: [Declarative Shadow DOM](https://web.dev/declarative-shadow-dom/) - Comprehensive guide and explanation
- **Ponyfill Package**: [@webcomponents/template-shadowroot](https://www.npmjs.com/package/@webcomponents/template-shadowroot) - npm package for compatibility
- **Implementation Tracking**:
  - [WebKit Support Bug](https://bugs.webkit.org/show_bug.cgi?id=249513)
  - [Firefox Implementation Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1712140)

## Browser Implementation Status

### Fully Supported Browsers
Chrome 111+, Firefox 123+, Safari 16.4+, Edge 111+, Opera 97+, iOS Safari 16.4+, and all modern mobile browsers.

### In Development / Partial Support
Some older versions may have experimental support or use the non-standard `shadowroot` attribute.

### Not Supported
Internet Explorer 11 and earlier, Opera Mini, BlackBerry browsers, and legacy mobile browsers.

## Migration Guide

### From JavaScript-based Shadow DOM

**Before (JavaScript initialization)**:
```javascript
const element = document.querySelector('my-component');
const shadowRoot = element.attachShadow({ mode: 'open' });
shadowRoot.innerHTML = `<p>Content</p>`;
```

**After (Declarative approach)**:
```html
<my-component>
  <template shadowrootmode="open">
    <p>Content</p>
  </template>
</my-component>
```

## Recommendations

- **For New Projects**: Use declarative Shadow DOM as the primary method for web component creation
- **For Existing Code**: Consider migrating to declarative Shadow DOM for improved performance and SSR support
- **Fallback Strategy**: Use the @webcomponents/template-shadowroot ponyfill for broad browser compatibility during the transition period
- **Feature Detection**: Check for `HTMLTemplateElement.prototype.shadowRootMode` to detect native support

## Browser Market Share Impact

- **Full Support**: 89.51% of global users
- **Partial Support**: 1.71% of global users
- **No Support**: Approximately 8.78% of global users

This high adoption rate makes Declarative Shadow DOM viable for modern web applications targeting contemporary browsers.

---

*Last Updated: 2025-12-13*
*Data Source: CanIUse Database*
