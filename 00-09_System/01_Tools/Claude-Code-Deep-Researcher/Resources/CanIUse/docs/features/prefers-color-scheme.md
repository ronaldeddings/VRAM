# prefers-color-scheme Media Query

## Overview

The `prefers-color-scheme` CSS media query detects if the user has set their system to use a light or dark color theme. This feature enables developers to create interfaces that automatically adapt to the user's preferred color scheme without requiring explicit user interaction.

## Description

The `prefers-color-scheme` media query allows web developers to detect and respond to the user's system-level color theme preference. When a user sets their operating system to light or dark mode, websites can automatically adjust their styling to match, providing a more cohesive and comfortable viewing experience.

This feature is particularly valuable for:
- Reducing eye strain by respecting user accessibility preferences
- Matching the operating system's visual language
- Providing consistent theming across web and native applications
- Improving battery life on devices with OLED screens (dark mode uses less power)

## Specification Status

**Status:** Working Draft (WD)

**Specification:** [CSS Media Queries Level 5](https://w3c.github.io/csswg-drafts/mediaqueries-5/#prefers-color-scheme)

## Categories

- CSS

## Benefits & Use Cases

### User Experience Improvements
- **Accessibility**: Respects user preferences for visual comfort and reduces eye strain
- **Consistency**: Aligns web interfaces with system-wide theme settings
- **Battery Efficiency**: Dark mode reduces power consumption on OLED displays
- **Modern UI**: Meets user expectations for theme support

### Developer Advantages
- **Progressive Enhancement**: Easy to implement alongside existing stylesheets
- **Graceful Fallback**: Works with default styles if dark mode isn't needed
- **Selective Application**: Target specific components or entire themes
- **Performance**: No JavaScript required for basic theme switching

### Common Applications
- Complete website theming (light/dark mode variants)
- Conditional image or icon selection
- Adjusting color schemes for charts and data visualization
- Optimizing backgrounds and text colors for readability

## Browser Support

The following table shows browser support for the `prefers-color-scheme` media query:

### Desktop Browsers

| Browser | First Supported Version | Current Status |
|---------|------------------------|----------------|
| Chrome | 76 | ✅ Supported |
| Edge | 79 | ✅ Supported |
| Firefox | 67 | ✅ Supported |
| Safari | 12.1 | ✅ Supported |
| Opera | 62 | ✅ Supported |
| Internet Explorer | None | ❌ Not Supported |

### Mobile Browsers

| Browser | First Supported Version | Current Status |
|---------|------------------------|----------------|
| Safari iOS | 13.0 | ✅ Supported |
| Chrome Android | 76 | ✅ Supported |
| Firefox Android | 67 | ✅ Supported |
| Samsung Internet | 12.0 | ✅ Supported |
| Opera Mobile | 80 | ✅ Supported |
| Android Browser | 142 | ✅ Supported |
| Opera Mini | None | ❌ Not Supported |

### Legacy/Unsupported Browsers

- Internet Explorer (all versions)
- Opera Mini (all versions)
- Older Android versions (< 4.4.3)
- BlackBerry (all versions)

## Usage Statistics

- **Global Support:** 92.62% of users have browsers that support `prefers-color-scheme`
- **No Partial Support:** This feature is either supported or not; there is no partial implementation status

## Implementation Examples

### Basic Dark Mode Support

```css
/* Default (light) theme */
body {
  background-color: #ffffff;
  color: #000000;
}

/* Dark mode preference */
@media (prefers-color-scheme: dark) {
  body {
    background-color: #1a1a1a;
    color: #ffffff;
  }
}
```

### Conditional Image Selection

```css
@media (prefers-color-scheme: light) {
  .logo {
    content: url('logo-light.svg');
  }
}

@media (prefers-color-scheme: dark) {
  .logo {
    content: url('logo-dark.svg');
  }
}
```

### Color Scheme Meta Tag (Optional HTML Support)

```html
<!-- Indicates support for both light and dark color schemes -->
<meta name="color-scheme" content="light dark" />
```

## Important Notes

**Support Dependency:** Support will also depend on whether or not the operating system has support for a light/dark theme preference. For example, older operating systems that don't natively support dark mode preferences cannot communicate this preference to the browser.

**System-Level Control:** This media query respects the user's system settings. Users can typically change their preference through:
- OS Settings (Windows Settings, macOS System Preferences, etc.)
- Browser Settings (in some browsers)
- Accessibility preferences

## Related Resources

### Official Documentation
- [MDN Web Docs: prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [Web.dev Article on prefers-color-scheme](https://web.dev/prefers-color-scheme/)

### Implementation Tracking
- [Firefox Implementation Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1494034)
- [Chromium Implementation Issue](https://bugs.chromium.org/p/chromium/issues/detail?id=889087)

## Accessibility Considerations

The `prefers-color-scheme` media query is an important accessibility feature because:

1. **Visual Accessibility**: Allows users with light sensitivity or visual impairments to use their preferred color scheme
2. **Cognitive Load**: Reduces eye strain and cognitive load for extended browsing sessions
3. **Motor Accessibility**: Eliminates the need for users to manually switch themes through UI controls
4. **Inclusive Design**: Respects user autonomy and OS-level accessibility preferences

## Recommendations

- **Always Provide Defaults**: Ensure your default stylesheet works well before adding dark mode styles
- **Test Both Modes**: Verify sufficient contrast ratios in both light and dark modes (WCAG standards)
- **Respect User Choice**: Honor the system preference without forcing a theme on users
- **Graceful Degradation**: Older browsers will use the default styles, which should remain fully functional
- **Additional Control**: Consider offering a manual theme toggle for users who want to override system preferences

---

**Last Updated:** 2025
**Feature ID:** chrome-5109758977638400
