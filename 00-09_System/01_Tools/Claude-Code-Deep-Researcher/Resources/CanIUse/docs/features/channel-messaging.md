# Channel Messaging

## Overview

**Channel messaging** is a method for establishing two-way communication between browsing contexts using the `MessageChannel` API. This enables direct, efficient communication between workers, iframes, or other related browser contexts without needing to route messages through a shared parent.

### Description
Method for having two-way communication between browsing contexts (using MessageChannel)

---

## Specification Status

| Property | Value |
|----------|-------|
| **Spec Status** | Living Standard |
| **Official Specification** | [HTML Living Standard - Channel Messaging](https://html.spec.whatwg.org/multipage/comms.html#channel-messaging) |
| **Category** | JavaScript API |

---

## Benefits & Use Cases

### Key Benefits
- **Direct Communication**: Establish direct communication channels between browsing contexts without going through a parent window
- **Isolation**: Messages are isolated to the specific channel pair, improving security
- **Bidirectional**: Supports two-way communication for more complex interactions
- **Worker Coordination**: Ideal for coordinating between Web Workers and the main thread
- **Performance**: More efficient than using `postMessage` on shared parents for multiple contexts

### Common Use Cases
- **Web Worker Communication**: Send messages directly between workers and the main thread
- **iframe Communication**: Enable secure, isolated communication between parent and child frames
- **Multi-tab Synchronization**: Coordinate state between multiple browser tabs via Shared Workers
- **Pub/Sub Patterns**: Implement publish/subscribe messaging between components
- **Service Worker Coordination**: Manage communication between service workers and clients
- **Real-time Collaboration**: Support low-latency messaging for collaborative applications

---

## Browser Support

### Summary
Channel Messaging has **excellent browser support** with 93.54% global usage coverage. It's supported in all modern browsers and has been available since early browser versions.

### Desktop Browsers

| Browser | First Full Support | Current Status |
|---------|------------------|----------------|
| **Chrome** | 4 | ✅ Full Support |
| **Firefox** | 41 | ✅ Full Support |
| **Safari** | 5 | ✅ Full Support |
| **Edge** | 12 | ✅ Full Support |
| **Opera** | 10.6 | ✅ Full Support |
| **IE** | 10 | ✅ Full Support (IE 10+) |

### Mobile & Tablet Browsers

| Browser | First Full Support | Current Status |
|---------|------------------|----------------|
| **iOS Safari** | 5.0+ | ✅ Full Support |
| **Android Browser** | 4.4 | ✅ Full Support |
| **Samsung Internet** | 4 | ✅ Full Support |
| **Chrome Mobile** | 4 | ✅ Full Support |
| **Firefox Mobile** | 41 | ✅ Full Support |

### Limited/No Support

| Browser | Status |
|---------|--------|
| **Opera Mini** | ❌ No Support (all versions) |
| **IE 9 and earlier** | ❌ No Support |

---

## Implementation Notes

### Firefox Compatibility
- **Versions 26-40**: Supported behind the `dom.messageChannel.enabled` flag
- **Version 41+**: Fully supported
- **Web Workers Note**: Reported to not work in web workers before version 41

### Feature Maturity
Channel Messaging is a mature and stable feature that has been part of the HTML standard for over a decade. It's safe for production use in modern web applications.

---

## Related Resources

### Official Documentation
- [MDN Web Docs - Channel Messaging API](https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API)
- [HTML Living Standard - Channel Messaging](https://html.spec.whatwg.org/multipage/comms.html#channel-messaging)

### Learning Resources
- [Opera Dev: An Introduction to HTML5 Web Messaging](https://dev.opera.com/articles/view/window-postmessage-messagechannel/#channel)

### Related APIs
- [postMessage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [Service Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

## Quick Example

```javascript
// In main.js
const channel = new MessageChannel();
const port1 = channel.port1;
const port2 = channel.port2;

// Send port2 to a worker
worker.postMessage({ port: port2 }, [port2]);

// Listen for messages from the worker
port1.onmessage = (event) => {
  console.log('Message from worker:', event.data);
};

// Send a message to the worker
port1.postMessage('Hello from main thread');

// In worker.js
self.onmessage = (event) => {
  const port = event.ports[0];

  port.onmessage = (event) => {
    console.log('Message from main:', event.data);
  };

  port.postMessage('Hello from worker');
};
```

---

## Support Coverage

- **Global Usage**: 93.54%
- **Partial Support**: 0%
- **No Support**: 6.46%

This makes Channel Messaging a safe choice for modern web applications targeting current-generation browsers. Always provide fallback patterns for legacy browser support if necessary.
