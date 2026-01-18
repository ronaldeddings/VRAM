# Web Share API

## Overview

The Web Share API provides a standardized way for websites to invoke the native sharing capabilities of the host platform. This allows web applications to offer sharing functionality that matches the user's operating system, creating a more native-like experience.

## Description

The Web Share API enables web applications to trigger the native share dialog on devices that support it. Instead of implementing custom sharing buttons or dialogs, developers can leverage the platform's built-in sharing mechanisms (such as email, messaging apps, social networks, etc.) that the user has configured on their device.

This API is particularly valuable for:
- Mobile web applications that need to match native app behavior
- Progressive Web Apps (PWAs) that aim for a native-like experience
- Content-heavy websites that want to encourage content distribution
- Applications that don't want to maintain their own social sharing implementation

## Specification Status

- **Status:** Candidate Recommendation (CR)
- **Specification URL:** https://www.w3.org/TR/web-share/
- **Current Implementation:** Active and evolving

## Categories

- JavaScript API

## Key Features & Use Cases

### Benefits

1. **Native Integration**
   - Uses the operating system's native sharing interface
   - Consistent user experience across web and native apps
   - No need to maintain social media integrations

2. **Platform Flexibility**
   - Adapts to available sharing options on each device
   - Users can share through their preferred methods
   - Reduces app bundle size by eliminating custom sharing UI

3. **User Privacy**
   - No direct access to user data
   - Sharing happens through system-level controls
   - Users maintain full control over how content is shared

4. **PWA Enhancement**
   - Makes Progressive Web Apps feel more like native applications
   - Provides feature parity with native app sharing
   - Improves user engagement and content distribution

### Typical Use Cases

- **Content Publishing Platforms:** Share articles, blog posts, or media
- **E-commerce Applications:** Share product links and descriptions
- **Social Features:** Allow users to share achievements, results, or recommendations
- **Collaborative Tools:** Enable sharing of documents, projects, or achievements
- **Mobile-First Websites:** Provide seamless sharing on mobile devices

## Browser Support

### Support Legend

- **y** = Fully supported
- **a #N** = Partially supported (see notes for details)
- **n** = Not supported

### Desktop Browsers

| Browser | First Support | Latest Versions | Status |
|---------|---------------|-----------------|--------|
| **Chrome** | 89 (partial) | 128+ | ✅ Fully supported |
| **Edge** | 81 (partial) | 95+ | ✅ Fully supported |
| **Firefox** | — | 148 | ❌ Not supported |
| **Safari** | 12.1 (partial) | 14+ | ✅ Fully supported |
| **Opera** | 114 | 115-122 | ✅ Fully supported |

### Mobile & Tablet Browsers

| Browser | First Support | Status |
|---------|---------------|--------|
| **Safari (iOS)** | 12.2-12.5 (partial) | ✅ Fully supported from iOS 14 |
| **Chrome for Android** | 142 | ✅ Fully supported |
| **Firefox for Android** | 144 | ✅ Fully supported |
| **Samsung Internet** | 8.2 | ✅ Fully supported |
| **Opera Mobile** | 80 | ✅ Fully supported |

### Limited/No Support

| Browser | Status |
|---------|--------|
| **Internet Explorer** | ❌ Not supported |
| **Opera Mini** | ❌ Not supported |
| **Blackberry Browser** | ❌ Not supported |
| **UC Browser** | ❌ Not supported |
| **QQ Browser** | ❌ Not supported |
| **Baidu Browser** | ❌ Not supported |
| **KaiOS** | ❌ Not supported |

## Usage Statistics

- **Full Support:** 83.01% of users
- **Partial Support:** 6.33% of users
- **Total Support:** 89.34% of users

## Implementation Notes

### Platform-Specific Limitations

1. **Windows Only (Edge & Chrome)**
   - Note #3: Full support only available on Windows for Edge (versions 81-94)
   - Note #4: Full support on Windows and Chrome OS for Chrome (versions 89-127)

2. **iOS Safari Limitations**
   - Note #5: Versions 12.1-13.7 did not support share click that would trigger a fetch call
   - Full support stabilized in iOS 14

3. **Android Notes**
   - Note #2: For older Android versions, `android:intent://` URLs can be used as an alternative

4. **Legacy Support**
   - Chrome versions 18-24: Implemented old Web Intents API (not compatible with current standard)
   - Modern implementation started in Chrome 89

### Feature Detection

```javascript
// Check if Web Share API is supported
if (navigator.share) {
  // API is available
}

// Check if specific share data can be shared (optional)
if (navigator.canShare && navigator.canShare(shareData)) {
  // Safe to proceed with sharing
}
```

### Basic Usage Example

```javascript
const shareButton = document.querySelector('#share-btn');

shareButton.addEventListener('click', async () => {
  try {
    await navigator.share({
      title: 'Page Title',
      text: 'Description of content',
      url: window.location.href
    });
  } catch (err) {
    // User cancelled share or API not available
    console.log('Error sharing:', err);
  }
});
```

## Related Resources

### Official Documentation
- [Web Share API on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)
- [W3C Official Demo](https://w3c.github.io/web-share/demos/share.html)
- [Web.dev Guide: Share like a native app with the Web Share API](https://web.dev/web-share/)

### Implementation Guides
- [Google Chrome Blog Post](https://developers.google.com/web/updates/2016/10/navigator-share)
- [Hospodarets - Web Share API brings the native sharing capabilities to the browser](https://blog.hospodarets.com/web-share-api)
- [Phil Nash - The Web Share API](https://philna.sh/blog/2017/03/14/the-web-share-api/)
- [Love2Dev - How to Use the Web Share API](https://love2dev.com/blog/webshare-api/)

### Browser Issue Tracking
- [Mozilla Bug #1312422: Consider experimental support for Web Share API](https://bugzilla.mozilla.org/show_bug.cgi?id=1312422)
- [Firefox Support Bug #1653481](https://bugzilla.mozilla.org/show_bug.cgi?id=1653481)
- [Chromium Support Bug for macOS](https://bugs.chromium.org/p/chromium/issues/detail?id=1144920)

## Known Issues & Considerations

### Firefox Status
Firefox has not yet implemented the Web Share API, though there is ongoing discussion about potential experimental support. Developers should provide fallback sharing mechanisms for Firefox users.

### Platform Coverage
- The API is now widely supported across modern Chromium-based browsers and Safari
- Windows and Chrome OS have the most complete support for Chrome
- iOS Safari has full support starting from version 14
- Android support is comprehensive across major browsers

### Fallback Strategies

For applications needing to support older browsers or Firefox, consider:
1. Detecting API availability with feature detection
2. Providing alternative sharing methods (custom share buttons, mailto links)
3. Gracefully degrading functionality when the API is unavailable
4. Using platforms like share.js or similar libraries for broader compatibility

## Compatibility Notes

- **Requires User Interaction:** The API can only be called in response to user gestures (click, touch)
- **HTTPS Only:** Must be served over HTTPS for security
- **Same-Origin:** Share data should respect same-origin policies
- **Platform-Specific:** Behavior varies depending on available sharing targets on the user's device

## Summary

The Web Share API is a mature specification with excellent browser support across modern platforms. With 89.34% of users able to access the functionality (either fully or partially), it's a practical choice for websites targeting mobile and modern desktop users. The API continues to evolve with specification updates at W3C, and Firefox support remains under consideration.

For new web applications, especially mobile-first PWAs, the Web Share API is recommended as a core sharing mechanism, with appropriate fallback options for older browsers and Firefox.
