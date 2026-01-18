# Cross-document Messaging

## Overview

Cross-document messaging enables secure communication between pages on different domains using the `postMessage()` API. This allows developers to establish controlled communication channels between iframes, popups, and windows across origin boundaries.

## Description

Method of sending information from a page on one domain to a page on a different one (using `postMessage`). This is a fundamental mechanism for enabling safe cross-origin communication in the browser, allowing windows and frames to exchange messages while maintaining security through origin verification.

## Specification Status

- **Status**: Living Standard (ls)
- **Specification**: [WHATWG HTML Living Standard - Cross-Document Messages](https://html.spec.whatwg.org/multipage/comms.html#crossDocumentMessages)

## Categories

- JavaScript API

## Use Cases & Benefits

### Primary Use Cases

- **Inter-iframe Communication**: Enable communication between parent and child frames across different origins
- **Popup Windows**: Send data to popup windows and retrieve responses
- **Third-party Widgets**: Safely integrate widgets and embedded content from external domains
- **Data Synchronization**: Sync state between multiple tabs or windows of the same application
- **Messaging Between Services**: Enable secure communication between main application and service workers
- **Analytics & Tracking**: Send analytics data from embedded content to parent domain
- **Authentication Flows**: Handle OAuth and SSO flows across domain boundaries

### Key Benefits

- **Origin Security**: Built-in origin verification prevents unauthorized cross-origin access
- **Transferable Objects**: Support for structured cloning of complex objects
- **Reliable Delivery**: Guaranteed message delivery with proper event handling
- **Backward Compatible**: Wide browser support across all modern and legacy browsers
- **Simple API**: Straightforward API for both sending and receiving messages
- **No Server Required**: Pure client-side communication without backend involvement

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| **Chrome** | Yes | Version 4+ |
| **Firefox** | Yes | Version 3+ (strings only in 6 and below) |
| **Safari** | Yes | Version 4+ (iOS Safari 3.2+) |
| **Edge** | Yes | Version 12+ (all versions) |
| **Opera** | Yes | Version 9.5+ |
| **Internet Explorer** | Partial | IE 8-9: strings only; IE 10-11: limitations in certain conditions |
| **iOS Safari** | Yes | Version 3.2+ |
| **Android Browser** | Yes | Version 2.1+ |
| **Opera Mobile** | Yes | Version 10+ |
| **Android Chrome** | Yes | Version 4+ |
| **Android Firefox** | Yes | Latest versions |
| **Samsung Internet** | Yes | Version 4+ |

### Support Summary

- **Full Support**: 93.31% of users
- **Partial Support**: 0.42% of users (older Internet Explorer versions)
- **No Support**: < 1% of users

## Known Issues & Limitations

### IE 8-9 Limitations
- Only support strings as `postMessage`'s message parameter
- Objects cannot be sent using `postMessage`
- Partial support refers to working in frames/iframes only (not other tabs/windows)

**References**:
- [Opera Developer Articles - window.postMessage](https://dev.opera.com/articles/view/window-postmessage-messagechannel/#crossdoc)
- [MDN - window.postMessage](https://developer.mozilla.org/en-US/docs/DOM/window.postMessage)

### IE 8 Synchronous Events
- Events are triggered synchronously, which may lead to unexpected results
- Can cause stack overflow or blocking behavior in some scenarios

### IE 10-11 Conditional Limitations
- Partial support refers to [limitations in certain conditions](https://stackoverflow.com/questions/16226924/is-cross-origin-postmessage-broken-in-ie10)
- May require additional workarounds for cross-origin scenarios

### Firefox 41 and Below
- Does not support sending File/Blob objects
- [Mozilla Bug #722126](https://bugzilla.mozilla.org/show_bug.cgi?id=722126)

## Implementation Guide

### Basic Usage

#### Sending a Message

```javascript
// Send a message to a child iframe
const targetWindow = document.getElementById('myFrame').contentWindow;
targetWindow.postMessage({
  type: 'greeting',
  message: 'Hello from parent!'
}, 'https://example.com');
```

#### Receiving a Message

```javascript
// Listen for messages
window.addEventListener('message', (event) => {
  // Always verify the origin
  if (event.origin !== 'https://trusted-domain.com') {
    return; // Ignore messages from untrusted origins
  }

  console.log('Received message:', event.data);

  // Send a response
  event.source.postMessage({
    type: 'response',
    message: 'Thanks for the message!'
  }, event.origin);
});
```

### Security Best Practices

1. **Always Verify Origin**: Check `event.origin` before processing messages
2. **Validate Message Data**: Ensure received data matches expected structure
3. **Use Specific Origins**: Avoid using `*` as target origin in production
4. **Serialize Data**: Convert complex objects to JSON for reliable transmission
5. **Handle Errors**: Implement proper error handling for message failures

### Transferable Objects

Modern browsers support transferring certain objects with improved performance:

```javascript
// Transfer an ArrayBuffer without copying
const buffer = new ArrayBuffer(256);
targetWindow.postMessage({
  type: 'data',
  buffer: buffer
}, 'https://example.com', [buffer]); // buffer is now transferred, not copied
```

## Related Resources

### Official Documentation
- [MDN Web Docs - window.postMessage](https://developer.mozilla.org/en/DOM/window.postMessage)
- [WebPlatform Docs - MessagePort.postMessage](https://webplatform.github.io/docs/apis/web-messaging/MessagePort/postMessage)

### Examples & Demos
- [HTML5 Demos - postMessage Example](https://html5demos.com/postmessage2)

### Feature Detection
- [has.js - native-crosswindowmessaging](https://raw.github.com/phiggins42/has.js/master/detect/features.js#native-crosswindowmessaging)

## Feature Detection

```javascript
// Check if postMessage is available
if (window.postMessage) {
  console.log('postMessage is supported');
} else {
  console.log('postMessage is not supported');
}
```

## Polyfills & Alternatives

For older browsers without `postMessage` support, consider:

1. **Server-side Relay**: Use backend server to relay messages between windows
2. **URL Hash Fragment**: Use window.location.hash for limited cross-window communication
3. **Window.name**: Use window.name for limited data transmission
4. **Graceful Degradation**: Provide alternative communication methods for unsupported browsers

## Related APIs

- **MessageChannel**: Enable two-way communication between windows
- **Worker.postMessage()**: Communication with Web Workers
- **SharedWorker.port.postMessage()**: Communication with Shared Workers
- **Service Worker Messages**: Communication with Service Workers

## See Also

- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Message Channel API](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel)
- [Structured Clone Algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)

---

**Last Updated**: 2024
**Can I Use Profile**: [Cross-document messaging](https://caniuse.com/x-doc-messaging)
