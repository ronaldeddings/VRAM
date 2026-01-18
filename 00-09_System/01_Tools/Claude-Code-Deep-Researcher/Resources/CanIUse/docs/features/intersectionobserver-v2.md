# IntersectionObserver V2

## Overview

IntersectionObserver V2 is an iteration on the original IntersectionObserver API that extends its capabilities to report additional intersection information useful for security and ad tracking purposes.

## Description

IntersectionObserver V2 provides enhanced visibility detection that reports not only whether an element is within the viewport, but also:
- Whether the element is covered (occluded) by another element
- Whether filters are applied to the element
- Additional visibility metrics for precise element tracking

This extended functionality is particularly useful for:
- **Security**: Blocking clickjacking attempts by detecting when interactive elements are hidden or obscured
- **Ad Verification**: Tracking actual ad exposure by ensuring ads are both visible and unobstructed
- **User Analytics**: Measuring genuine user interaction with elements

## Specification Status

- **Status**: Unofficial/Unstandard
- **Spec URL**: https://szager-chromium.github.io/IntersectionObserver/
- **Current Implementation**: Chromium-led initiative

## Categories

- DOM
- JavaScript API
- Security

## Key Benefits & Use Cases

### Security Applications
- **Clickjacking Prevention**: Detect when UI elements are invisible or covered by transparent overlays
- **Ad Fraud Detection**: Verify that advertisement placements are actually visible to users
- **User Intent Verification**: Confirm elements are genuinely interactive and visible

### Analytics & Monitoring
- **Ad Exposure Metrics**: Track actual ad impressions with visibility verification
- **Element Visibility Tracking**: Monitor which elements users can actually see
- **Performance Monitoring**: Analyze page layout and element occlusion

### User Experience
- **Lazy Loading Optimization**: Load content only when genuinely visible
- **Video Autoplay Control**: Only play videos that are actually viewable
- **Analytics Accuracy**: Count only genuine user interactions

## Browser Support

### Desktop Browsers

| Browser | First Support | Current Status |
|---------|---------------|---|
| **Chrome** | 74 | ✅ Supported (v74+) |
| **Edge** | 79 | ✅ Supported (v79+) |
| **Firefox** | — | ❌ Not Supported |
| **Safari** | — | ❌ Not Supported |
| **Opera** | 62 | ✅ Supported (v62+) |

### Mobile Browsers

| Platform | Browser | Support |
|----------|---------|---------|
| **Android Chrome** | v142+ | ✅ Supported |
| **Android Opera** | v80+ | ✅ Supported |
| **Android UC Browser** | v15.5+ | ✅ Supported |
| **Samsung Internet** | v11.1+ | ✅ Supported |
| **iOS Safari** | — | ❌ Not Supported |
| **Firefox Android** | — | ❌ Not Supported |
| **Opera Mini** | — | ❌ Not Supported |

### Detailed Browser Compatibility

**Full Support (All Modern Versions)**:
- Chrome: 74+
- Edge (Chromium): 79+
- Opera: 62+
- Samsung Internet: 11.1+
- Android Chrome: 142+

**No Support**:
- Firefox: All versions
- Safari: All versions (including iOS Safari)
- IE and older Edge: All versions
- Opera Mini: All versions

## Implementation Notes

### Important Considerations

1. **Limited Browser Support**: This feature is primarily available in Chromium-based browsers. Firefox and Safari do not support it.

2. **Unofficial Specification**: While being developed, IntersectionObserver V2 remains an unofficial specification. Use with awareness that the API may change.

3. **Fallback Strategies**: Projects requiring broader browser compatibility should implement fallback detection mechanisms using alternative approaches.

4. **V1 Compatibility**: This extends the original IntersectionObserver API (V1). Ensure your polyfills and detection mechanisms account for feature detection rather than browser detection.

5. **Performance Impact**: Detecting occlusion and filters may have performance implications. Monitor performance in production environments.

## Usage Statistics

- **Supported by**: ~80.13% of globally tracked browsers
- **Adoption**: Growing in Chromium-based ecosystem

## Related Links

- [Google Web Docs - Intersection Observer V2](https://developers.google.com/web/updates/2019/02/intersectionobserver-v2)
- [Mozilla Standards Position - IntersectionObserver V2](https://github.com/mozilla/standards-positions/issues/109)
- [Safari Bug Report - IntersectionObserver V2 Support](https://bugs.webkit.org/show_bug.cgi?id=251586)

## Related Features

- **Parent Feature**: [IntersectionObserver](intersectionobserver.md) - The original API without V2 enhancements
- **Similar APIs**: Mutation Observer, Resize Observer

## Feature Detection

To detect support for IntersectionObserver V2:

```javascript
// Check if IntersectionObserver exists and supports isVisible
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(() => {});
  // V2 support indicated by isVisible property in entries
  // or by checking other V2-specific properties
  console.log('IntersectionObserver available');
}
```

## Recommendations

### For Projects Targeting Modern Chromium Browsers
- Use IntersectionObserver V2 directly for enhanced visibility detection
- Implement comprehensive feature detection

### For Cross-Browser Projects
- Use the original IntersectionObserver (V1) for broader compatibility
- Implement custom occlusion detection for Firefox and Safari using alternative methods:
  - Element.getBoundingClientRect()
  - Document.elementFromPoint()
  - Manual visibility checking

### For Ad Networks & Security-Critical Applications
- Consider using IntersectionObserver V2 as a modern enhancement
- Maintain fallback visibility verification for unsupported browsers
- Implement server-side verification as an additional security layer

---

**Last Updated**: 2025
**Source**: CanIUse Feature Database
