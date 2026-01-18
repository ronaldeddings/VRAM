# IE Mobile Browser

## Browser Information

| Property | Value |
|----------|-------|
| **Browser Name** | IE Mobile |
| **Browser Code** | `ie_mob` |
| **Type** | Mobile |
| **Abbreviation** | IE.Mob |
| **Vendor Prefix** | `ms` |
| **Platform** | Windows Mobile / Windows Phone |

## Vendor Prefix

- **Default Prefix**: `-ms-`

IE Mobile uses the `-ms-` vendor prefix for CSS extensions, consistent with desktop Internet Explorer. This prefix is shared across all versions of IE Mobile.

## Version History

### Supported Versions in CanIUse

| Version | Status | Global Usage % |
|---------|--------|-----------------|
| 10 | Discontinued | 0% |
| 11 | Discontinued | 0% |

The CanIUse dataset tracks two versions of IE Mobile: version 10 and version 11. Both versions are currently discontinued and have no measurable global market share.

## Usage Statistics

### Global Market Share

| Version | Usage % |
|---------|---------|
| 10 | 0% |
| 11 | 0% |
| **Total IE Mobile** | **0%** |

IE Mobile has virtually zero global market share and is no longer actively used. The browser is considered obsolete by modern web standards.

## Key Characteristics

### Operating System Context

**Windows Mobile / Windows Phone**
- IE Mobile was the default browser on Windows Mobile and Windows Phone devices
- Windows Phone development was discontinued by Microsoft in 2015
- As of 2025, there is minimal to no active deployment of Windows Phone devices
- The platform has been completely superseded by Android and iOS ecosystems

### Engine Characteristics

IE Mobile uses the **Trident rendering engine** (same as desktop Internet Explorer):
- Very limited CSS3 support compared to modern browsers
- Requires extensive vendor prefix usage for compatibility
- Performance limitations due to older engine architecture
- Poor support for modern JavaScript features

### Relationship to Desktop IE

IE Mobile maintained compatibility with desktop IE versions:
- **IE Mobile 10** corresponds to desktop IE 10 (2012)
- **IE Mobile 11** corresponds to desktop IE 11 (2013)
- Shared the same Trident engine and prefix requirements
- Similar (but not identical) feature set to desktop versions

## Feature Support Considerations

### Vendor Prefix Strategy

When implementing CSS features, use the `-ms-` prefix for IE Mobile compatibility:

```css
/* For CSS features requiring prefixes */
-webkit-transform: rotate(45deg);
-moz-transform: rotate(45deg);
-ms-transform: rotate(45deg);
transform: rotate(45deg);
```

### Legacy Version Support

Supporting IE Mobile is generally **not recommended** for new projects due to:
- 0% current market share
- Windows Phone platform discontinued
- Minimal feature support
- Performance constraints
- Maintenance burden

If legacy support is absolutely required:
- Use feature detection rather than browser detection
- Provide fallbacks for unsupported CSS features
- Test on Windows Phone emulator (if available)
- Consider graceful degradation approach

## Platform Discontinuation

### Windows Phone End of Life

- **Original Support**: Windows Mobile (2003-2010), Windows Phone (2010-2015)
- **Final Version**: Windows Phone 8.1 (2013-2016)
- **Support Ended**: December 10, 2019 (official end of support)
- **Current Status**: Completely obsolete

Microsoft formally ended support for Windows Phone in 2019, marking the complete discontinuation of the platform. No devices running Windows Phone are expected to be in active use.

### Market Impact

The failure of Windows Phone as a mobile platform means:
- No new IE Mobile instances are being created
- Existing devices are extremely rare (likely less than 0.001% of global market)
- Development resources should not be allocated to IE Mobile support
- Modern development practices do not account for this browser

## Compatibility Notes

### Comparison with Modern Mobile Browsers

| Feature | IE Mobile 11 | Chrome Mobile | Safari iOS | Edge Mobile |
|---------|--------------|---------------|-----------|-------------|
| **Engine** | Trident | WebKit | WebKit | Chromium |
| **Market Share** | 0% | ~60% | ~25% | ~5% |
| **CSS3 Support** | Limited | Excellent | Excellent | Excellent |
| **ES6+ Support** | None | Full | Full | Full |
| **Status** | Discontinued | Active | Active | Active |

IE Mobile lags significantly behind all modern mobile browsers in feature support and performance.

### Desktop vs Mobile IE

| Aspect | Desktop IE 11 | IE Mobile 11 |
|--------|---------------|--------------|
| **Market Share** | ~0.33% | ~0% |
| **Active Use** | Legacy/Enterprise | None |
| **Platform** | Windows | Windows Phone (discontinued) |
| **Vendor Prefix** | `-ms-` | `-ms-` |
| **Status** | Legacy | Fully obsolete |

Even desktop IE 11 (with 0.33% usage) is significantly more prevalent than IE Mobile.

## Recommendations

### For New Projects

**Do not develop for IE Mobile.** The platform has been completely discontinued, and no users exist on this browser.

### For Existing Enterprise Systems

If you inherit legacy code that claims to support IE Mobile:
1. **Verify actual usage**: Check analytics to confirm if any IE Mobile traffic exists
2. **Assume none exists**: Treat as 0% in user demographics
3. **Focus on modern browsers**: Allocate resources to browsers with actual users
4. **Consider removal**: Remove IE Mobile-specific code as part of technical debt reduction
5. **Simplify codebase**: Removing legacy support reduces maintenance burden

### For Feature Development

When implementing new features:
- **Target modern browsers**: Chrome, Firefox, Safari, Edge
- **Use progressive enhancement**: Provide basic functionality for older browsers
- **Drop IE Mobile support**: Not necessary for any modern project
- **Use CSS Grid / Flexbox**: Without IE Mobile fallbacks
- **Implement modern JavaScript**: ES6+ without transpilation to ES5

## Testing Recommendations

### Why Testing is Unnecessary

IE Mobile testing is not recommended because:
1. Platform is discontinued (Windows Phone ended in 2019)
2. Zero global market share
3. Devices are extremely rare in the field
4. No business value in supporting this browser
5. Resources better spent on modern browser support

### If Historical Documentation is Required

For documentation purposes only, IE Mobile supported:
- CSS 2.1 with limited CSS3 support
- JavaScript ES5 (no ES6+)
- Basic HTML5 features
- Limited media support (no HTML5 video)

## References

- **CanIUse Code**: `ie_mob`
- **Vendor Prefix**: `ms`
- **Browser Type**: Mobile (Windows Phone)
- **Data Last Updated**: 2025-12-13
- **Global Usage**: 0% (completely obsolete)
- **Platform Status**: Discontinued (Windows Phone ended 2019)
- **Recommendation**: Do not develop for this browser

---

## Related Documentation

- **Desktop IE**: See `ie.md` for Internet Explorer (desktop version)
- **Windows Phone**: Discontinued in 2019, completely obsolete
- **Microsoft Edge**: The successor to IE, available on modern platforms (see `edge.md`)
- **Mobile Browsers**: See documentation for Chrome Mobile, Safari iOS, and Edge Mobile
