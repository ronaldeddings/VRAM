# inputmode Attribute

## Description

The `inputmode` attribute specifies what kind of input mechanism would be most helpful for users entering content into a form control. This attribute allows developers to hint to browsers which virtual keyboard or input method should be displayed on mobile devices and other input-dependent systems.

## Specification Status

- **Status**: Living Standard (ls)
- **Specification URL**: [WHATWG HTML Living Standard - Input Modalities](https://html.spec.whatwg.org/multipage/forms.html#input-modalities:-the-inputmode-attribute)

## Categories

- DOM
- HTML5

## Use Cases & Benefits

### Use Cases

- **Mobile UX Enhancement**: Display appropriate virtual keyboards on mobile devices (numeric, email, URL, decimal, etc.)
- **Form Optimization**: Improve data entry experience by showing context-specific keyboards
- **Accessibility**: Help users with assistive technologies understand the expected input type
- **International Support**: Better input handling for different languages and writing systems

### Benefits

- Improved user experience on mobile devices with context-specific keyboards
- Reduced form errors by guiding users to enter correct input formats
- Better support for various input types without relying solely on `<input type="">`
- Enhanced accessibility for users with input method preferences
- Progressive enhancement for browsers that support the attribute

## Supported Values

The `inputmode` attribute accepts the following values:

- `none` - No virtual keyboard should be shown
- `text` - Standard text input keyboard (default)
- `decimal` - Numeric keyboard with decimal point
- `numeric` - Numeric keyboard (0-9)
- `tel` - Telephone keyboard (with +, -, #, *)
- `search` - Text keyboard optimized for search
- `email` - Email keyboard (with @, .)
- `url` - URL keyboard (with /, :, .)

## Browser Support

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| **Chrome** | 66+ | ✅ Supported | Full support from version 66 onward |
| **Edge** | 79+ | ✅ Supported | Full support from version 79 onward |
| **Firefox** | 95+ | ✅ Supported | Full support from version 95 onward |
| **Safari** | 12.1+ | ✅ Supported | iOS Safari from 12.2+ |
| **Opera** | 53+ | ✅ Supported | Full support from version 53 onward |
| **Internet Explorer** | All versions | ❌ Not Supported | No support in any IE version |
| **Opera Mini** | All versions | ❌ Not Supported | Not available in Opera Mini |
| **Samsung Internet** | 9.2+ | ✅ Supported | Full support from version 9.2 onward |
| **Android Browser** | 142+ | ✅ Supported | Recent versions support this feature |

### Mobile Support

| Platform | Version | Status |
|----------|---------|--------|
| **iOS Safari** | 12.2+ | ✅ Supported |
| **Android Chrome** | 142+ | ✅ Supported |
| **Android Firefox** | 144+ | ✅ Supported |
| **Samsung Internet** | 9.2+ | ✅ Supported |
| **Opera Mobile** | 80+ | ✅ Supported |
| **Chrome Android** | 142+ | ✅ Supported |
| **Android UC Browser** | 15.5+ | ✅ Supported |
| **Baidu Browser** | 13.52+ | ✅ Supported |
| **QQ Browser** | 14.9+ | ✅ Supported |
| **Blackberry Browser** | All versions | ❌ Not Supported |
| **IE Mobile** | All versions | ❌ Not Supported |
| **KaiOS** | 2.5-3.1 | 🔶 Partial Support* |

**\* Note**: Support can be enabled via the `dom.forms.inputmode` flag

## Implementation Notes

### Browser Adoption Timeline

- **Chrome**: Adoption started at version 56 (in development, "n d" flag) and became fully supported at version 66
- **Firefox**: Early support in versions 17-20, with development flag ("n d"). Full support reached at version 95
- **Safari**: Desktop support added in version 12.1, iOS support in 12.2 with full adoption in all subsequent versions
- **Edge**: Full support since version 79 (when Edge transitioned to Chromium engine)
- **Opera**: Development support from version 43, full support from version 53

### Important Considerations

- The `inputmode` attribute is a hint to the browser and does not guarantee specific keyboard behavior
- Different browsers may implement inputmode differently, especially on mobile platforms
- The attribute works best in combination with appropriate `<input type="">` values
- Older versions of Firefox require enabling the `dom.forms.inputmode` preference flag
- The attribute is ignored by Internet Explorer and Opera Mini

### Fallback Strategy

For maximum compatibility, use the `inputmode` attribute in conjunction with the `type` attribute:

```html
<!-- Email input with fallback -->
<input type="email" inputmode="email" />

<!-- Phone number input -->
<input type="tel" inputmode="tel" />

<!-- Decimal number input -->
<input type="number" inputmode="decimal" />

<!-- URL input -->
<input type="url" inputmode="url" />
```

## Global Usage Statistics

- **Full Support**: 92.7% of global users
- **Partial/Development Support**: 0%
- **No Support**: 7.3% of global users

## Related Resources

- [Everything You Ever Wanted to Know About inputmode (CSS Tricks)](https://css-tricks.com/everything-you-ever-wanted-to-know-about-inputmode/)
- [Demo on Wufoo (Historical Reference)](https://www.wufoo.com/html5/attributes/23-inputmode.html)
- [WHATWG HTML Living Standard Specification](https://html.spec.whatwg.org/multipage/forms.html#input-modalities:-the-inputmode-attribute)

## Browser Implementation Timeline

| Year | Event |
|------|-------|
| 2016 | Chrome 56 begins development of inputmode support |
| 2017 | Chrome 66 ships full support for inputmode |
| 2019 | Safari 12.1 (desktop) and iOS Safari 12.2 add support |
| 2019 | Firefox 17+ with development support available via flag |
| 2020 | Firefox 95 ships full support |
| 2020 | Edge 79+ supports inputmode (Chromium-based) |
| 2020 | Samsung Internet 9.2 and later support inputmode |
| Present | ~93% global browser support achieved |

## Recommendations

1. **Use for mobile forms**: Leverage `inputmode` to improve mobile user experience
2. **Combine with type attribute**: Always pair with appropriate `<input type="">` for maximum compatibility
3. **Test on target devices**: Verify keyboard appearance on target mobile platforms
4. **Provide alternatives**: Don't rely solely on inputmode; ensure forms work without it
5. **Progressive enhancement**: Use inputmode as an enhancement for modern browsers while maintaining backward compatibility

---

*Last Updated: 2025-12-13*
*Data Source: CanIUse Feature Database*
