# Media Queries: scripting Media Feature

## Overview

The `scripting` media feature allows developers to apply CSS styles based on whether the current document supports scripting languages (such as JavaScript). This media query feature enables conditional styling that adapts to the presence or absence of scripting capabilities in the user's browser.

## Description

The `scripting` media feature is part of the Media Queries Level 5 specification and allows authors to write CSS rules that apply only when scripting is supported or enabled. This feature is particularly useful for creating progressive enhancement strategies and ensuring that websites remain functional and accessible in environments where JavaScript may be disabled or unavailable.

## Specification

- **Status**: Working Draft (WD)
- **Specification Link**: [CSS Media Queries Level 5 - scripting](https://w3c.github.io/csswg-drafts/mediaqueries-5/#scripting)
- **Specification Organization**: W3C CSS Working Group

## Categories

- CSS
- CSS Media Queries
- Responsive Design

## Benefits and Use Cases

### Progressive Enhancement
Provide enhanced experiences for users with JavaScript enabled while maintaining core functionality for those without it. Apply sophisticated interactive styles only when the browser can execute the necessary JavaScript.

### Accessibility
Ensure that critical content and navigation remain accessible to users who have JavaScript disabled due to security policies, corporate restrictions, or accessibility tools.

### Performance Optimization
Load and apply complex CSS animations and transitions only when JavaScript is available to coordinate with dynamic behaviors, reducing unnecessary rendering overhead for script-disabled environments.

### Fallback Styling
Automatically apply alternative styles optimized for static content when JavaScript isn't available, such as simplified layouts or different navigation patterns.

### Graceful Degradation
Create distinct user experiences tailored to each scenario:
- **With scripting enabled**: Rich interactive features, complex animations, dynamic content loading
- **Without scripting**: Simplified layouts, static navigation, basic functionality

### Testing and Debugging
Assist developers in testing CSS behavior in different scripting contexts without manually disabling JavaScript in browser settings.

## Browser Support

This feature has **no browser support** across any major browser as of the latest data. The feature remains unimplemented in all major rendering engines.

### Support by Browser

| Browser | First Full Support | Latest Status |
|---------|-------------------|---|
| Chrome | Not Supported | ❌ |
| Edge | Not Supported | ❌ |
| Firefox | Not Supported | ❌ |
| Safari | Not Supported | ❌ |
| Opera | Not Supported | ❌ |
| iOS Safari | Not Supported | ❌ |
| Android Browser | Not Supported | ❌ |
| Samsung Internet | Not Supported | ❌ |

### Global Support Coverage
- **Usage Percentage (Full Support)**: 0%
- **Usage Percentage (Partial Support)**: 0%

## Syntax and Usage

### Basic Syntax

```css
/* Apply styles only when scripting is supported */
@media (scripting: enabled) {
  .js-only {
    /* Styles for JavaScript-enabled environments */
  }
}

/* Apply styles when scripting is not supported */
@media (scripting: none) {
  .no-js {
    /* Styles for script-disabled environments */
  }
}

/* Alternative syntax for initial-only (scripts run on page load only) */
@media (scripting: initial-only) {
  /* For environments where scripts run during initial page load */
}
```

### Practical Examples

#### Progressive Enhancement Pattern
```css
/* Base styles for all users */
.toggle-menu {
  display: none;
}

.menu {
  display: block;
}

/* Enhanced styles when JavaScript is available */
@media (scripting: enabled) {
  .toggle-menu {
    display: inline-block;
    cursor: pointer;
  }

  .menu.collapsed {
    display: none;
  }
}
```

#### Fallback Navigation
```css
/* Default: enhanced interactive navigation */
@media (scripting: enabled) {
  nav {
    position: fixed;
    transition: transform 0.3s ease;
  }
}

/* Fallback: simple static navigation */
@media (scripting: none) {
  nav {
    position: static;
    width: 100%;
  }
}
```

#### Conditional Animation
```css
/* Only apply animations when scripting is available */
@media (scripting: enabled) {
  .animated-card {
    animation: slideIn 0.5s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
}
```

## Known Issues and Bugs

### Chrome
- **Tracking Bug**: [Chrome Issue #489957](https://code.google.com/p/chromium/issues/detail?id=489957)
- Feature is tracked but not yet implemented

### Firefox
- **Tracking Bug**: [Firefox Bug #1166581](https://bugzilla.mozilla.org/show_bug.cgi?id=1166581)
- Feature is tracked but not yet implemented

### Implementation Status
Both major browser vendors have acknowledged the feature request, but implementation remains pending. Consider this feature as currently unavailable for production use.

## Workarounds and Alternatives

Since browser support is currently unavailable, developers should consider these alternatives:

### 1. HTML-Based Detection
Use server-side or client-side detection to add classes to the document element:

```html
<html class="js">
  <!-- Content -->
</html>

<script>
  // This script won't execute without JavaScript
  // If it does, the "js" class remains; if not, CSS can target "no-js"
</script>
```

```css
html.js .interactive-feature {
  display: block;
}

html:not(.js) .interactive-feature {
  display: none;
}
```

### 2. Noscript Tag
For simple cases, use the `<noscript>` tag with separate stylesheets:

```html
<style>
  .js-enhanced {
    display: block;
  }
</style>

<noscript>
  <style>
    .js-enhanced {
      display: none;
    }
  </style>
</noscript>
```

### 3. Feature Detection
Use feature detection libraries to conditionally apply CSS:

```javascript
if (typeof Modernizr !== 'undefined' && Modernizr.javascript) {
  document.documentElement.classList.add('has-js');
}
```

## Related Resources

### Specification and Proposals
- [Potential use cases for script, hover and pointer CSS Level 4 Media Features](https://jordanm.co.uk/2013/11/11/potential-use-cases-for-script-hover-and-pointer.html)
- [Original proposal blog post](https://www.nczonline.net/blog/2012/01/04/proposal-scripting-detection-using-css-media-queries/)

### Testing Resources
- [JS Bin testcase](https://jsbin.com/comefi/1)
- [Basic testcase at quirksmode.org](https://www.quirksmode.org/css/mediaqueries/features.html#basicscripting)

### Related Media Query Features
- [CSS Media Queries Level 5 Specification](https://w3c.github.io/csswg-drafts/mediaqueries-5/)
- [hover media feature](https://caniuse.com/css-media-hover)
- [pointer media feature](https://caniuse.com/css-media-pointer)
- [prefers-reduced-motion](https://caniuse.com/prefers-reduced-motion)
- [prefers-color-scheme](https://caniuse.com/prefers-color-scheme)

## See Also

- [Parent Feature: CSS Media Queries](https://caniuse.com/css-mediaqueries)
- [CSS Media Queries Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)
- [Progressive Enhancement Techniques](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_enhancement)
- [Feature Detection](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing/Feature_detection)

## Notes

- This feature is currently in the "Working Draft" phase of the W3C standardization process, meaning it may undergo changes before final specification
- No known implementation notes or restrictions specific to this feature
- Users requiring JavaScript-aware styling should implement workarounds using the alternatives listed above

## Summary

The `scripting` CSS media feature represents a useful addition to the responsive design toolkit for enabling progressive enhancement patterns. However, with zero browser support as of the latest data, developers must rely on alternative detection methods. The feature has been proposed and discussed in the CSS working group since 2012, with both Chrome and Firefox tracking implementation requests, but adoption remains pending.

For now, use HTML-based class detection or JavaScript-based approaches to conditionally style content based on scripting availability.
