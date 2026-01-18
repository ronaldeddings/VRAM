# Web Sockets

## Overview

**Web Sockets** is a bidirectional communication technology that enables real-time, full-duplex communication channels over a single TCP connection. It allows for efficient, low-latency data exchange between web clients and servers, eliminating the need for constant polling or long-polling techniques.

## Description

Web Sockets provide a standardized protocol for establishing persistent, bidirectional connections between a client and server in web applications. This technology enables real-time data streaming, instant messaging, live notifications, collaborative tools, and other interactive features that require continuous communication without the overhead of traditional HTTP requests.

## Specification Status

**Status**: Living Standard (LS)

The Web Sockets API is maintained as a Living Standard within the [WHATWG HTML Specification](https://html.spec.whatwg.org/multipage/comms.html#network), ensuring continuous evolution and community feedback integration.

## Categories

- JavaScript API

## Key Benefits & Use Cases

### Real-Time Communication
- Instant messaging and chat applications
- Live notifications and alerts
- Collaborative editing tools
- Live activity feeds

### Data Streaming
- Live data visualization and dashboards
- Stock market tickers and financial data feeds
- Gaming multiplayer interactions
- Live video/audio streaming metadata

### Performance
- Reduced bandwidth compared to polling mechanisms
- Lower latency for time-sensitive operations
- Efficient resource utilization with persistent connections
- Minimized server load through single connection per client

### User Experience
- Responsive, real-time feedback
- Seamless synchronization across multiple tabs/clients
- Reduced page loading times for data updates
- Interactive features without page refreshes

## Browser Support

| Browser | Support Status | First Supported Version | Notes |
|---------|---|---|---|
| **Chrome** | ✅ Full | 16 | Partial in 4-15, full support from 16+ |
| **Edge** | ✅ Full | 12 | Full support from 12+ |
| **Firefox** | ✅ Full | 11 | Partial in 4-10, full support from 11+ |
| **Safari** | ✅ Full | 7 | Partial in 5-6, full support from 7+ |
| **Opera** | ✅ Full | 12.1 | Partial in 11-12, full support from 12.1+ |
| **IE** | ✅ Partial | 10 | Support in IE 10-11 |
| **iOS Safari** | ✅ Full | 6.0 | Partial in 4.2-5.1, full support from 6.0+ |
| **Android** | ✅ Full | 4.4 | No support in 2.1-4.3, full from 4.4+ |
| **Opera Mobile** | ✅ Full | 12.1 | Partial in 11-12, full support from 12.1+ |
| **Android Chrome** | ✅ Full | Latest | Full support |
| **Android Firefox** | ✅ Full | Latest | Full support |
| **Samsung Internet** | ✅ Full | 4+ | Full support across all versions |
| **Opera Mini** | ❌ None | N/A | Not supported |
| **UC Browser (Android)** | ✅ Full | 15.5 | Full support |

### Global Coverage

- **Full Support**: 93.59% of browsers globally
- **Partial Support**: 0.01% of browsers globally
- **No Support**: 6.4% of browsers globally (primarily legacy versions)

## Implementation Notes

### Known Issues

1. **Firefox WebWorker Limitation**: Firefox 37 and lower cannot host a WebSocket within a WebWorker context. Consider using alternative communication mechanisms for older Firefox versions if WebSocket support within Web Workers is required.

### Partial Support Details

The following annotation references explain partial support notations in the browser table:

- **Partial Support (#1)**: Older browsers may use an earlier version of the WebSocket protocol and/or have the feature disabled by default due to security concerns with the older protocol implementation.

- **Partial Support (#2)**: Some older browsers lack support for binary data transmission, limiting WebSocket usage to text-based communication.

### Device-Specific Notes

WebSocket support has been reported in some Android 4.x browsers, including:
- Sony Xperia S
- Sony TX
- HTC devices

## Relevant Resources

- [Chrome Blog: What's Different in the New WebSocket Protocol](https://developer.chrome.com/blog/what-s-different-in-the-new-websocket-protocol/)
- [Wikipedia: WebSocket](https://en.wikipedia.org/wiki/WebSocket)
- [has.js - Native WebSocket Detection](https://raw.github.com/phiggins42/has.js/master/detect/features.js#native-websockets)
- [WebPlatform Docs: WebSocket API](https://webplatform.github.io/docs/apis/websocket)
- [MDN Web Docs: WebSockets API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

## Quick Reference

| Aspect | Details |
|--------|---------|
| **API Type** | JavaScript API |
| **Specification** | WHATWG HTML Living Standard |
| **Primary Use** | Real-time bidirectional communication |
| **Connection Model** | Persistent TCP connection |
| **Data Types** | Text and binary data |
| **Typical Latency** | Ultra-low (<100ms) |
| **Polyfill Available** | Yes, multiple options |

## See Also

- [WebSocket Protocol (RFC 6455)](https://tools.ietf.org/html/rfc6455)
- [Server-Sent Events (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [WebRTC](https://developer.mozilla.org/en-US/docs/Glossary/WebRTC)
- [HTTP/2 Server Push](https://developer.mozilla.org/en-US/docs/Glossary/HTTP_2_Server_Push)
