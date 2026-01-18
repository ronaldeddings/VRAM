# CSS `:any-link` Selector

## Overview

The `:any-link` CSS pseudo-class matches all elements that match either `:link` or `:visited`. It provides a convenient way to style both unvisited and visited hyperlinks with a single selector, without needing to use multiple selectors or apply the same styles to both `:link` and `:visited` separately.

This is particularly useful when you want to apply consistent styling to all link states while respecting the browser's visited link history.

---

## Specification

| Property | Details |
|----------|---------|
| **Status** | Working Draft (WD) |
| **Specification** | [CSS Selectors Level 4](https://w3c.github.io/csswg-drafts/selectors-4/#the-any-link-pseudo) |
| **Category** | CSS |

---

## Syntax

```css
/* Matches all unvisited and visited links */
a:any-link {
  color: #0066cc;
  text-decoration: underline;
}

/* Can be combined with other selectors */
a:any-link:hover {
  color: #004499;
  text-decoration: none;
}

/* Works with any element with href attribute in scope */
:any-link {
  color: #0066cc;
}
```

---

## Use Cases & Benefits

### Primary Use Cases

1. **Unified Link Styling**: Apply consistent baseline styles to all links regardless of visit state
   ```css
   /* Instead of */
   a:link, a:visited { color: #0066cc; }

   /* Use */
   a:any-link { color: #0066cc; }
   ```

2. **Link Theming**: Create cohesive link color schemes across your application
   ```css
   .dark-theme a:any-link {
     color: #87ceeb;
   }

   .light-theme a:any-link {
     color: #0066cc;
   }
   ```

3. **Hover/Focus States**: Define consistent interactive states for all links
   ```css
   a:any-link:hover {
     text-decoration: underline;
     background-color: rgba(0, 102, 204, 0.1);
   }

   a:any-link:focus {
     outline: 2px solid #0066cc;
     outline-offset: 2px;
   }
   ```

4. **Accessibility Compliance**: Ensure all links have adequate contrast and visibility
   ```css
   a:any-link {
     color: #0066cc;
     text-decoration: underline;
     text-decoration-thickness: 0.15em;
  }
   ```

5. **Component-Based Design**: Target links within specific components
   ```css
   .navigation a:any-link {
     color: white;
     text-decoration: none;
   }

   .content a:any-link {
     color: #0066cc;
     text-decoration: underline;
   }
   ```

### Key Benefits

- **Cleaner Selectors**: Write less repetitive CSS code
- **Easier Maintenance**: Update link styles in one place
- **Better Semantics**: Explicitly group link-related styles
- **DRY Principle**: Don't Repeat Yourself - avoid duplicating `:link` and `:visited` rules
- **Consistency**: Ensure all navigational links follow the same styling patterns

---

## Browser Support

### First Full Support by Browser

| Browser | Version | Release Year |
|---------|---------|--------------|
| **Chrome** | 65 | 2018 |
| **Firefox** | 50 | 2015 |
| **Safari** | 9 | 2015 |
| **Edge** | 79 | 2020 |
| **Opera** | 52 | 2018 |
| **iOS Safari** | 9.0-9.2 | 2015 |
| **Android Chrome** | 4.4+ | 2013 |
| **Opera Mobile** | 80 | 2022 |

### Detailed Support Matrix

#### Desktop Browsers

| Browser | Full Support | Prefixed (-x) | Partial/Unsupported |
|---------|:---:|:---:|:---:|
| **Internet Explorer** 5.5-11 | ❌ | ❌ | ❌ (No support) |
| **Chrome** 4-14 | ❌ | ❌ | ❌ (Unknown) |
| **Chrome** 15-64 | ❌ | ✅ | (Prefixed) |
| **Chrome** 65+ | ✅ | ✅ | (Full support) |
| **Firefox** 2 | ❌ | ❌ | ❌ (Unknown) |
| **Firefox** 3-49 | ❌ | ✅ | (Prefixed) |
| **Firefox** 50+ | ✅ | ✅ | (Full support) |
| **Safari** 3.1-6 | ❌ | ❌ | ❌ (Unknown) |
| **Safari** 6.1-8 | ❌ | ✅ | (Prefixed) |
| **Safari** 9+ | ✅ | ✅ | (Full support) |
| **Edge** 12-78 | ❌ | ❌ | ❌ (No support) |
| **Edge** 79+ | ✅ | ✅ | (Full support) |
| **Opera** 9-14 | ❌ | ❌ | ❌ (No support) |
| **Opera** 15-51 | ❌ | ✅ | (Prefixed) |
| **Opera** 52+ | ✅ | ✅ | (Full support) |

#### Mobile Browsers

| Browser | Full Support | Prefixed (-x) | Notes |
|---------|:---:|:---:|:---|
| **iOS Safari** 6.0-6.1 | ❌ | ✅ | Prefixed support |
| **iOS Safari** 7.0-8.4 | ❌ | ✅ | Prefixed support |
| **iOS Safari** 9.0+ | ✅ | ✅ | Full support |
| **Android Browser** 4.4 | ❌ | ✅ | Prefixed support |
| **Android Browser** 4.4.3+ | ❌ | ✅ | Prefixed support |
| **Android Chrome** 142+ | ✅ | ✅ | Full support |
| **Android Firefox** 144+ | ✅ | ✅ | Full support |
| **Samsung Internet** 5.0+ | ✅ | ✅ | Full support from v9.2 |
| **Opera Mobile** 80+ | ✅ | ✅ | Full support |
| **UC Browser** 15.5+ | ✅ | ✅ | Full support |
| **Opera Mini** | ❌ | ❌ | No support |

### Current Browser Coverage

- **Global Usage with Full Support**: 93.27%
- **Partial/Prefixed Support**: 0%
- **No Support**: ~6.73%

---

## Fallback & Progressive Enhancement

### For Older Browsers

If you need to support older browsers (IE, early Chrome/Safari), use the fallback approach:

```css
/* Fallback for older browsers */
a:link,
a:visited {
  color: #0066cc;
  text-decoration: underline;
}

/* Modern browsers will use :any-link */
a:any-link {
  color: #0066cc;
  text-decoration: underline;
}
```

### Browser Prefix Handling

Most browsers that support `:any-link` with a prefix (Firefox 3-49, Chrome 15-64, Safari 6.1-8, Opera 15-51) are now outdated. However, if supporting older versions is necessary:

```css
/* Prefixed versions (rarely needed) */
a:-webkit-any-link {
  color: #0066cc;
}

a:-moz-any-link {
  color: #0066cc;
}

/* Standard version */
a:any-link {
  color: #0066cc;
}
```

---

## Examples

### Basic Link Styling

```css
/* Style all links with consistent color and decoration */
a:any-link {
  color: #0066cc;
  text-decoration: underline;
  text-underline-offset: 0.25em;
}
```

### Interactive States

```css
a:any-link {
  color: #0066cc;
  text-decoration: underline;
  transition: color 0.2s ease, background-color 0.2s ease;
}

a:any-link:hover {
  color: #004499;
  background-color: rgba(0, 102, 204, 0.1);
}

a:any-link:active {
  color: #003366;
}

a:any-link:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}
```

### Context-Based Styling

```css
/* Navigation links */
nav a:any-link {
  color: white;
  text-decoration: none;
}

/* Content links */
.content a:any-link {
  color: #0066cc;
  text-decoration: underline;
}

/* Footer links */
footer a:any-link {
  color: #666;
  font-size: 0.9em;
}
```

### Accessibility-Focused Approach

```css
/* Ensure sufficient contrast and visibility */
a:any-link {
  color: #0066cc;
  text-decoration: underline;
  text-decoration-thickness: 0.15em;
  text-underline-offset: 0.25em;
}

/* Enhanced focus state for keyboard navigation */
a:any-link:focus-visible {
  outline: 2px dashed #0066cc;
  outline-offset: 0.25em;
}

/* Visited state still visually distinct */
a:visited {
  color: #800080;
}
```

### Component Libraries

```css
/* Button links */
.btn-link:any-link {
  display: inline-block;
  padding: 0.5em 1em;
  border-radius: 4px;
  background-color: #0066cc;
  color: white;
  text-decoration: none;
}

.btn-link:any-link:hover {
  background-color: #004499;
}

/* List of links */
.link-list a:any-link {
  display: block;
  padding: 0.5em 0;
  border-bottom: 1px solid #eee;
  color: #0066cc;
}
```

---

## Known Issues & Compatibility Notes

### No Known Bugs

The `:any-link` pseudo-class has no reported known bugs or compatibility issues in modern browsers.

### Important Considerations

1. **Specificity**: The `:any-link` pseudo-class has the same specificity as `:link` and `:visited`
   ```css
   a:any-link { color: blue; }        /* Specificity: 0,1,1 */
   a#special { color: red; }          /* Specificity: 1,0,1 (wins) */
   ```

2. **Visited State Limitations**: Security restrictions still apply
   - You can only style `:visited` links with a subset of CSS properties
   - Color-related properties work, but layout properties do not
   ```css
   a:visited {
     color: #800080;              /* ✅ Works */
     text-decoration: line-through; /* ✅ Works */
     margin: 10px;                /* ❌ Blocked for security */
   }
   ```

3. **Browser History Access**: The pseudo-class respects the browser's visited link history
   - The actual visited state depends on browser settings and history

---

## Related Links

### Official Documentation
- [MDN Web Docs - CSS :any-link](https://developer.mozilla.org/en-US/docs/Web/CSS/:any-link)
- [W3C Specification - Selectors Level 4](https://w3c.github.io/csswg-drafts/selectors-4/#the-any-link-pseudo)

### Related CSS Features
- [:link](https://developer.mozilla.org/en-US/docs/Web/CSS/:link) - Pseudo-class for unvisited links
- [:visited](https://developer.mozilla.org/en-US/docs/Web/CSS/:visited) - Pseudo-class for visited links
- [:hover](https://developer.mozilla.org/en-US/docs/Web/CSS/:hover) - Pseudo-class for hover state
- [:focus](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus) - Pseudo-class for focus state
- [:focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible) - Keyboard focus visibility
- [text-decoration](https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration) - Text decoration properties
- [text-underline-offset](https://developer.mozilla.org/en-US/docs/Web/CSS/text-underline-offset) - Underline positioning

### Best Practices
- [WebAIM - Link Text and Appearance](https://webaim.org/articles/linktext/)
- [WCAG 2.1 - Link Purpose](https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html)
- [MDN - Links - Accessibility](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Links_and_navigation)

---

## Summary Table

| Aspect | Details |
|--------|---------|
| **Feature** | CSS `:any-link` pseudo-class selector |
| **Specification Status** | Working Draft (W3C) |
| **Primary Browsers** | Chrome 65+, Firefox 50+, Safari 9+, Edge 79+ |
| **Mobile Support** | iOS Safari 9+, Android Chrome 4.4+ |
| **Global Usage** | 93.27% with full support |
| **Key Benefit** | Unified styling for visited and unvisited links |
| **Use Case** | Simplify link styling in modern web applications |
| **Fallback** | Use `:link` and `:visited` separately for older browsers |

