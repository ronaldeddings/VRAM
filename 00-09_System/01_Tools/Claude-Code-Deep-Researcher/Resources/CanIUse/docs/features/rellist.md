# relList (DOMTokenList)

## Overview

The `relList` property provides a programmatic interface for manipulating the `rel` attribute on HTML elements using the `DOMTokenList` object. This API is similar to the familiar `classList` interface and offers methods for adding, removing, toggling, and checking for relationship tokens without string manipulation.

## Description

The `relList` property exposes a `DOMTokenList` interface that allows developers to work with the `rel` attribute values in a more convenient and error-resistant way. Instead of manually parsing and concatenating strings, developers can use intuitive methods like `add()`, `remove()`, `toggle()`, and `contains()` to manage relationship tokens.

### Key Benefits

- **Cleaner API**: No need for string concatenation or splitting
- **Error Prevention**: Built-in validation and deduplication
- **Consistency**: Same interface as `classList` for familiarity
- **Type Safety**: Direct method calls instead of string manipulation

## Specification Status

**Status**: Living Standard (ls)
**Specification**: [WHATWG HTML Standard - DOM relList](https://html.spec.whatwg.org/multipage/semantics.html#dom-a-rellist)

## Categories

- DOM
- HTML5

## Use Cases & Benefits

### Common Use Cases

1. **Dynamic Link Relationship Management**
   - Programmatically adding or removing relationships like `nofollow`, `noopener`, `noreferrer`
   - Managing SEO-related link attributes dynamically

2. **Security & Privacy**
   - Adding `noopener` and `noreferrer` to dynamically created links
   - Controlling link behavior without string manipulation

3. **Preloading & Performance**
   - Managing `preload`, `prefetch`, and `preconnect` relationships
   - Dynamic resource optimization

4. **Semantic HTML**
   - Managing document relationships like `next`, `previous`, `canonical`
   - Alternative content relationships

### Benefits

- **Improved Developer Experience**: Cleaner, more readable code
- **Reduced Bugs**: Less error-prone than string-based manipulation
- **Better Performance**: Optimized token list handling
- **Accessibility**: Better control over semantic relationships
- **Consistency**: Same API as `classList` reduces learning curve

## Browser Support

### Desktop Browsers

| Browser | First Support | Current | Notes |
|---------|---------------|---------|-------|
| Chrome | 65 | 146+ | Full support from v65 onwards |
| Firefox | 30 | 148+ | Full support from v30 onwards |
| Safari | 9 | 18.2+ | Full support from v9 onwards |
| Opera | 52 | 122+ | Full support from v52 onwards; partial support from v37 |
| Edge | 18 | 143+ | Full support from v18 onwards; partial support from v17 |

### Mobile & Tablet Browsers

| Browser | First Support | Current | Notes |
|---------|---------------|---------|-------|
| iOS Safari | 9.0 | 18.5+ | Full support from v9.0 onwards |
| Android Chrome | 142+ | 142+ | Full support |
| Android Firefox | 144+ | 144+ | Full support |
| Samsung Internet | 9.2 | 29+ | Full support from v9.2 onwards; partial support from v5.0 |
| Opera Mobile | 80+ | 80+ | Full support |
| UC Browser | 15.5+ | 15.5+ | Full support |
| Baidu Browser | 13.52+ | 13.52+ | Full support |
| KaiOS | 2.5+ | 3.0+ | Full support |

### Legacy Browser Support

| Browser | Support |
|---------|---------|
| Internet Explorer 11 | ❌ Not supported |
| Internet Explorer 10 | ❌ Not supported |
| Opera Mini | ❌ Not supported |
| BlackBerry | ❌ Not supported |

## Support Summary

- **Global Support**: 93.05% (y) + 0.08% (a) = 93.13%
- **Modern Browsers**: Excellent support across all major modern browsers
- **Legacy Browsers**: No support in IE or older versions

## Important Notes

### Partial Support Indicator (#1)

Some browsers show "partial support" (`a #1`). This note indicates:

**Note #1**: Support for `relList` on `<link>` elements but not on `<a>` (anchor) elements in certain browser versions.

This is important to remember when targeting older versions of:
- Chrome 50-64
- Opera 37-51
- Edge 17
- Samsung Internet 5.0-8.2

For modern applications, this limitation is no longer relevant as all current browser versions support `relList` on both link and anchor elements.

## Implementation Considerations

### Basic Usage

```javascript
// Add a relationship
element.relList.add('noopener');

// Remove a relationship
element.relList.remove('noreferrer');

// Toggle a relationship
element.relList.toggle('nofollow');

// Check if a relationship exists
if (element.relList.contains('external')) {
  // Handle external link
}

// Access as a token list
element.relList.forEach(token => {
  console.log(token);
});
```

### Backward Compatibility

For applications supporting older browsers, a polyfill is available:

- [domtokenlist polyfill](https://github.com/jwilsson/domtokenlist)

### Best Practices

1. **Always check support**: Use feature detection for older browser support
2. **Use consistently**: Apply the same approach across your codebase
3. **Leverage polyfills**: For IE11 support, use the available polyfill
4. **Document requirements**: Be clear about minimum browser versions

## References & Resources

### Official Documentation

- [MDN Web Docs - DOMTokenList](https://developer.mozilla.org/en-US/docs/DOM/DOMTokenList)
- [WHATWG HTML Standard - relList](https://html.spec.whatwg.org/multipage/semantics.html#dom-a-rellist)

### Polyfill

- [domtokenlist polyfill on GitHub](https://github.com/jwilsson/domtokenlist)

### Related Features

- [classList API](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList) - Similar interface for class names
- [DOMTokenList Interface](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList) - Complete API reference

## Browser Adoption Timeline

- **Early Support** (2012-2014): Firefox 30+ leads adoption
- **Widespread Adoption** (2014-2016): Safari 9+, Chrome 65+ follow
- **Mobile Adoption** (2015+): iOS Safari, Android browsers catch up
- **Modern Era** (2017+): Virtual universal support across modern browsers
- **Current** (2025): 93%+ global support with modern browser requirements

---

**Data Source**: [Can I Use](https://caniuse.com/) - Browser compatibility data
**Last Updated**: 2024
**Global Usage**: 93.05% of users have full support
