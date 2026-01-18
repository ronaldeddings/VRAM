# Push API

## Overview

The Push API enables messages to be sent from a server to a browser, even when the site isn't focused or open in the browser. This capability is essential for delivering notifications to users in real-time, providing a mechanism for web applications to receive server-initiated messages.

## Description

The Push API provides a mechanism for web applications to receive messages that are pushed from a server to the client. These pushed messages are delivered to the browser's notification system, allowing web apps to engage users with timely, relevant information even when the user isn't actively viewing the website. This is particularly useful for news alerts, chat notifications, task reminders, and other time-sensitive information delivery.

## Specification Status

- **Status:** Working Draft (WD)
- **Specification URL:** [W3C Push API](https://w3c.github.io/push-api/)

## Categories

- JavaScript API

## Benefits and Use Cases

### User Engagement
- Notify users of important events in real-time
- Keep users informed without requiring them to actively check the website
- Improve user retention through timely notifications

### Real-Time Applications
- Chat and messaging applications
- Collaborative tools and document editors
- Live event notifications
- Social media updates

### Service Notifications
- System alerts and warnings
- Software update notifications
- Subscription and account notifications
- Appointment and reminder systems

### Business Applications
- E-commerce order updates
- Package delivery tracking
- Calendar event reminders
- Workflow notifications

### Prerequisites for Implementation

To use the Push API, developers must have:
1. A web application with a registered Service Worker
2. A push service endpoint (provided by the browser)
3. A server capable of sending push messages
4. User permission to send notifications

## Browser Support

### Support Legend
- **y** - Supported
- **a** - Partial support (see notes)
- **u** - Unsupported but behind a flag or partial implementation
- **n** - Not supported

### Desktop Browsers

| Browser | First Support | Current Versions | Notes |
|---------|---------------|------------------|-------|
| Chrome | 50 | 50+ Full Support | Stable support since v50 |
| Firefox | 44 | 44+ Full Support | Full support, note #2 applies |
| Safari | 16.1 | 18.0+ Full Support | Partial support from 16.1 as "a", full support from 18.0 |
| Edge | 17 | 17+ Full Support | Partial support from 17, full support from later versions |
| Opera | 37 | 42+ Full Support | Unstable 37-41, full support from 42 |
| Internet Explorer | None | Not Supported | No support in any version |

### Mobile Browsers

| Browser | Support | Notes |
|---------|---------|-------|
| Android Chrome | 50+ | Full support |
| Android Firefox | 44+ | Full support |
| Safari on iOS | 18.0+ | Partial support from 16.4, full support from 18.0 (note #7) |
| Samsung Internet | 4.0+ | Full support from v4 onwards |
| Opera Mobile | 80+ | Full support from v80 |
| UC Browser (Android) | 15.5+ | Full support |
| Opera Mini | None | Not supported |

### Legacy Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| IE 5.5-11 | None | Not supported |
| Android 2.1-4.4.3 | None | Not supported |
| BlackBerry | None | Not supported |
| Mobile IE | None | Not supported |

## Global Usage Statistics

- **Full Support (y):** 82.63% of users
- **Partial Support (a):** 9% of users
- **No Support (n):** ~8.37% of users

## Notes and Limitations

### Note #1 - Partial Data Support (Chrome 44-49)
Partial support in Chrome versions 44-49 refers to not supporting `PushEvent.data` and `PushMessageData`. These versions can receive push notifications but cannot parse the data payload sent with the notification.

### Note #2 - Full Browser Requirement
Requires the full browser to be running to receive messages. Notifications cannot be received if the browser process is completely closed. The browser must be in the background or suspended, but the process must still be active.

### Note #3 - Safari Custom Implementation
Safari 7.0 through 16.0 supported a custom implementation through their Safari Push Notifications system, which remains available in later versions. See the Apple documentation for details:
- [Safari Push Notifications](https://developer.apple.com/notifications/safari-push-notifications/)
- [WWDC 2013 Video on Safari Web Notifications](https://web.archive.org/web/20210419000205/https://developer.apple.com/videos/play/wwdc2013/614/)

### Note #4 - Firefox ESR Exception
The Push API is disabled by default on Firefox ESR (Extended Support Release) branches, but can be re-enabled by setting the following flags in `about:config`:
- `dom.serviceWorkers.enabled` - Enable Service Workers
- `dom.push.enabled` - Enable Push API

### Note #5 - Safari macOS Version Requirement
Push API support on Safari is only available on macOS 13 Ventura or later. Earlier macOS versions do not support the Push API.

### Note #6 - Safari View Controller Limitation
The Push API is supported in Safari proper on macOS, but not in WKWebView or SFSafariViewController components. Web apps embedded in native iOS apps using these view controllers will not have access to the Push API.

### Note #7 - iOS Home Screen Requirement
On iOS, the Push API requires the website to first be added to the Home Screen. Safari web apps that are not installed on the Home Screen cannot receive push notifications.

## Implementation Considerations

### Browser Compatibility Approach

For broad compatibility, implement the following strategy:

1. **Detect Support:** Check for `serviceWorker` in `navigator` and `PushManager` in the global scope
2. **Request Permission:** Use `Notification.requestPermission()` to ask user for notification permission
3. **Register Service Worker:** Register and manage a Service Worker for handling push events
4. **Subscribe to Push:** Use `serviceWorkerRegistration.pushManager.subscribe()` with options
5. **Handle Push Events:** Implement `push` event listener in Service Worker

### Fallback Strategies

For browsers without Push API support:
- Use traditional HTTP polling (less efficient)
- Implement WebSocket connections for real-time updates
- Provide in-app notifications as alternative
- Consider Electron/NW.js for desktop applications

### Security Considerations

- Always use HTTPS for Push API operations
- Implement proper authentication and verification
- Validate push messages on both client and server
- Use VAPID (Voluntary Application Server Identification) protocol
- Respect user privacy and notification preferences

## Related APIs

- **Service Workers API** - Required for handling push notifications
- **Notifications API** - Used to display notifications to users
- **Web Workers** - Support for background operations

## Relevant Links

1. [MDN Web Docs - Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API) - Comprehensive MDN documentation
2. [Google Developers - Push Notifications on the Open Web](https://developers.google.com/web/updates/2015/03/push-notifications-on-the-open-web) - Google's guide to implementing push notifications

## Resources for Developers

### Getting Started
- Ensure your site uses HTTPS
- Register a Service Worker
- Request user permission for notifications
- Use the PushManager API to subscribe

### Testing
- Test across different browsers and devices
- Verify notification delivery with different network conditions
- Test handling of permission denial
- Validate VAPID key implementation

### Performance
- Consider notification frequency and user preferences
- Implement exponential backoff for retry logic
- Monitor delivery success rates
- Optimize payload size

---

*Last Updated: 2024*
*Data Source: Can I Use - Push API Feature Support*
