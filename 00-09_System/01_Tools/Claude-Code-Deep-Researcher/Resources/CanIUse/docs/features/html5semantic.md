# HTML5 Semantic Elements

## Overview

HTML5 introduces a set of semantic elements designed to give content more meaningful structure and purpose. These elements allow developers to describe the meaning of content in an explicit way, improving accessibility, SEO, and code maintainability.

## Description

HTML5 offers several new semantic elements, primarily for semantic purposes. These elements include:

- `<section>` - Represents a generic section of a document or application
- `<article>` - Represents an independent, self-contained piece of content
- `<aside>` - Represents content tangentially related to the main content
- `<header>` - Represents introductory content or navigation aids
- `<footer>` - Represents footer content of a section or page
- `<nav>` - Represents navigation links
- `<figure>` - Represents illustrations, diagrams, photos, or code listings
- `<figcaption>` - Represents a caption or legend associated with a figure
- `<time>` - Represents a specific time or date
- `<mark>` - Highlights or marks text for reference or notation
- `<main>` - Represents the main content of a document

## Specification Status

**Status:** Living Standard (ls)

**Specification URL:** https://html.spec.whatwg.org/multipage/semantics.html#sections

The HTML5 semantic elements are part of the WHATWG Living Standard, which is continuously updated and refined based on web platform needs and browser implementation feedback.

## Categories

- HTML5

## Benefits and Use Cases

### Improved Accessibility
Semantic HTML elements provide assistive technologies with clearer document structure, enabling screen readers and other tools to better understand and communicate page content to users with disabilities.

### Search Engine Optimization (SEO)
Search engines use semantic elements to better understand page structure and content hierarchy, which can improve indexing and search visibility.

### Code Maintainability
Using semantic elements makes HTML code more readable and maintainable. Developers can quickly understand the purpose of different sections without relying solely on CSS classes.

### Document Outline
Semantic elements help create a logical document outline that reflects the content structure, making it easier for users to navigate through the page.

### Better Styling Hooks
Semantic elements provide clear, meaningful selectors for CSS styling and JavaScript manipulation.

### Future Compatibility
As browsers and tools evolve, semantic HTML ensures content remains interpretable and usable across different platforms and assistive technologies.

## Browser Support

| Browser | Status | First Support | Notes |
|---------|--------|---------------|-------|
| **Internet Explorer** | Partial | IE 9 | Full support available in IE 11 with workarounds |
| **Edge** | Full | 12.0 | Complete support across all versions |
| **Firefox** | Full | 21 | Partial support in versions 3-20; full support from 21+ |
| **Chrome** | Full | 26 | Partial support in versions 4-25; full support from 26+ |
| **Safari** | Full | 6.1 | Partial support in versions 3.1-6; full support from 6.1+ |
| **Opera** | Full | 15 | Partial support in versions 9-12.1; full support from 15+ |
| **iOS Safari** | Full | 7.0-7.1 | Partial support in versions 3.2-6.1; full support from 7.0+ |
| **Android Browser** | Full | 4.4 | Partial support in versions 2.1-4.3; full support from 4.4+ |
| **Samsung Internet** | Full | 4.0 | Full support across all versions |
| **Opera Mini** | Partial | All | Partial support |
| **Android Chrome** | Full | 142 | Full support |
| **Android Firefox** | Full | 144 | Full support |
| **UC Browser** | Full | 15.5 | Full support |
| **Baidu Browser** | Full | 13.52 | Full support |
| **KaiOS Browser** | Full | 2.5 | Full support |

### Support Legend

- **y** (Full support) - Complete implementation of the feature
- **a** (Partial support) - Limited or partial implementation
- **n** (No support) - Feature not supported

### Global Usage Statistics

- **Full Support:** 93.2% of global browser market
- **Partial Support:** 0.48% of global browser market

## Implementation Notes

### Workarounds for Legacy Browsers

For Internet Explorer versions prior to version 9, the semantic elements are treated as unknown elements. This can be remedied with the following approaches:

1. **CSS Workaround:** Manually set the default display values for semantic elements
   ```css
   section, article, aside, header, footer, nav,
   figure, figcaption, time, mark, main {
     display: block;
   }
   ```

2. **JavaScript Workaround:** Use scripts to enable styling in older IE versions
   - Reference: [Workaround for IE](https://blog.whatwg.org/supporting-new-elements-in-ie)
   - Alternate approach: [Styling IE without JavaScript](https://blog.whatwg.org/styling-ie-noscript)

### Known Issues

#### Element Type Recognition
While the `<time>` and `<data>` elements can be used and work correctly in all browsers, currently only Firefox and Edge 14+ officially recognize them as `HTMLTimeElement` and `HTMLDataElement` objects. In other browsers, they may be treated as generic elements, though they function correctly for semantic purposes.

#### Main Element Partial Support
In older browser versions, partial support refers to only the `<main>` element being treated as an "unknown" element, though it can still be used and styled like any other block-level element.

## Practical Usage Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>Semantic HTML5 Structure</title>
</head>
<body>
  <header>
    <h1>Website Title</h1>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </nav>
  </header>

  <main>
    <article>
      <h2>Article Title</h2>
      <time datetime="2024-01-15">January 15, 2024</time>
      <p>Article content goes here...</p>

      <figure>
        <img src="image.jpg" alt="Description">
        <figcaption>Figure caption describing the image</figcaption>
      </figure>

      <p>More content with <mark>highlighted text</mark>.</p>
    </article>

    <aside>
      <h3>Related Content</h3>
      <p>Sidebar content related to the main content...</p>
    </aside>
  </main>

  <footer>
    <p>&copy; 2024 My Website. All rights reserved.</p>
  </footer>
</body>
</html>
```

## Related Resources

- [has.js HTML5 Elements Detection Test](https://raw.github.com/phiggins42/has.js/master/detect/dom.js#dom-html5-elements)
- [Chrome Platform Status: `<time>` Element](https://www.chromestatus.com/feature/5633937149788160)
- [WHATWG HTML5 Specification - Sections](https://html.spec.whatwg.org/multipage/semantics.html#sections)
- [MDN Web Docs - HTML5 Semantic Elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)

## Additional Information

### Backward Compatibility

HTML5 semantic elements are fully backward compatible with HTML4 and earlier versions. Modern browsers will render them correctly, and older browsers can be made to work with minimal CSS adjustments. This means you can safely use semantic elements in new code without breaking older browsers.

### Best Practices

1. Use semantic elements to describe content meaning, not just for styling
2. Remember that semantic elements are still block-level and can be styled like divs
3. Don't nest certain elements incorrectly (e.g., don't put `<nav>` inside `<footer>` without reason)
4. Use `<article>` for content that could stand alone; use `<section>` for thematic grouping
5. The `<main>` element should only appear once per page
6. Always include proper heading hierarchy within semantic elements

### Feature Detection

To detect support for HTML5 semantic elements in JavaScript:

```javascript
function supportsSemanticHTML() {
  const article = document.createElement('article');
  return typeof article.style.display !== 'undefined';
}
```

More comprehensive detection available via [has.js library](https://raw.github.com/phiggins42/has.js/master/detect/dom.js#dom-html5-elements).

---

**Last Updated:** 2024
**Data Source:** CanIUse.com - HTML5 Semantic Elements
