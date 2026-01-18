# Ping Attribute

## Overview

The **ping attribute** is an HTML5 feature that allows anchor (`<a>`) elements to send ping requests when a link is clicked. When a user clicks a link with the `ping` attribute, the browser sends a POST request to the specified ping endpoint(s), enabling tracking of link clicks for analytics or monitoring purposes.

## Description

When used on an anchor element, the `ping` attribute signifies that the browser should send a ping request to the resource(s) the attribute points to. This provides a way to notify endpoints about link navigation without requiring script-based click handlers.

### Basic Syntax

```html
<a href="https://example.com" ping="https://analytics.example.com/ping">Click me</a>
```

The `ping` attribute can contain one or more space-separated URLs where ping requests should be sent.

```html
<a href="https://example.com" ping="https://endpoint1.com/ping https://endpoint2.com/ping">
  Click me
</a>
```

## Specification Status

- **Status**: Living Standard (ls)
- **Specification**: [WHATWG HTML Standard - Ping Attribute](https://html.spec.whatwg.org/multipage/semantics.html#ping)
- **Note**: While still in the WHATWG specification, this feature was removed from the W3C HTML5 specification in 2010.

## Categories

- HTML5

## Use Cases & Benefits

### Analytics Tracking
- Track outbound link clicks without JavaScript
- Monitor user engagement with external resources
- Reduced performance impact compared to script-based tracking

### User Behavior Analysis
- Understand which links users interact with most
- Measure click-through rates on outbound links
- Gather data for heatmap and user flow analysis

### Server Monitoring
- Notify endpoints about resource access
- Simple way to implement click tracking without client-side code
- Lightweight alternative to full analytics solutions

### Privacy-Conscious Tracking
- Users have control via browser settings
- Can be disabled for privacy-sensitive environments
- Transparent alternative to hidden tracking mechanisms

## Browser Support

### Current Support Status

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | v15 | ✅ Fully Supported | Supported from v15 onwards (v4-14: Unknown) |
| **Edge** | v17 | ✅ Fully Supported | Supported from v17 onwards |
| **Safari** | v6 | ✅ Fully Supported | Supported from v6 onwards |
| **Opera** | v15 | ✅ Fully Supported | Supported from v15 onwards |
| **Firefox** | Never | ❌ Not Supported | Disabled by default for privacy reasons; can be enabled via `browser.send_pings` flag |
| **Internet Explorer** | Never | ❌ Not Supported | No support across all IE versions |
| **Opera Mobile** | v80 | ✅ Supported | Starting from v80 |
| **iOS Safari** | v5.0 | ✅ Fully Supported | Supported from v5.0 onwards |
| **Android Chrome** | v4.4 | ✅ Fully Supported | Supported from v4.4 onwards |
| **Samsung Internet** | v4 | ✅ Fully Supported | Supported from v4 onwards |
| **Opera Mini** | All versions | ❌ Not Supported | No support |
| **Firefox Mobile (Android)** | v144 | ❌ Not Supported | Disabled by default for privacy reasons |

### Detailed Version Support

#### Desktop Browsers

**Chrome/Edge/Opera (Chromium-based)**
- Chrome: v15+ (fully supported)
- Edge: v17+ (fully supported)
- Opera: v15+ (fully supported)

**Safari**
- macOS: v6+ (fully supported)
- iOS: v5.0+ (fully supported)

**Firefox**
- Not supported across all versions (v2-v148+)
- Can be enabled via `browser.send_pings` configuration flag
- Disabled by default for privacy reasons

**Internet Explorer**
- Not supported (v5.5-v11)

#### Mobile Browsers

**Android**
- Android Browser: v4.4+ (fully supported)
- Chrome for Android: v142+ (fully supported)
- Opera Mobile: v80+ (fully supported)
- UC Browser: v15.5+ (supported)
- Samsung Internet: v4+ (fully supported)
- Baidu Browser: v13.52+ (supported)
- QQ Browser: v14.9+ (supported)
- Firefox (Android): v144 (not supported, disabled by default)

**iOS**
- iOS Safari: v5.0+ (fully supported)
- Safari TP (Technical Preview): supported

**Other**
- BlackBerry: Not supported (v7, v10)
- KaiOS: Not supported (v2.5, v3.0-v3.1, disabled by default)
- Opera Mini: Not supported (all versions)

### Global Usage

- **Supported**: 91.02% of global browser usage
- **Partial/Disabled**: 0% (Firefox and some others have it disabled but available)

## Key Notes

### Privacy Considerations

1. **Firefox Implementation**: Firefox supports the ping attribute but has it **disabled by default** for privacy reasons. Users can enable it via the `browser.send_pings` preference flag in `about:config`.

2. **KaiOS Implementation**: Similar to Firefox, KaiOS versions 2.5 and 3.0-3.1 have the feature disabled by default.

3. **User Control**: Since ping requests are sent automatically without explicit user action (beyond clicking a link), browsers have been conservative about enabling this feature to protect user privacy.

### Specification History

- The ping attribute was included in the WHATWG HTML Living Standard
- It was **removed from the W3C HTML5 specification in 2010** due to privacy and security concerns
- Despite removal from W3C, it continues to be supported in most modern browsers and remains in the WHATWG spec

### Request Details

- Ping requests use the HTTP POST method
- Requests are sent with `Content-Type: text/ping` header
- The request body is empty
- Requests include cookies and respect same-origin policies

### Browser Support Summary

| Support Level | Coverage |
|--------------|----------|
| Full Support | Chrome, Edge, Safari, Opera, Android browsers, iOS Safari (91.02% of users) |
| Disabled by Default | Firefox, KaiOS (requires user configuration) |
| No Support | Internet Explorer, Opera Mini, BlackBerry |

## Relevant Links

- **[MDN Web Docs - Element ping attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-ping)** - Comprehensive documentation with examples and detailed browser support information
- **[WHATWG HTML Specification](https://html.spec.whatwg.org/multipage/semantics.html#ping)** - Official specification document

## Implementation Considerations

### When to Use

- Simple outbound link tracking without JavaScript dependencies
- Analytics integration for link click monitoring
- Lightweight monitoring solutions
- When you need to support modern browsers (Chrome, Safari, Edge, Opera, mobile browsers)

### When to Avoid

- Firefox users (if you need guaranteed coverage, as it's disabled by default)
- Privacy-critical applications where users explicitly disable ping tracking
- Complex tracking requirements (use dedicated analytics libraries instead)
- Legacy browser support requirements

### Fallback Strategy

Since Firefox disables this by default and some browsers don't support it, consider:

1. Using dedicated analytics libraries (Google Analytics, Mixpanel, etc.) for full browser coverage
2. Combining ping attribute with JavaScript-based tracking for Firefox users
3. Respecting user privacy settings and providing opt-in mechanisms

## Example Usage

```html
<!-- Simple single endpoint ping -->
<a href="/external-resource" ping="/track/click">
  Visit External Site
</a>

<!-- Multiple ping endpoints -->
<a href="https://example.com" ping="/analytics/click https://partner.com/track">
  Click here
</a>

<!-- Practical analytics example -->
<a href="https://docs.example.com"
   ping="/api/analytics/outbound-link-click">
  Read the Documentation
</a>
```

## Related Features

- **sendBeacon API**: Modern alternative for sending analytics data (`navigator.sendBeacon()`)
- **Beacon Transport**: Standard specification for sending data to servers without blocking page navigation
- **Fetch API**: For more complex tracking scenarios requiring JavaScript
