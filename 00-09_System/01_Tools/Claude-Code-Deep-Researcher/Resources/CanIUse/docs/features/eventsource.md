# Server-Sent Events (EventSource)

## Overview

**Server-Sent Events (SSE)** is a web standard that enables servers to push data to browsers in real-time using the `EventSource` interface. Instead of the traditional request-response model where clients repeatedly poll the server for updates, SSE allows servers to continuously send data to connected clients over a single HTTP connection.

## Description

Server-Sent Events provide a method for continuously streaming data from a server to the browser, rather than requiring the client to repeatedly request it. This is implemented through the `EventSource` interface, which was originally part of the HTML5 specification and is now maintained as part of the WHATWG HTML specification.

## Specification

- **Specification URL**: [WHATWG HTML - Server-Sent Events](https://html.spec.whatwg.org/multipage/comms.html#server-sent-events)
- **Status**: Living Standard (ls)
- **Standardization**: WHATWG HTML Standard

## Categories

- **JavaScript API**

## Key Benefits & Use Cases

### Benefits
- **Efficient Data Streaming**: Reduces overhead compared to polling or WebSockets for unidirectional communication
- **Automatic Reconnection**: Built-in reconnection logic handles connection interruptions automatically
- **Simple API**: Easy to implement and understand compared to WebSocket complexity
- **Server Push**: True server-to-client push without client requests
- **Cross-Domain Support**: CORS support enables cross-origin server-sent events
- **Event-Based**: Natural event-driven architecture with custom event types
- **Backward Compatibility**: Works with HTTP/1.1 and HTTP/2

### Use Cases
- **Live Notifications**: Real-time system alerts and notifications
- **Live Data Updates**: Stock prices, sports scores, weather updates
- **Chat Applications**: Message delivery and presence updates
- **Collaborative Tools**: Real-time collaboration and synchronization
- **Activity Feeds**: Live feed updates and activity streams
- **Monitoring Dashboards**: Real-time metrics and performance monitoring
- **Analytics**: Live event streaming and analytics
- **Progress Updates**: Download/upload progress and long-running task updates

## Browser Support

| Browser | Initial Support | Current Status | Notes |
|---------|-----------------|----------------|-------|
| **Internet Explorer** | All versions | ❌ Not Supported | IE 5.5 - 11 do not support EventSource |
| **Edge (Chromium)** | Edge 79 (2020) | ✅ Fully Supported | Full support from version 79 onwards |
| **Firefox** | Firefox 6 (2011) | ✅ Fully Supported | Support since version 6, with bug fixes in v36+ and v52+ |
| **Chrome** | Chrome 6 (2010) | ✅ Fully Supported | Full support since version 6 |
| **Safari** | Safari 5 (2010) | ✅ Fully Supported | Support from version 5 onwards |
| **Opera** | Opera 11 (2011) | ✅ Fully Supported | Partial support in v9-10.6 (marked as alternate), full support from v11 |
| **iOS Safari** | iOS 4.0+ | ✅ Fully Supported | Support from iOS 4.0 onwards |
| **Android Browser** | Android 4.4 (2013) | ✅ Fully Supported | Support from Android 4.4+ |
| **Opera Mini** | All versions | ❌ Not Supported | No support across all versions |
| **Mobile Browsers** | Varies | ✅ Mostly Supported | Samsung Internet, Firefox Mobile, Chrome Mobile all support |

### Support Summary by Browser Family

- **Chromium-based**: Chrome, Edge, Opera, Brave, and other Chromium derivatives - Full support
- **Firefox**: Full support since version 6
- **WebKit**: Safari (desktop and iOS) - Full support since version 5
- **Legacy**: Internet Explorer - No support

### Global Usage

- **Global Usage with Support**: 93.26%
- **Alternate Support**: 0%
- **No Support**: Approximately 6.74% of users

## Implementation Notes

### CORS Support
Cross-Origin Resource Sharing (CORS) in EventSource is supported in:
- Firefox 10+
- Opera 12+
- Chrome 26+
- Safari 7.0+

### Known Issues & Limitations

1. **Firefox Auto-Reconnection (Fixed in v36)**
   - Firefox versions prior to 36 do not reconnect automatically in case of connection interrupts
   - Reference: [Mozilla Bug #831392](https://bugzilla.mozilla.org/show_bug.cgi?id=831392)

2. **Service Worker Support (Fixed in Firefox v133)**
   - EventSource in service workers not supported in Firefox prior to version 133
   - Reference: [Mozilla Bug #1681218](https://bugzilla.mozilla.org/show_bug.cgi?id=1681218)

3. **Web/Shared Worker Support (Fixed in Firefox v52+)**
   - Firefox 52 and below do not support EventSource in web/shared workers
   - Reference: [Mozilla Bug #1267903](https://bugzilla.mozilla.org/show_bug.cgi?id=1267903)

4. **Antivirus Interference**
   - Some antivirus software may block event streaming data chunks
   - Consider server-side buffering or alternative mechanisms if needed

## Common Code Example

### Server-Side (Node.js)
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    // Send events
    let count = 0;
    const interval = setInterval(() => {
      res.write(`data: ${JSON.stringify({ count: count++, time: new Date() })}\n\n`);
    }, 1000);

    req.on('close', () => {
      clearInterval(interval);
      res.end();
    });
  }
});

server.listen(3000);
```

### Client-Side (JavaScript)
```javascript
const eventSource = new EventSource('/events');

eventSource.onopen = function() {
  console.log('Connection established');
};

eventSource.onmessage = function(event) {
  console.log('Received data:', JSON.parse(event.data));
};

eventSource.onerror = function(error) {
  console.error('Connection error:', error);
};

// Custom events
eventSource.addEventListener('custom-event', function(event) {
  console.log('Custom event:', event.data);
});

// Close connection
eventSource.close();
```

## Related Resources

### Official Documentation
- [HTML5 Rocks Tutorial](https://www.html5rocks.com/tutorials/eventsource/basics/)
- [has.js Feature Detection](https://raw.github.com/phiggins42/has.js/master/detect/features.js#native-eventsource)

### Polyfill
- [EventSource Polyfill](https://github.com/Yaffle/EventSource) - For browsers without native support

### Alternative Solutions
- **WebSockets**: For bidirectional communication
- **Polling**: For simpler use cases (less efficient)
- **Long Polling**: For older browser support
- **Server-Sent Events with Fallback**: Combine with polling for maximum compatibility

## Recommendations

### When to Use EventSource
- One-way communication from server to client
- Real-time updates and notifications
- Broadcasting events to multiple clients
- Simple implementation needed
- Automatic reconnection desired

### When to Use Alternatives
- **WebSockets**: When you need bidirectional communication
- **Polling**: When you need to support very old browsers
- **HTTP/2 Server Push**: When you need advanced HTTP/2 features

### Progressive Enhancement Strategy
```javascript
// Check for EventSource support
if (typeof EventSource !== 'undefined') {
  // Use EventSource
  const es = new EventSource('/events');
  // ... handle events
} else {
  // Fallback to polling
  setInterval(() => {
    fetch('/data').then(r => r.json()).then(handleData);
  }, 1000);
}
```

## Browser Compatibility Chart

### Desktop Browsers
| Version Range | IE | Edge | Firefox | Chrome | Safari | Opera |
|---------------|----|----|---------|--------|--------|-------|
| 2010-2011 | ❌ | - | ✅ v6+ | ✅ v6+ | ✅ v5+ | ✅ v11+ |
| 2015-2016 | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| 2020+ | ❌ | ✅ v79+ | ✅ | ✅ | ✅ | ✅ |
| Current | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Mobile Browsers
| Platform | Initial Support | Current Status |
|----------|-----------------|----------------|
| iOS Safari | iOS 4.0+ | ✅ Fully Supported |
| Android | Android 4.4+ | ✅ Fully Supported |
| Opera Mobile | v11.1+ | ✅ Fully Supported |
| Chrome Mobile | Full | ✅ Fully Supported |
| Firefox Mobile | Full | ✅ Fully Supported |
| Samsung Internet | v4.0+ | ✅ Fully Supported |
| Opera Mini | All versions | ❌ Not Supported |

## Summary

Server-Sent Events is a mature and widely-supported web standard with excellent browser coverage (93.26% global usage). It provides an efficient, event-driven approach to server-to-client communication and has become increasingly important in modern web applications. With support across all major modern browsers and strong adoption, EventSource is a reliable choice for real-time applications that require one-way communication from server to client.

The only significant limitation is Internet Explorer (all versions), which is now obsolete. For nearly all modern development scenarios targeting modern browsers, Server-Sent Events can be used with confidence.
