# prefers-reduced-motion Media Query

## Overview

The `prefers-reduced-motion` CSS media query allows developers to detect and respect user preferences for reducing motion and animations on web pages. This feature is essential for creating accessible web experiences for users who experience motion sensitivity or vestibular disorders.

## Description

CSS media query that detects whether a user has requested the system to minimize the amount of motion and animation used. When a user enables the "Reduce Motion" or equivalent accessibility setting in their operating system, the `prefers-reduced-motion` media query will match, allowing developers to provide alternative animations or disable motion-based interactions entirely.

## Specification

- **Status**: Working Draft (WD)
- **Specification URL**: [W3C Media Queries Level 5](https://w3c.github.io/csswg-drafts/mediaqueries-5/#prefers-reduced-motion)
- **Specification Status**: Active Development

## Categories

- CSS
- Accessibility
- Media Queries
- User Preferences

## Benefits and Use Cases

### Accessibility Improvements

- **Vestibular Disorder Support**: Helps users with balance and spatial orientation issues
- **Motion Sickness Prevention**: Reduces triggers for users prone to motion-induced nausea
- **Cognitive Accessibility**: Beneficial for users with ADHD or other attention-related conditions
- **General User Comfort**: Respects individual preferences for web experience

### Practical Applications

- Disable auto-playing animations and transitions
- Reduce parallax scrolling effects
- Replace sliding animations with instant visibility changes
- Minimize flashing or rapid visual changes
- Disable auto-incrementing carousels
- Simplify interactive animations and hover states

### Implementation Example

```css
/* Default animations */
.button {
  transition: all 0.3s ease-in-out;
}

.button:hover {
  transform: scale(1.1);
}

/* Respect user preference */
@media (prefers-reduced-motion: reduce) {
  .button {
    transition: none;
  }

  .button:hover {
    transform: none;
  }
}
```

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| **Chrome** | 74+ | Yes |
| **Edge** | 79+ | Yes |
| **Firefox** | 63+ | Yes |
| **Safari** | 10.1+ | Yes |
| **Opera** | 64+ | Yes |
| **Safari iOS** | 10.3+ | Yes |
| **Chrome Android** | 142+ | Yes |
| **Firefox Android** | 144+ | Yes |
| **Opera Mobile** | 80+ | Yes |
| **Samsung Internet** | 11.1+ | Yes |
| **UC Browser** | 15.5+ | Yes |
| **Opera Mini** | All | No |
| **Baidu** | 13.52+ | Yes |
| **QQ Browser** | 14.9+ | Yes |
| **KaiOS** | 3.0+ | Yes |
| **Internet Explorer** | All versions | No |

### Global Usage Statistics

- **Full Support**: 92.92% of users
- **Partial Support**: 0%
- **No Support**: 7.08% of users

## Browser Support Details

### Desktop Browsers

- **Chrome**: Supported since version 74 (May 2019)
- **Firefox**: Supported since version 63 (October 2018)
- **Safari**: Supported since version 10.1 (March 2016)
- **Edge (Chromium)**: Supported since version 79 (January 2020)
- **Opera**: Supported since version 64 (October 2018)

### Mobile Browsers

- **iOS Safari**: Supported since version 10.3 (March 2016)
- **Android Browser**: Limited historical support; Chrome on Android supports it
- **Samsung Internet**: Supported since version 11.1 (2019)
- **Firefox Mobile**: Supported since version 63 (October 2018)
- **Opera Mobile**: Supported since version 80 (December 2019)

### Unsupported Browsers

- Internet Explorer (all versions)
- Opera Mini (all versions)

## Implementation Considerations

### OS-Level Dependency

The `prefers-reduced-motion` media query depends on the operating system's accessibility settings. The browser queries the OS for the user's motion preferences:

- **macOS/iOS**: "Reduce motion" in System Preferences → Accessibility → Display
- **Windows**: "Show animations" toggle in Settings → Ease of Access → Display
- **Android**: "Remove animations" in Developer Options or Accessibility settings
- **Linux**: Varies by desktop environment

### Progressive Enhancement Strategy

Use progressive enhancement to ensure functionality works for all users:

```css
/* Base styles with motion */
.sidebar {
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
}

.sidebar.open {
  transform: translateX(0);
}

/* Respect user preference - instantly show/hide */
@media (prefers-reduced-motion: reduce) {
  .sidebar {
    transition: none;
  }
}
```

### JavaScript Detection

You can also detect the preference in JavaScript using the `matchMedia` API:

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Disable animations in JavaScript
  element.style.transition = 'none';
} else {
  // Enable animations
  element.style.transition = 'all 0.3s ease-in-out';
}
```

### Listen for Preference Changes

```javascript
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

mediaQuery.addEventListener('change', (event) => {
  if (event.matches) {
    // User now prefers reduced motion
  } else {
    // User no longer prefers reduced motion
  }
});
```

## Accessibility Best Practices

1. **Always Provide an Alternative**: Never rely solely on motion to communicate information
2. **Test with Real Users**: Verify that reduced-motion versions work properly
3. **Respect the Preference**: Don't override the user's accessibility choice with JavaScript
4. **Animate Responsibly**: Even without `prefers-reduced-motion`, minimize unnecessary animations
5. **Include Other Preferences**: Consider combining with other media queries like `prefers-color-scheme`

## Related Resources

### Official Specifications and Documentation

- [W3C Media Queries Level 5 Specification](https://w3c.github.io/csswg-drafts/mediaqueries-5/#prefers-reduced-motion)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

### Articles and Guides

- [WebKit Blog: Responsive Design for Motion](https://webkit.org/blog/7551/responsive-design-for-motion/)
- [CSS Tricks: Introduction to the prefers-reduced-motion Media Query](https://css-tricks.com/introduction-reduced-motion-media-query/)
- [Web Accessibility Initiative: Animation from Motion](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions)

### Tools and Testing

- [Can I use - prefers-reduced-motion](https://caniuse.com/#feat=prefers-reduced-motion)
- Browser DevTools for testing motion preferences
- Accessibility testing tools and screen readers

## Notes

- The `prefers-reduced-motion` media query depends on the operating system whether it is supported
- Not all users with motion sensitivity will have enabled this setting; always minimize motion by default
- This feature is part of the broader accessibility movement to make the web more inclusive
- Support is widespread among modern browsers, making it safe to implement as a progressive enhancement

## Related Media Queries

- `prefers-color-scheme`: Detects if user prefers light or dark color scheme
- `prefers-contrast`: Detects if user prefers higher or lower contrast
- `prefers-color-scheme`: Detects user's color scheme preference
- `forced-colors`: Detects if browser is in forced colors mode

## Browser Compatibility Summary

| Category | Status |
|----------|--------|
| **Desktop** | Excellent (All modern browsers) |
| **Mobile** | Excellent (All modern mobile browsers) |
| **Legacy** | Poor (IE not supported) |
| **Overall** | ~93% user coverage |

---

**Last Updated**: 2025
**Feature Status**: Stable in modern browsers
**Recommended Use**: Yes, implement as a progressive enhancement for accessibility
