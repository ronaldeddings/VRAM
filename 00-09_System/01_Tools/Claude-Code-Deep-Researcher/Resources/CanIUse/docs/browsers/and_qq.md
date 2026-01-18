# QQ Browser for Android

## Browser Information

| Property | Value |
|----------|-------|
| **Browser Name** | QQ Browser |
| **Full Name** | QQ Browser for Android |
| **Browser Code** | `and_qq` |
| **Type** | Mobile |
| **Abbreviation** | QQ |
| **Vendor Prefix** | `-webkit-` |
| **Platform** | Android |

## Vendor Prefix

- **Vendor Prefix**: `-webkit-`
- **Rendering Engine**: WebKit-based

QQ Browser for Android uses the WebKit rendering engine, which is the same engine used by Chrome, Safari, and other modern mobile browsers. As a result, it uses the standard `-webkit-` vendor prefix for CSS properties that require vendor-specific implementations.

## Version History

### Current Versions

| Version | Release Date | Usage % | Status |
|---------|--------------|---------|--------|
| 14.9 | Unknown | 0.148736% | Current |

QQ Browser for Android version 14.9 is the currently tracked version with measurable global market share.

## Usage Statistics

### Global Market Share

- **Version 14.9**: 0.148736% of global usage

While QQ Browser's global market share is relatively modest at approximately 0.15%, it has a notable presence in Asian markets, particularly in China where Tencent, the developer, is based. The browser is primarily used in regions where QQ services are popular.

## Key Characteristics

### Platform & Distribution

- **Exclusive Platform**: Android
- **Developer**: Tencent
- **Primary Market**: China and other Asian regions
- **Rendering Engine**: WebKit

### Engine Details

**WebKit Engine**:
- Same rendering engine as Chrome, Safari, Edge, and Opera
- Uses standard `-webkit-` vendor prefix for CSS3 features
- Good compatibility with modern web standards
- CSS feature support closely aligned with other WebKit-based browsers

### Distribution and Availability

QQ Browser is developed by Tencent, a major Chinese technology company. The browser is primarily distributed through:
- Android's Google Play Store and alternative stores
- Direct distribution in markets where Google Play is unavailable
- Bundled with other Tencent services and applications

## Feature Support Considerations

### Vendor Prefix Strategy

When implementing CSS features with vendor prefixes:

```css
/* Recommended: Include -webkit- prefix for broader compatibility */
-webkit-transform: rotate(45deg);
-moz-transform: rotate(45deg);
-ms-transform: rotate(45deg);
transform: rotate(45deg);

/* Example: Flexbox with vendor prefixes */
display: -webkit-flex;
display: flex;
```

Since QQ Browser uses the WebKit engine, use the `-webkit-` prefix. This ensures compatibility with QQ Browser version 14.9 and other WebKit-based browsers.

### CSS Feature Support

QQ Browser's CSS feature support is typically at parity with other WebKit browsers. Key features to consider:

- **Flex Display**: Fully supported (use `-webkit-` prefix for older/edge cases)
- **CSS Grid**: Supported (modern versions)
- **CSS Custom Properties**: Supported
- **Transform & Animation**: Supported with `-webkit-` prefix
- **Modern Media Queries**: Supported

### JavaScript API Support

QQ Browser supports modern JavaScript APIs including:
- ES6+ features
- Promise API
- Fetch API
- Web Workers
- Local Storage & Session Storage

## Regional Market Considerations

### Primary Markets

QQ Browser has significant usage in:

