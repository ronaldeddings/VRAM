# Opera Mobile Browser

## Browser Information

| Property | Value |
|----------|-------|
| **Browser Name** | Opera Mobile |
| **Full Name** | Opera for Android |
| **Browser Code** | `op_mob` |
| **Type** | Mobile |
| **Abbreviation** | O.Mob |
| **Vendor Prefix** | `o` |

## Vendor Prefix

- **Default Prefix**: `-o-`
- **Prefix Exception for Version 80+**: `-webkit-`

Starting with version 80, Opera Mobile switched to the WebKit rendering engine, and therefore uses the `-webkit-` vendor prefix for CSS properties instead of the legacy `-o-` prefix.

## Version History

### Legacy Versions (Presto Engine)

| Version | Vendor Prefix | Usage % | Status |
|---------|---------------|---------|--------|
| 10 | `-o-` | 0% | Discontinued |
| 11 | `-o-` | 0% | Discontinued |
| 11.1 | `-o-` | 0% | Discontinued |
| 11.5 | `-o-` | 0% | Discontinued |
| 12 | `-o-` | 0% | Discontinued |
| 12.1 | `-o-` | 0% | Discontinued |

### Modern Versions (WebKit Engine)

| Version | Vendor Prefix | Usage % | Status |
|---------|---------------|---------|--------|
| 80+ | `-webkit-` | 0.825856% | Current |

## Usage Statistics

### Global Market Share

- **Version 80**: 0.825856% of global usage
- **Legacy Versions (10-12.1)**: 0% (deprecated)

The usage data shows that Opera Mobile 80 represents the vast majority of active Opera Mobile installations globally, indicating successful adoption of the WebKit-based version.

## Key Characteristics

### Engine Evolution

**Presto Era (Versions 10-12.1)**
- Used Opera's proprietary Presto rendering engine
- Required `-o-` vendor prefix for CSS3 features
- Minimal current usage

**WebKit Era (Version 80+)**
- Switched to WebKit rendering engine (same as Chrome, Safari, Edge)
- Uses standard `-webkit-` vendor prefix
- Significantly improved web compatibility
- Better performance and alignment with modern web standards

### Platform

Opera Mobile is exclusively available on the Android platform as "Opera for Android". It is not available on iOS, where users must use Safari due to Apple's App Store requirements.

## Feature Support Considerations

### Prefix Strategy

When implementing CSS features with vendor prefixes:

```css
/* For features requiring prefixes */
-webkit-transform: rotate(45deg);
-moz-transform: rotate(45deg);
-ms-transform: rotate(45deg);
transform: rotate(45deg);
```

Since Opera Mobile 80 uses WebKit, use the `-webkit-` prefix rather than `-o-`.

### Legacy Version Support

If you need to support legacy Opera Mobile versions (10-12.1):
- Add `-o-` prefixed versions of CSS properties
- Note: These versions have virtually 0% market share
- Generally not recommended for new projects

## Compatibility Notes

### Desktop Opera vs Opera Mobile

- **Desktop Opera** (coded as `opera`) switched to WebKit in version 15+
- **Opera Mobile** (coded as `op_mob`) has separate version numbering
- Desktop Opera version 120+ has ~0.009% usage
- Opera Mobile version 80 has ~0.826% usage

Opera Mobile represents the more used variant in the mobile space.

### Relationship to Chrome for Android

Both Opera Mobile and Chrome for Android use the WebKit engine, making their CSS feature support increasingly similar. However, Opera Mobile may lag behind Chrome for Android in receiving the latest features.

### Current Usage Context

Version 80 is the only actively used version of Opera Mobile with measurable market share (0.825856%), making it the only practical target for modern Opera Mobile support.

## Testing Recommendations

1. **Target Version**: Focus on Opera Mobile 80+ for modern projects
2. **WebKit Prefix**: Use `-webkit-` prefix (version 80 uses WebKit engine)
3. **Legacy Support**: Only include `-o-` prefix if specifically supporting legacy Android devices
4. **Testing**: Test on actual Android devices or use Android emulators with Opera Mobile installed

## References

- **CanIUse Code**: `op_mob`
- **Data Last Updated**: 2025-12-13
- **Global Usage Threshold**: ~0.83% (Opera Mobile 80)
