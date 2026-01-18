# Do Not Track API

## Overview

The **Do Not Track (DNT) API** provides web developers with access to the browser's Do Not Track setting through the `navigator.doNotTrack` property. This JavaScript API allows websites to detect and respect users' privacy preferences expressed through their browser settings.

## Description

The Do Not Track API enables developers to query the browser's Do Not Track configuration via the `navigator.doNotTrack` interface. This allows websites to programmatically detect whether a user has enabled their browser's "Do Not Track" feature and adjust their tracking behavior accordingly.

However, it's important to note that **the Do Not Track specification was officially deprecated in 2018** due to widespread lack of adoption and implementation inconsistencies across browsers and websites.

## Specification Status

- **Status**: Unofficial / Deprecated (as of 2018)
- **W3C Specification**: [Tracking Preference Expression (DNT)](https://www.w3.org/TR/tracking-dnt/)

## Categories

- JavaScript API

## Use Cases & Benefits

### Primary Use Cases

1. **Privacy Respect**: Detect and honor user privacy preferences to disable analytics tracking
2. **User Consent Handling**: Adjust data collection behavior based on user's expressed preference
3. **Privacy Policy Compliance**: Help implement privacy policies that respect browser-level DNT signals
4. **Graceful Degradation**: Reduce tracking/profiling for users who explicitly opt-out

### Known Limitations

Due to the specification's deprecation and inconsistent implementation:

- **Not a reliable mechanism**: Many browsers no longer support it consistently
- **Browser-dependent**: Different browsers implement the API differently
- **Lack of enforcement**: Websites are not required to respect the DNT signal
- **Gradual abandonment**: Modern browsers are removing support (see Safari's recent changes)

## Implementation Notes

### API Usage

```javascript
// Check the Do Not Track setting
const dntPreference = navigator.doNotTrack;

// Possible values:
// "1" - User has enabled DNT (wants tracking disabled)
// "0" - User has disabled DNT (allows tracking)
// null - User has not expressed preference

if (navigator.doNotTrack === "1") {
  // Disable tracking/analytics
  console.log("User has enabled Do Not Track");
} else if (navigator.doNotTrack === "0") {
  // Enable tracking/analytics
  console.log("User wants to be tracked");
} else {
  // User has not expressed preference
  console.log("DNT preference not set");
}
```

### Known Implementation Issues

- **Gecko versions < 32**: Some browsers incorrectly report "yes" for both "Tell sites I don't want to be tracked" AND "Tell sites I do want to be tracked"
- **IE 9 & 10**: Use vendor-prefixed `navigator.msDoNotTrack` instead of `navigator.doNotTrack`
- **IE 11 & Edge 12-16**: Use `window.doNotTrack` instead of `navigator.doNotTrack`
- **Safari 6.1-9.1**: Supported a rejected spec amendment using `window.doNotTrack` rather than `navigator.doNotTrack`
- **Gecko < 32**: Used string values 'yes' and 'no' rather than '1' and '0'

## Browser Support

### Summary Statistics
- **Full Support**: 82.82% of users
- **Partial Support**: 0.44% of users

### Detailed Browser Support Table

| Browser | Support | First Version | Notes |
|---------|---------|---------------|-------|
| **Chrome** | ✅ Yes | 23 | Full support from v23 onwards |
| **Firefox** | ✅ Yes | 32 | Partial support from v9-31 (#3); Full from v32 |
| **Safari** | ⚠️ Limited | 5.1 | Support 5.1-6 & 9.1-12.1; removed in 12.1+ |
| **Edge** | ✅ Yes | 17 | Partial support from v12-16 (#2); Full from v17 |
| **Opera** | ✅ Yes | 12 | Full support from v12 onwards |
| **IE** | ⚠️ Partial | 9 | Vendor-prefixed in IE 9-10 (#1); Window-based in IE 11 (#2) |
| **Opera Mobile** | ✅ Yes | 12.1 | Full support from v12.1 onwards |
| **Android Chrome** | ✅ Yes | 4.4 | Full support from v4.4+ |
| **Android Firefox** | ✅ Yes | Latest | Supported in modern versions |
| **Samsung Internet** | ✅ Yes | 4.0 | Full support from v4.0 onwards |
| **iOS Safari** | ⚠️ Limited | 5.0-5.1 | Support 5.0-12.1, removed in 12.2+ |
| **UC Browser** | ✅ Yes | Latest | Supported |
| **Opera Mini** | ✅ Yes | All | All versions |
| **KaiOS** | ✅ Yes | 2.5 | Full support |

### Detailed Version Support

#### Chrome
- **No support**: v4-22
- **Full support**: v23 onwards

#### Firefox
- **No support**: v2-8
- **Partial support**: v9-31 (#3 - uses 'yes'/'no' instead of '1'/'0')
- **Full support**: v32 onwards

#### Safari
- **No support**: v3.1-5
- **Full support**: v5.1-6
- **Partial support**: v6.1-9.1 (#4 - uses `window.doNotTrack`)
- **No support**: v9.1+ (removed support)

#### Edge
- **Partial support**: v12-16 (#2 - uses `window.doNotTrack`)
- **Full support**: v17+

#### Internet Explorer
- **No support**: v5.5-8
- **Partial support**: v9-10 (#1 - vendor-prefixed as `navigator.msDoNotTrack`)
- **Partial support**: v11 (#2 - uses `window.doNotTrack`)

#### Opera
- **No support**: v9-11.6
- **Full support**: v12+

#### iOS Safari
- **No support**: v3.2-5.1
- **Partial support**: v7.0-9.0 (#4)
- **Full support**: v9.0-12.1
- **No support**: v12.2+ (removed support)

#### Android Browser
- **No support**: v2.1-4.3
- **Full support**: v4.4+

## Migration & Alternatives

Given the DNT specification's deprecation and inconsistent implementation, consider these modern alternatives:

### 1. **Privacy Policy & Consent Management**
- Implement explicit user consent mechanisms (cookie banners, preferences)
- Use established frameworks like IAB's Transparency & Consent Framework (TCF)

### 2. **Server-Side Signals**
- Check for `DNT` HTTP header (deprecated but still sent by some browsers)
- Combine with first-party privacy preferences

### 3. **Privacy-Preserving Analytics**
- Use analytics tools that respect user privacy by default
- Implement differential privacy techniques
- Consider privacy-focused analytics platforms

### 4. **Browser APIs for Privacy**
- **Privacy Budget API** (emerging)
- **Topics API** (replacement for third-party cookies)
- **Federated Learning of Cohorts (FLoC)** alternatives
- **Storage Access API** for iframe-based tracking

## Related Resources

### Official Documentation
- [MDN Web Docs - Navigator.doNotTrack](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/doNotTrack)

### Specifications
- [W3C Tracking Preference Expression (DNT) Spec](https://www.w3.org/TR/tracking-dnt/)

### Further Reading
- W3C Tracking Protection Working Group
- Privacy Best Practices for Web Developers
- Modern Alternative Privacy APIs

## Recommendations

### For New Projects
**Do not rely on the Do Not Track API**. The specification is deprecated and increasingly unsupported. Instead:

1. Implement explicit user consent mechanisms
2. Use privacy-friendly analytics by default
3. Adopt emerging privacy standards
4. Provide clear privacy controls and settings

### For Existing Implementations
**Deprecate DNT checks** in favor of:

1. First-party consent preferences
2. Privacy-preserving analytics alternatives
3. Transparent data practices
4. User-friendly privacy controls

### Browser Compatibility
If you must support DNT for legacy reasons, be aware of the inconsistent implementations and provide fallbacks for modern privacy mechanisms.

## Summary

The Do Not Track API represents an early attempt at giving users browser-level control over tracking preferences. However, due to its deprecation since 2018 and inconsistent implementation across browsers (particularly Safari's recent removal of support), it should not be relied upon for modern web applications. Web developers should adopt more reliable, explicit consent mechanisms and privacy-preserving alternatives to respect user privacy.
