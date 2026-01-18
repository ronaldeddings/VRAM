# Theme-Color Meta Tag

## Overview

The `theme-color` meta tag is an HTML meta element that allows developers to define a suggested color that browsers should use to customize the display of a page or the surrounding user interface. This color is commonly used to tint browser chrome elements like address bars, status bars, and app switchers on mobile devices.

## Description

The `theme-color` meta tag provides a standardized way to suggest a theme color for your web application. When implemented, browsers that support this feature will apply the specified color to UI elements associated with the page, creating a more cohesive and branded user experience.

The meta tag overrides any theme-color value that might be set in the web app manifest file, giving developers direct control over the color on a per-page basis.

### Common Use Cases

- **Mobile Browser UI Theming**: Customize the address bar and status bar color on mobile browsers
- **Progressive Web Apps (PWAs)**: Provide consistent branding across installed PWAs
- **Brand Consistency**: Match the theme color to your application's primary brand color
- **Dark Mode Support**: Respond to user preferences by adjusting the theme color dynamically
- **Page-Specific Branding**: Apply different theme colors to different sections of your application

## Specification Status

**Status**: Living Standard (ls)

The `theme-color` meta tag is defined in the [HTML Living Standard](https://html.spec.whatwg.org/multipage/semantics.html#meta-theme-color) maintained by the Web Hypertext Application Technology Working Group (WHATWG).

## Categories

- DOM
- Other

## Browser Support

### Support Legend
- **y** (Yes): Feature is supported
- **a** (Partial/With notes): Feature is supported with limitations or caveats
- **n** (No): Feature is not supported
- **u** (Unknown): Support status is unknown

### Desktop Browsers

| Browser | Support | Version Range | Notes |
|---------|---------|---------------|-------|
| **Chrome** | Partial | 73+ | Desktop Chrome only uses the color on installed progressive web apps |
| **Edge** | No | All versions | No support |
| **Firefox** | No | All versions | Implementation in progress (see linked bug) |
| **Safari** | Yes | 15+ | Full support from version 15 onwards |
| **Opera** | No | All versions | No support |

### Mobile Browsers

| Browser | Support | Version Range | Notes |
|---------|---------|---------------|-------|
| **Chrome (Android)** | Partial | 73+ | Does not use the color on devices with native dark-mode enabled unless it's an installed PWA or trusted web activity |
| **Firefox (Android)** | No | All versions | No support |
| **Safari (iOS)** | Yes | 15.0+ | Full support from iOS 15 onwards |
| **Samsung Internet** | Yes | 6.2+ | Full support from version 6.2 onwards |
| **Opera Mobile** | No | All versions | No support |
| **Opera Mini** | No | All versions | No support |

### Other Platforms

| Browser | Support | Notes |
|---------|---------|-------|
| **Internet Explorer** | No | No support in any version |
| **Vivaldi** | Yes | Chromium-based browser with full support |
| **Firefox OS** | Yes | Supported (now discontinued platform) |

### Usage Statistics

- **Full Support (y)**: 10.65% of users
- **Partial Support (a)**: 71.62% of users
- **No Support (n)**: 17.73% of users

## Implementation

### Basic HTML Syntax

```html
<meta name="theme-color" content="#1abc9c">
```

### Attributes

- **name**: Must be set to `"theme-color"`
- **content**: The color value specified as:
  - Hex color code (e.g., `#1abc9c`, `#fff`)
  - RGB notation (e.g., `rgb(26, 188, 156)`)
  - Named colors (e.g., `blue`, `red`)

### Advanced Example with Media Query Support

For dynamic theme colors based on user preferences (modern browsers):

```html
<!-- Light mode theme color -->
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">

<!-- Dark mode theme color -->
<meta name="theme-color" content="#1a1a1a" media="(prefers-color-scheme: dark)">
```

### JavaScript Manipulation

Update the theme color dynamically:

```javascript
// Get the current meta tag
let meta = document.querySelector('meta[name="theme-color"]');

// Update the color
if (meta) {
  meta.setAttribute('content', '#ff5733');
} else {
  // Create it if it doesn't exist
  meta = document.createElement('meta');
  meta.name = 'theme-color';
  meta.content = '#ff5733';
  document.head.appendChild(meta);
}
```

## Key Features & Benefits

### 1. **Enhanced Visual Consistency**
Creates a seamless visual experience by extending your brand color into the browser UI.

### 2. **Improved User Experience**
- Reduces visual jarring when switching between app and browser UI
- Makes the application feel more native and polished
- Creates visual continuity across the browsing experience

### 3. **Brand Recognition**
Reinforces your brand identity by displaying your primary brand color in all applicable contexts.

### 4. **Progressive Enhancement**
Works great in supported browsers while gracefully degrading in unsupported ones with no negative effects.

### 5. **Easy Implementation**
Simple HTML meta tag with minimal overhead and no JavaScript required for basic usage.

### 6. **Per-Page Customization**
Can be changed on a per-page basis to suit different sections of your application.

### 7. **PWA Integration**
Particularly valuable for progressive web apps where it creates a more native app-like experience.

## Important Notes & Limitations

### Platform-Specific Behavior

**Note #1**: Desktop Chrome only uses the color on installed progressive web apps.
- The feature has limited utility on the desktop web
- Most impactful for PWA installations

**Note #2**: Desktop Chrome 39-72 claimed support but did not actually use the color anywhere.
- Chrome for Android did use the color in the toolbar during this period
- Support became consistent in later versions

**Note #3**: Chrome for Android does not use the color on devices with native dark-mode enabled unless it's an installed PWA or trusted web activity.
- Respects system dark mode preferences
- May override the meta tag color on devices with dark mode enabled

**Note #4**: Safari support is limited to installed web apps.
- Only applies the color when the page is saved to the home screen
- Does not affect standard browsing

**Note #5**: iOS Safari behavior differs between standard browsing and installed web apps.
- Some versions support the color for installed apps only
- Versions 15+ provide better overall support

### Manifest File Precedence

The `theme-color` meta tag overrides the `theme_color` property in the web app manifest file. If both are present, the meta tag takes precedence.

### Color Format Support

While standard CSS color formats are generally supported, it's recommended to use:
- Hex colors (most reliable): `#1abc9c`
- RGB notation: `rgb(26, 188, 156)`
- Avoid named colors for better consistency

### Dark Mode Considerations

For optimal UX with dark mode users:
- Use media queries to provide different colors based on `prefers-color-scheme`
- Consider the contrast ratio between the theme color and UI elements
- Test on devices with native dark mode enabled

## Practical Examples

### Example 1: Simple Brand Color

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#2196F3">
  <title>My Application</title>
</head>
<body>
  <!-- content -->
</body>
</html>
```

### Example 2: Responsive Theme Color for Dark Mode

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Light mode -->
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">

  <!-- Dark mode -->
  <meta name="theme-color" content="#1a1a1a" media="(prefers-color-scheme: dark)">

  <title>My Application</title>
</head>
<body>
  <!-- content -->
</body>
</html>
```

### Example 3: Dynamic Theme Color with PWA Support

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#3498db" id="theme-color-meta">
  <link rel="manifest" href="/manifest.json">
  <title>My Progressive Web App</title>
</head>
<body>
  <script>
    // Update theme color based on time of day or user preference
    function updateThemeColor(color) {
      const meta = document.getElementById('theme-color-meta');
      meta.setAttribute('content', color);
    }

    // Example: Change color based on time of day
    const hour = new Date().getHours();
    const color = hour >= 18 || hour < 6 ? '#1a1a1a' : '#3498db';
    updateThemeColor(color);
  </script>
</body>
</html>
```

## Recommended Implementation Checklist

- [ ] Add `theme-color` meta tag to main HTML template
- [ ] Use your primary brand color
- [ ] Add media query variants for dark mode support
- [ ] Test on actual mobile devices and browsers
- [ ] Verify color displays correctly on both iOS and Android
- [ ] Check appearance in PWA mode (installed to home screen)
- [ ] Document the chosen color in your design system
- [ ] Update the color dynamically if your app supports user-selectable themes

## Related Features

- **Web App Manifest**: `theme_color` property in `manifest.json`
- **prefers-color-scheme**: CSS media query for dark mode detection
- **Progressive Web Apps (PWAs)**: Enhanced experience for installed apps
- **Status Bar Style**: Meta tag for controlling status bar appearance on older devices

## Resources & Links

### Official Specification
- [HTML Living Standard - Meta theme-color](https://html.spec.whatwg.org/multipage/semantics.html#meta-theme-color)

### Browser Implementation Resources
- [Firefox for Android Implementation Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1098544)
- [Google Developers - Support for theme-color in Chrome 39 for Android](https://developers.google.com/web/updates/2014/11/Support-for-theme-color-in-Chrome-39-for-Android?hl=en)

### Related Documentation
- [Web App Manifest Specification](https://www.w3.org/TR/appmanifest/)
- [CSS Media Queries Level 5 - Prefers Color Scheme](https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme)
- [Progressive Web Apps Overview](https://developers.google.com/web/progressive-web-apps)

### Testing Tools
- Chrome DevTools: Inspect and modify meta tags in real-time
- Android Device: Test on physical devices for most accurate results
- iOS Device: Test PWA installation on iPhone/iPad
- Chrome DevTools Mobile Emulation: Simulate mobile browser behavior

## Browser-Specific Implementation Notes

### Chrome/Chromium
- Best support on Android devices
- PWA support on desktop (limited)
- Respects dark mode on devices with native dark mode
- Consider trusted web activity for consistent behavior

### Safari/iOS
- Supports iOS 15+
- Works well with PWA installations
- Good dark mode support in recent versions
- Test on actual devices for best results

### Firefox
- No support for desktop or mobile
- Consider progressive enhancement strategy
- May receive support in future versions (see linked bug)

## Compatibility Considerations

### Graceful Degradation
The `theme-color` meta tag is safe to include on all pages:
- Browsers that don't support it simply ignore it
- No negative side effects in unsupported browsers
- Safe to use for progressive enhancement

### Fallback Strategy
Since support varies by browser and platform:
1. Include the meta tag as enhancement for supported browsers
2. Don't rely on it for critical functionality
3. Provide good UX regardless of theme color support
4. Test on multiple devices and browsers

## Performance Considerations

- Zero performance impact (simple HTML meta tag)
- No render-blocking
- No JavaScript required for basic implementation
- Dynamic updates via JavaScript have minimal performance cost

## Accessibility Notes

- Ensure sufficient contrast between theme color and UI text
- Consider WCAG contrast requirements
- Test with assistive technologies
- Avoid relying solely on color for critical information
- Provide dark mode variants for users with dark mode preferences

---

**Last Updated**: December 2024
**Specification Version**: WHATWG Living Standard
**CanIUse Data**: Latest (as of documentation creation)