- **China**: Primary market (Tencent's home country)
- **Asia-Pacific Region**: Growing adoption in neighboring markets
- **Global Presence**: Modest but measurable market share

### Localization

QQ Browser is available with localized versions for:
- Simplified Chinese
- Traditional Chinese (Hong Kong, Taiwan)
- Other regional variants

## Compatibility with Other Browsers

### Comparison with Major Browsers

| Feature | Chrome | Safari | Firefox | QQ Browser |
|---------|--------|--------|---------|-----------|
| Rendering Engine | Blink | WebKit | Gecko | WebKit |
| Vendor Prefix | -webkit- | -webkit- | -moz- | -webkit- |
| ES6+ Support | Yes | Yes | Yes | Yes |
| CSS Grid | Yes | Yes | Yes | Yes |
| Flexbox | Yes | Yes | Yes | Yes |

Since QQ Browser uses WebKit like Chrome and Safari, it provides excellent compatibility with modern web standards and CSS features that target WebKit browsers.

### Relationship to Chrome for Android

Both QQ Browser and Chrome for Android use the WebKit/Blink rendering engine, resulting in similar feature support and compatibility. However:

- Chrome for Android has a larger market share (~65%)
- QQ Browser has regional strength in Asian markets
- Both support modern web standards well
- Coding for Chrome for Android generally ensures QQ Browser compatibility

## Testing Recommendations

### Target Version

Focus on QQ Browser version 14.9 for modern projects, as it is the only version with measurable market share.

### Testing Approaches

1. **Emulation**: Use Android emulators with QQ Browser installed
   - Android Studio's built-in emulator
   - Genymotion or other third-party emulators

2. **Real Device Testing**: Test on actual Android devices with QQ Browser installed
   - Essential for performance testing
   - Captures real-world rendering behavior

3. **WebKit Compatibility Testing**: Since QQ Browser uses WebKit, test with:
   - Chrome for Android
   - Samsung Internet (also WebKit-based)
   - Mobile Safari (WebKit) for comparison

### CSS Testing Checklist

- Test vendor-prefixed CSS properties with `-webkit-` prefix
- Verify responsive design on various Android screen sizes
- Test touch interactions and gestures
- Verify performance on mid-range Android devices
- Test viewport meta tags and responsive behavior

### JavaScript Testing

- Verify ES6+ feature support
- Test Fetch API and AJAX functionality
- Test Web Workers if used
- Verify localStorage and sessionStorage functionality

## Known Issues and Quirks

### Market Share Threshold

QQ Browser's global market share (0.148736%) falls below most enterprise testing requirements, which typically focus on browsers with >0.5% global usage. However, if targeting Asian markets, particularly China, QQ Browser becomes more relevant.

### Regional Variation

Feature support may vary slightly by regional version, as Tencent may customize versions for different markets.

## Development Guidelines

### Recommended Approach

1. **WebKit Feature Detection**: Treat QQ Browser as a WebKit browser
2. **Vendor Prefix Inclusion**: Always include `-webkit-` prefix for new CSS features
3. **Progressive Enhancement**: Build with progressive enhancement in mind
4. **Fallback Support**: Provide non-prefixed fallbacks for widespread CSS support

### Code Example: Feature Support with Graceful Degradation

```css
/* Transform with vendor prefix */
.element {
  -webkit-transform: translateX(10px);
  transform: translateX(10px);
}

/* Filter effects */
.image {
  -webkit-filter: brightness(1.2);
  filter: brightness(1.2);
}

/* Backdrop filter (modern feature) */
.modal {
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}
```

## References

- **CanIUse Code**: `and_qq`
- **Developer**: Tencent
- **Data Last Updated**: 2025-12-13
- **Global Usage Share**: 0.148736% (Version 14.9)
- **Platform**: Android exclusively
- **Rendering Engine**: WebKit

## Additional Resources

- [CanIUse QQ Browser Profile](https://caniuse.com/aqd/browsers/and_qq)
- [Android Developer Documentation](https://developer.android.com/)
- [WebKit Project](https://webkit.org/)
- [Tencent QQ Browser](https://browser.qq.com/) (Simplified Chinese)

## Notes

QQ Browser for Android is a capable modern browser with WebKit engine support for contemporary web standards. While its global market share is relatively small, it holds strategic importance for applications targeting Chinese and other Asian markets. The use of WebKit ensures good compatibility with modern CSS and JavaScript standards aligned with other Chromium and WebKit-based browsers.

Development teams should include QQ Browser in their testing matrix if:
- Targeting the Asian market (particularly China)
- Supporting all major browsers
- Specifically developing for Chinese users

For applications without specific Asian market focus, testing with Chrome for Android typically provides sufficient coverage for WebKit-based feature compatibility.
