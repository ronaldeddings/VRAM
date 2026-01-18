# Web App Manifest - Add to Home Screen (A2HS)

## Overview

The **Web App Manifest** specification enables developers to configure how their web applications appear and behave when installed as native-like applications on users' devices. This feature allows users to "install" a website and use it as if it was a natively installed app, providing a seamless experience comparable to platform-specific applications.

## Description

The Web App Manifest is a JSON file that provides metadata about your web application. By serving a valid Web App Manifest file and meeting installability criteria, websites can be added to a user's home screen, app drawer, or applications menu. This functionality is a cornerstone of Progressive Web Applications (PWAs) and provides:

- **Install prompts**: Automatic or manual "Add to Home Screen" prompts
- **App metadata**: Name, description, icons, and display modes
- **Launch behavior**: Custom start URLs and display preferences
- **App shortcuts**: Quick actions available in app menus
- **Appearance customization**: Theme colors, background colors, and display modes

## Specification Status

- **Status**: Working Draft (WD)
- **Current Standard**: [W3C App Manifest Specification](https://www.w3.org/TR/appmanifest/)
- **Last Updated**: Ongoing standardization process

## Categories

- HTML5
- Other

## Benefits & Use Cases

### Key Benefits

1. **Enhanced User Experience**
   - Seamless app-like experience without app store friction
   - Faster load times with cached content
   - Offline functionality support
   - Native app icon on home screen

2. **Improved Installation Experience**
   - Browser-native installation flow
   - No need for app store distribution
   - Direct audience reach without intermediaries
   - Reduced friction for user adoption

3. **Better Discoverability**
   - PWA can be indexed and discovered
   - Can appear in app search results
   - Shareable via URLs
   - Reduced barrier to access

4. **Cost Efficiency**
   - Single codebase for all platforms
   - Reduced development and maintenance costs
   - No app store fees or review processes
   - Faster deployment and updates

5. **Business Metrics**
   - Increased engagement with installed apps
   - Better retention rates
   - Offline accessibility
   - Push notification capability (with Service Workers)

### Ideal Use Cases

- **E-commerce sites**: Shop apps with offline browsing
- **Productivity tools**: Task managers, note-taking apps
- **Content platforms**: News sites, blogs, media players
- **Communication apps**: Chat applications, collaboration tools
- **Mobile-first services**: Apps serving primarily mobile users
- **Offline-capable applications**: Maps, reference materials
- **Corporate dashboards**: Enterprise applications
- **Game platforms**: Web-based games with persistent state

## Browser Support

### Support Legend

- **✅ Supported (y)**: Full support for Web App Manifest
- **⚠️ Partial (a)**: Partial support (limited features or experimental)
- **❌ Not Supported (n)**: No support
- **#X**: Denotes special notes (see Notes section)

### Desktop Browsers

| Browser | Version Range | Support | Notes |
|---------|---------------|---------|-------|
| **Chrome** | 39+ | ✅ | Full support from v39 onwards |
| **Edge** | 79+ | ✅ | Full support from v79 onwards |
| **Firefox** | All versions | ❌ | Desktop support experimental (requires flag) |
| **Safari** | 17.0+ | ⚠️ | Partial support on macOS Safari |
| **Opera** | All versions | ❌ | Not currently supported |
| **Internet Explorer** | All versions | ❌ | No support |

### Mobile & Tablet Browsers

| Browser | Version Range | Support | Notes |
|---------|---------------|---------|-------|
| **Chrome Android** | 39+ | ✅ | Full support |
| **Firefox Android** | All versions | ✅ | Full support |
| **Safari iOS** | 11.3+ | ⚠️ | Partial support - does not work in WebViews |
| **Samsung Internet** | 4.0+ | ✅ | Full support |
| **Opera Mobile** | 80+ | ✅ | Full support from v80 onwards |
| **UC Browser** | 15.5+ | ✅ | Full support |
| **Android Browser** | Limited | Limited | Variable support across Android versions |
| **QQ Browser** | 14.9+ | ✅ | Full support |
| **Baidu Browser** | 13.52+ | ✅ | Full support |
| **Opera Mini** | All versions | ❌ | No support |
| **BlackBerry** | All versions | ❌ | No support |
| **KaiOS** | All versions | ❌ | No support |

### Global Browser Support

**Current Global Support**: 80.21% (Full) + 10.08% (Partial) = **90.29% Total**

This indicates strong global support for Web App Manifest across modern browsers, with the primary limitations being Firefox desktop and complete iOS Safari support.

## Detailed Support Breakdown

### Chrome & Chromium-Based Browsers
✅ **Full Support**
- Chrome: v39+
- Edge: v79+
- Opera Mobile: v80+
- Samsung Internet: v4.0+
- UC Browser: v15.5+
- QQ Browser: v14.9+
- Baidu: v13.52+

### Firefox
⚠️ **Limited/Experimental**
- Desktop: Experimental support behind `browser.ssb.enabled` flag (Firefox 76-85)
- Mobile: Full support with Service Worker integration
- Desktop support has been deprioritized but remains under consideration

### Safari
⚠️ **Partial Support**
- **macOS Safari**: v17.0+ (Partial)
- **iOS Safari**: v11.3+ (Partial)
- **Important Limitation**: iOS Safari does not support A2HS in WebViews (in-app browser contexts)
- Third-party WebView apps on iOS may not trigger install prompts

### Legacy & Discontinued
❌ **No Support**
- Internet Explorer (all versions)
- Opera Desktop (all versions)
- Older Android browsers
- BlackBerry browsers
- KaiOS browsers

## Important Notes

### Note #1: Microsoft Edge Store
A manifest could be used to list apps in the Microsoft Store, which would use Edge as a back-end. This provides an additional distribution channel for PWAs on Windows platforms.

### Note #2: Safari iOS WebView Limitations
Safari on iOS does **not** support A2HS in WebViews like Chrome and Firefox. This means:
- Installing from Safari's browser UI: Supported
- Installing from in-app browser contexts: Not supported
- Installing from third-party apps with embedded browsers: Not supported

### Note #3: Firefox Desktop Experimentation
Firefox is experimenting with desktop support behind the `browser.ssb.enabled` flag. Users can enable experimental support through about:config to test PWA functionality on Firefox Desktop.

## Implementation Considerations

### Minimum Requirements for Installation

To enable A2HS functionality, your PWA should:

1. **Serve a valid manifest file** with required properties:
   ```json
   {
     "name": "My Application",
     "short_name": "MyApp",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#ffffff",
     "theme_color": "#000000",
     "icons": [
       {
         "src": "icon-192.png",
         "sizes": "192x192",
         "type": "image/png"
       },
       {
         "src": "icon-512.png",
         "sizes": "512x512",
         "type": "image/png"
       }
     ]
   }
   ```

2. **Link the manifest** in your HTML:
   ```html
   <link rel="manifest" href="/manifest.json">
   ```

3. **Use HTTPS** for all content
4. **Register a Service Worker** for offline functionality
5. **Provide app icons** (192x192px and 512x512px minimum)
6. **Set viewport metadata** for responsive design
7. **Implement installability criteria** as outlined by browser specifications

### Platform-Specific Guidance

**Chrome & Edge (Desktop/Mobile)**
- Fully standards-compliant
- Automatic A2HS prompts when criteria are met
- Manual installation through app menus

**iOS Safari**
- Use Safari app sharing menu
- Standalone mode displays as full-screen app
- Status bar can be customized with meta tags
- Add to Home Screen creates web clip

**Firefox Mobile**
- Manual installation through browser menu
- Full Service Worker support for offline functionality
- Recent versions with improved PWA support

**Samsung Internet**
- Full compliance with latest specs
- Enhanced features on Samsung Galaxy devices
- Excellent performance optimization

## Related Resources

### Official Documentation

- **[MDN Web Docs - Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)**
  Comprehensive documentation covering manifest properties, configuration, and best practices

- **[MDN Web Docs - Add to Home Screen](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen)**
  In-depth guide on implementing A2HS functionality

### Tools & Libraries

- **[PWACompat - Polyfill Library](https://github.com/GoogleChromeLabs/pwacompat)**
  A library that brings Web App Manifest support to non-compliant browsers, providing fallbacks and enhancements

### Browser Bug Tracking

- **[Firefox Desktop Implementation Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1407202)**
  Track the status of Firefox desktop A2HS support

### Installation Criteria

- **[Web.dev - What does it take to be installable?](https://web.dev/install-criteria/)**
  Official Google guide on installability criteria and requirements for PWAs to be installable

## Quick Reference

### Browser Support Summary Table

| Browser Family | Desktop | Mobile | Notes |
|----------------|---------|--------|-------|
| Chromium-based | ✅ Full (79+) | ✅ Full (39+) | Best support, recommended target |
| Firefox | ⚠️ Experimental | ✅ Full | Desktop requires flag |
| Safari | ⚠️ Partial (17+) | ⚠️ Partial (11.3+) | WebView limitations on iOS |
| Legacy (IE, Opera) | ❌ None | ❌ None | No support |

### Recommended Fallback Strategy

1. **Primary**: Use standard Web App Manifest JSON format
2. **Secondary**: Use PWACompat polyfill for older browsers
3. **Tertiary**: Provide alternative installation methods (download links, app store links)
4. **Platform-specific**: iOS users get Safari A2HS options; Android users get Chrome install prompts

### Testing Checklist

- [ ] Manifest.json served with correct MIME type (`application/manifest+json`)
- [ ] Icons are square and meet minimum size requirements (192x192, 512x512)
- [ ] Start URL is specified and accessible
- [ ] HTTPS is enabled site-wide
- [ ] Service Worker is registered and working
- [ ] Manifest is referenced in HTML head
- [ ] Display mode is set (standalone, fullscreen, minimal-ui, or browser)
- [ ] Theme color and background color are defined
- [ ] Test on target browsers (Chrome, Edge, Safari, Firefox)
- [ ] Test on both desktop and mobile devices

---

**Last Updated**: 2025-12-13
**Data Source**: [CanIUse.com](https://caniuse.com)
**Feature ID**: web-app-manifest
