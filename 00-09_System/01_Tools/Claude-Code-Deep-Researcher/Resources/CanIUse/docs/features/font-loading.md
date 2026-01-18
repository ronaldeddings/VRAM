# CSS Font Loading

## Description

The **CSS Font Loading** module defines a scripting interface to font faces in CSS, allowing font faces to be easily created and loaded from script. It also provides methods to track the loading status of an individual font, or of all the fonts on an entire page.

## Specification Details

- **Official Specification**: [W3C CSS Font Loading Module Level 3](https://www.w3.org/TR/css-font-loading-3/)
- **Specification Status**: Working Draft (WD)
- **Module Status**: CSS3 / JavaScript API
- **Keywords**: `fontface`, `fontfaceset`, `fontfacesource`, `document.fonts`

## Categories

- **CSS3** - CSS feature
- **JS API** - JavaScript API feature

## Benefits & Use Cases

### Key Benefits

1. **Dynamic Font Loading** - Programmatically load fonts from JavaScript at runtime
2. **Loading Status Tracking** - Monitor the loading progress of individual fonts or all fonts on a page
3. **Performance Optimization** - Better control over font loading and rendering to optimize web performance
4. **Font Events** - Utilize font load events to trigger actions when fonts become available
5. **Flexible Font Management** - Create and manage font faces dynamically without CSS `@font-face` declarations

### Common Use Cases

- **Conditional Font Loading** - Load different fonts based on user preferences, device capabilities, or locale
- **Progressive Enhancement** - Load fallback fonts first, then enhance with preferred fonts
- **Performance Monitoring** - Track font loading performance metrics
- **User Experience** - Prevent invisible text (FOIT/FOUT) by controlling when text renders
- **Web Font Optimization** - Defer loading non-critical fonts to improve page load times
- **Font Fallback Strategy** - Implement intelligent fallback logic based on loading status

## Browser Support

### Desktop Browsers

| Browser | Support Status | Version Range | Notes |
|---------|---|---|---|
| **Chrome** | ✅ Full Support | 35+ | Supported from Chrome 35 onwards |
| **Firefox** | ✅ Full Support | 41+ | Experimental flag in 35-40, enabled by default from 41 |
| **Safari** | ✅ Full Support | 10+ | Supported from Safari 10 onwards |
| **Edge** | ✅ Full Support | 79+ | Full support in Chromium-based Edge |
| **Opera** | ✅ Full Support | 22+ | Supported from Opera 22 onwards |
| **IE 5.5-11** | ❌ No Support | All versions | Not supported in Internet Explorer |

### Mobile & Tablet Browsers

| Browser | Support Status | Version Range | Notes |
|---------|---|---|---|
| **iOS Safari** | ✅ Full Support | 10.0+ | Supported from iOS Safari 10.0 onwards |
| **Android Chrome** | ✅ Full Support | 142+ | Latest Android Chrome versions |
| **Android Firefox** | ✅ Full Support | 144+ | Latest Android Firefox versions |
| **Samsung Internet** | ✅ Full Support | 4+ | Supported from Samsung Internet 4 onwards |
| **Opera Mobile** | ✅ Full Support | 80+ | Modern Opera Mobile versions |
| **Android Browser** | ✅ Full Support | 142+ | Latest Android Browser versions |
| **UC Browser** | ✅ Full Support | 15.5+ | Recent UC Browser versions |
| **Opera Mini** | ❌ No Support | All versions | Not supported in Opera Mini |
| **Baidu** | ✅ Full Support | 13.52+ | Recent Baidu Browser versions |
| **Kaios** | ✅ Full Support | 2.5+ | Supported from KaiOS 2.5 onwards |
| **Android 2.1-4.4.4** | ❌ No Support | All versions | Not supported in older Android browsers |
| **BlackBerry 7-10** | ❌ No Support | All versions | Not supported in BlackBerry browser |
| **IE Mobile 10-11** | ❌ No Support | All versions | Not supported in Internet Explorer Mobile |

### Support Statistics

- **Global Usage**: 93.19% of users have browsers with support
- **Partial Support**: 0% (either fully supported or not supported)
- **Prefix Required**: No (unprefixed support)

## Implementation Notes

### Firefox Implementation Details

Firefox had experimental support for the Font Loading API starting in version 35, but it was disabled by default. To enable it in those versions, users needed to set the `layout.css.font-loading-api.enabled` flag to `true` in `about:config`.

**Timeline**:
- **Firefox 35-40**: Disabled by default (flag required)
- **Firefox 41+**: Enabled by default and fully supported

### Known Issues & Bugs

#### FontFaceSet.check() Privacy Concern

**Issue**: Fingerprinting vulnerability in `FontFaceSet.check()`

**Description**: When none of the specified fonts exist, `FontFaceSet.check()` should return `true` according to [the W3C specification](https://drafts.csswg.org/css-font-loading/#font-face-set-check). However, Chrome and other Blink-based browsers incorrectly return `false`.

**Implications**:
- This behavior can be exploited for browser fingerprinting
- Developers should account for this discrepancy when implementing feature detection

**References**:
- [W3C CSS Font Loading Specification - FontFaceSet.check()](https://drafts.csswg.org/css-font-loading/#font-face-set-check)
- [GitHub Issue - W3C CSS Working Group Drafts #5744](https://github.com/w3c/csswg-drafts/issues/5744)

## Practical Examples

### Checking Font Support

```javascript
// Check if Font Loading API is supported
if (document.fonts && document.fonts.check) {
  console.log('Font Loading API is supported');
} else {
  console.log('Font Loading API is not supported');
}
```

### Loading a Font Dynamically

```javascript
const fontFace = new FontFace('MyFont', 'url(myfont.woff2)');

fontFace.load().then(() => {
  document.fonts.add(fontFace);
  // Font is now available for use
  document.body.style.fontFamily = 'MyFont';
}).catch((error) => {
  console.error('Font loading failed:', error);
});
```

### Checking if a Font is Available

```javascript
// Check if a specific font is loaded
if (document.fonts.check('12px MyFont')) {
  console.log('MyFont is available');
} else {
  console.log('MyFont is not available');
}
```

### Waiting for All Fonts to Load

```javascript
document.fonts.ready.then(() => {
  console.log('All fonts have been loaded');
  // Safe to use all declared fonts now
});
```

## Related Resources

- **Performance Guide**: [Optimizing with Font Load Events](https://www.igvita.com/2014/01/31/optimizing-web-font-rendering-performance/#font-load-events) - Best practices for using font load events to optimize web font rendering performance
- **Official Specification**: [W3C CSS Font Loading Module Level 3](https://www.w3.org/TR/css-font-loading-3/)

## Migration Guide for Unsupported Browsers

For browsers that don't support the Font Loading API (IE 5.5-11, Opera Mini, older Android browsers), consider these approaches:

1. **Graceful Degradation** - Use CSS `@font-face` with `font-display` property as a fallback
2. **Polyfills** - Use a polyfill library that emulates the API
3. **Feature Detection** - Check for API support before using, fall back to basic CSS loading
4. **Alternative Approaches** - Use `<link rel="preload">` for font preloading instead

## Summary

The CSS Font Loading API is now widely supported across modern browsers, with nearly 93% global coverage. It provides developers with powerful control over font loading behavior, enabling better performance optimization and user experience. The API is particularly valuable for implementing sophisticated font loading strategies in production web applications.

---

*Last Updated: 2024*
*Source: [Can I Use - CSS Font Loading](https://caniuse.com/font-loading)*
