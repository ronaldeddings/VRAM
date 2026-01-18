# Web Notifications API

## Overview

The Web Notifications API provides a method of alerting users outside of web pages by displaying notifications that do not require direct user interaction. This feature enables web applications to send system-level notifications to users, even when the browser tab is not in focus.

## Description

Web Notifications allow web developers to display system notifications to users asynchronously, providing a way to keep users informed about important events, updates, or messages from web applications. These notifications appear at the operating system level and can persist even after the user has navigated away from the web page.

## Specification Status

- **Status**: Living Standard (ls)
- **Specification URL**: [https://notifications.spec.whatwg.org/](https://notifications.spec.whatwg.org/)

## Categories

- JavaScript API

## Use Cases & Benefits

### Primary Use Cases

- **Real-time Alerts**: Notify users of important events or messages (e.g., new emails, chat messages)
- **Background Updates**: Display system-level notifications for application updates or status changes
- **User Engagement**: Re-engage users with timely and relevant notifications
- **Desktop Integration**: Seamlessly integrate web applications with the operating system's notification system
- **Progressive Web Apps (PWAs)**: Enable native-like notification functionality for web applications

### Key Benefits

- **Non-intrusive**: Notifications appear at the OS level without interrupting the current activity
- **User Control**: Users can manage notification permissions and settings at the browser and OS level
- **Persistent**: Notifications remain visible even when the browser window is minimized or the tab is in the background
- **Rich Media**: Support for titles, descriptions, icons, and badges
- **Interaction Support**: Notifications can include clickable actions and event handling

## Browser Support

### Support Legend

- `Y` - Full support
- `A` - Partial support (see notes for details)
- `N` - No support
- `X` - Browser requires vendor prefix or special implementation

### Desktop Browsers

| Browser | Earliest Support | Current Support | Notes |
|---------|-----------------|-----------------|-------|
| **Chrome** | 22 | Yes (all recent versions) | Versions 5-21 had partial support (a x) with older spec |
| **Firefox** | 22 | Yes (all recent versions up to 148) | Full support since version 22 |
| **Safari** | 6 | Yes (all recent versions) | Support limited to macOS 10.8+ in Safari 6 |
| **Opera** | 25 | Yes (all recent versions up to 122) | Full support since version 25 |
| **Edge** | 14 | Yes (all recent versions up to 143) | Full support since version 14 |
| **Internet Explorer** | Never | Not supported | No support in any version (5.5-11) |

### Mobile Browsers

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Android Chrome** | 142+ | Yes | Requires call via Service Worker registration |
| **Android Firefox** | 144+ | Yes | Full support |
| **iOS Safari** | 16.4+ | Partial (a #3) | Requires website to be added to Home Screen; versions 3.2-16.3 not supported |
| **Opera Mobile** | 80+ | Partial (a x) | Limited support with older spec |
| **Samsung Internet** | 4 | Partial (a x) | Only supports Push API notifications, not Web Notifications API |
| **Android UC Browser** | 15.5+ | Yes | Full support |
| **Opera Mini** | All | No | Not supported |
| **BlackBerry** | 10 | Yes | Full support |
| **KaiOS** | 2.5+ | Yes | Full support |

### Overall Browser Coverage

- **Full Support**: 80.54% of global usage
- **Partial Support**: 9.72% of global usage
- **No Support**: ~9.74% of global usage

## Implementation Notes

### Important Limitations & Bugs

1. **Chrome Older Versions**: Chrome versions 5-21 had partial support using an [older version of the spec](http://www.chromium.org/developers/design-documents/desktop-notifications/api-specification)

2. **Safari 6 macOS Limitation**: Support in Safari 6 is limited to macOS 10.8 and later

3. **Firefox Notification Duration**: Firefox notifications automatically disappear after a few seconds. Reference: [Mozilla Bug #875114](https://bugzilla.mozilla.org/show_bug.cgi?id=875114)

4. **Firefox Sequential Notifications**: Firefox does not support notifications sent immediately one after another. Reference: [Mozilla Bug #1007344](https://bugzilla.mozilla.org/show_bug.cgi?id=1007344)

5. **iOS Safari Home Screen Requirement**: iOS Safari requires the website to be added to the Home Screen before notifications can be displayed

6. **Android Chrome Service Worker**: Chrome for Android requires the notification call to be made with a [Service Worker registration](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API#Service_worker_additions)

7. **Samsung Internet**: Supports notifications via the [Push API](https://caniuse.com/#feat=push-api) but not the Web Notifications API directly

## References & Resources

### Official Documentation

- [MDN Web Docs - Notification API](https://developer.mozilla.org/en-US/docs/Web/API/notification)
- [WHATWG Notifications Specification](https://notifications.spec.whatwg.org/)

### Tutorials & Guides

- [HTML5 Rocks Tutorial](https://www.html5rocks.com/tutorials/notifications/quick/)
- [SitePoint - Introduction to Web Notifications API](https://www.sitepoint.com/introduction-web-notifications-api/)

### Browser Implementation Details

- [Chromium API Design Document](https://www.chromium.org/developers/design-documents/desktop-notifications/api-specification/)

### Interactive Resources

- [Web Notifications API Demo](https://audero.it/demo/web-notifications-api-demo.html)
- [Firefox Add-on for Additional Support](https://addons.mozilla.org/en-us/firefox/addon/221523/)
- [Internet Explorer Plug-in](https://ie-web-notifications.github.io/) - Plugin to enable support in IE

## Quick Start Example

```javascript
// Check if the browser supports notifications
if ('Notification' in window) {
  // Request user permission
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      // Create a new notification
      new Notification('Hello World!', {
        body: 'This is a web notification',
        icon: '/path/to/icon.png',
        badge: '/path/to/badge.png',
        tag: 'notification-1',
        requireInteraction: false
      });
    }
  });
}
```

## Compatibility Checklist

Before using Web Notifications in your project:

- [ ] Check if your target audience uses browsers with full support (80.54% global coverage)
- [ ] Implement fallback notification methods for unsupported browsers
- [ ] Request and handle notification permissions properly
- [ ] Test on iOS Safari if targeting iPhone/iPad users (Home Screen requirement)
- [ ] Use Service Workers for Android Chrome notifications
- [ ] Consider Firefox timing limitations for sequential notifications
- [ ] Provide clear opt-in UX for users to grant permission

## See Also

- [Push API](https://caniuse.com/#feat=push-api) - For server-side push notifications
- [Service Workers API](https://caniuse.com/#feat=serviceworkers) - Required for background notification handling
- [Web App Manifest](https://caniuse.com/#feat=web-app-manifest) - Related to iOS Home Screen installation

---

*Documentation generated from caniuse.com notifications feature data*
