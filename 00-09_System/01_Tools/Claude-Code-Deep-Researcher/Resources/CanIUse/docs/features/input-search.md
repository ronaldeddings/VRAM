# Search Input Type (`<input type="search">`)

## Overview

The search input type is an HTML5 form control designed to provide a specialized search field that looks and behaves like the underlying platform's native search widget. When not available, it gracefully falls back to standard text input behavior.

## Description

Search field form input type. Intended to look like the underlying platform's native search field widget (if there is one). Other than its appearance, it's the same as an `<input type="text">`.

This input type enables developers to semantically mark search functionality in forms while allowing browsers and assistive technologies to provide appropriate UI and interactions for users.

## Specification Status

**Status:** Living Standard (ls)

**Official Specification:** [WHATWG HTML Living Standard - Text and Search Input Types](https://html.spec.whatwg.org/multipage/forms.html#text-(type=text)-state-and-search-state-(type=search))

## Categories

- **HTML5** — Part of the HTML5 specification for form input types

## Use Cases and Benefits

### Benefits

- **Semantic Markup** — Clearly indicates a search field to both browsers and screen readers
- **Native UI Integration** — Renders with platform-specific search UI where available (especially useful on mobile devices)
- **User Familiarity** — Leverages users' expectations for native search controls
- **Accessibility** — Assistive technologies can provide appropriate feedback for search inputs
- **Keyboard Behavior** — On mobile devices, displays appropriate keyboard (search key instead of enter)

### Common Use Cases

1. **Website Search** — Global search functionality on web pages
2. **Product Catalogs** — Search within product listings and e-commerce sites
3. **Documentation** — Quick search across documentation or knowledge bases
4. **Content Search** — Searching through blog posts, articles, or other content
5. **User Interfaces** — Finding users, items, or entries in application dashboards

## HTML Usage

### Basic Example

```html
<form>
  <label for="search">Search:</label>
  <input type="search" id="search" name="q" placeholder="Enter search term...">
  <button type="submit">Search</button>
</form>
```

### With Additional Attributes

```html
<form action="/search" method="get">
  <label for="site-search">Search our site:</label>
  <input
    type="search"
    id="site-search"
    name="search"
    placeholder="Search..."
    value=""
    required
    autocomplete="search"
    aria-label="Search our site"
  >
  <button type="submit">Search</button>
</form>
```

## Browser Support

### Support Legend

- **✅ Yes (y)** — Full support with no known issues
- **⚠️ Partial (u)** — Partial support or limited functionality
- **❌ No (n)** — Not supported
- **#1** — See Notes section below

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|--------|-------|
| **Chrome** | 15 | ✅ Full (26+) | Note #1 applies to versions 15-25 |
| **Edge** | 12 | ✅ Full (79+) | Note #1 applies to versions 12-18 |
| **Firefox** | 4 | ✅ Full | Note #1 applies |
| **Safari** | 5.1 | ✅ Full | Partial in 3.1-5.0 |
| **Opera** | 11.6 | ✅ Full | No support in 10.6 and earlier |
| **Internet Explorer** | 10 | ⚠️ Partial | Note #1 applies to IE 10-11 |

### Mobile and Tablet Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|--------|-------|
| **iOS Safari** | 5.0-5.1 | ✅ Full | Partial in 3.2-5.0 |
| **Android Browser** | 2.3 | ✅ Full (4.4+) | Note #1 in 2.3-4.3 |
| **Chrome Android** | — | ✅ Full | Current versions |
| **Firefox Android** | — | ✅ Full (144+) | Note #1 applies |
| **Samsung Internet** | 4 | ✅ Full | All supported versions |
| **Opera Mini** | All | ✅ Full | Note #1 applies |
| **Opera Mobile** | 12 | ✅ Full | No support in 10-11.5 |
| **UC Browser** | 15.5 | ✅ Full | Android version |
| **BlackBerry** | 7 | ✅ Full | Both 7 and 10 |
| **KaiOS** | 2.5-3.1 | ✅ Full | Note #1 applies |

### Regional Browsers

| Browser | Support | Status |
|---------|---------|--------|
| **Baidu Browser** | 13.52+ | ✅ Full |
| **QQ Browser** (Android) | 14.9+ | ✅ Full |

### Support Summary

**Global Coverage:** ~93.64% of browser usage supports this feature

- Desktop: Nearly universal support
- Mobile: Nearly universal support
- Older browsers (IE 9 and earlier, Safari < 5.1, Opera < 11.6): No support

## Known Issues and Limitations

### iOS Safari Bug

On iOS Safari, the search input does not display the specialized "search" keyboard button unless the input is placed inside a form with the `action` attribute set.

**Workaround:**

```html
<!-- May not show search button -->
<input type="search" placeholder="Search...">

<!-- Will show search button on iOS -->
<form action="/search">
  <input type="search" placeholder="Search...">
</form>
```

### Generic UI Fallback (Note #1)

In browsers that support the search input type but do not implement special search-specific UI, the field renders identically to a standard `<input type="text">`. This affects:

- Internet Explorer 10-11
- Firefox (all versions)
- Chrome 15-25
- Edge 12-18
- And various mobile browsers

**Impact:** While functional, these browsers don't provide the enhanced user experience of native search UI.

## Best Practices

### 1. Always Include a Form and Action

```html
<form action="/search" method="get">
  <input type="search" name="q">
  <button type="submit">Search</button>
</form>
```

### 2. Use Proper Labeling

```html
<label for="search-input">Search:</label>
<input type="search" id="search-input" name="search">
```

### 3. Provide Placeholder Text

```html
<input
  type="search"
  placeholder="Search our catalog..."
  aria-label="Search for products"
>
```

### 4. Support Autocomplete

```html
<input
  type="search"
  autocomplete="search"
  name="q"
>
```

### 5. Mobile-First Considerations

Ensure search fields are easily tappable (minimum 44x44px) on mobile devices and that the native search keyboard appears correctly.

## Fallback Strategy

For maximum compatibility, ensure graceful degradation:

```html
<!-- Semantic approach with fallback behavior -->
<input type="search" name="q">

<!-- Browser that doesn't support type="search"
     will treat it as type="text" -->
```

Since `type="search"` gracefully falls back to `type="text"` in unsupported browsers, no additional fallback markup is needed.

## Related Resources

### External Articles

- [CSS-Tricks: WebKit HTML5 Search Inputs](https://css-tricks.com/webkit-html5-search-inputs/) — Detailed guide on styling and behavior of search inputs
- [Wufoo: The Current State of HTML5 Forms: The search Type](https://www.wufoo.com/html5/types/5-search.html) — Comprehensive coverage of search input type

### MDN Web Docs

- [MDN: `<input type="search">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/search)

### Specification

- [WHATWG HTML Standard - Search State](https://html.spec.whatwg.org/multipage/forms.html#text-(type=text)-state-and-search-state-(type=search))

## Styling Recommendations

### Basic CSS

```css
/* Clean search input styling */
input[type="search"] {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  font-family: inherit;
}

/* Remove webkit appearance for custom styling */
input[type="search"] {
  -webkit-appearance: none;
  appearance: none;
}

/* Focus state */
input[type="search"]:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
}
```

### Clearing Button (webkit browsers)

```css
/* Style the clear button in webkit browsers */
input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  width: 16px;
  height: 16px;
}
```

## Summary

The search input type is a well-established HTML5 feature with excellent browser support across both desktop and mobile platforms. With nearly 94% global browser coverage, it's safe to use in modern web applications. The feature gracefully degrades in unsupported browsers, making it a low-risk enhancement for form-based search functionality.

For the best user experience, ensure your search inputs are placed within properly configured forms and consider the iOS Safari limitation when designing mobile search interfaces.

---

**Last Updated:** December 2024
**Feature Status:** Living Standard
**Global Browser Support:** 93.64%
