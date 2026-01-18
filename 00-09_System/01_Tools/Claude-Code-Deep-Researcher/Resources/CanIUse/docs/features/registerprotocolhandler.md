# Custom Protocol Handling

## Overview

Custom protocol handling enables web applications to register themselves as handlers for specific protocols using the `navigator.registerProtocolHandler()` API. This allows websites to process and open custom protocol URLs, such as `mailto:` for webmail clients, without requiring native applications.

## Description

The `navigator.registerProtocolHandler()` API allows a webpage to register itself to handle given protocols. This creates a seamless integration between web applications and the operating system's protocol handling system. For example, a webmail client can register to handle all `mailto:` links, allowing users to click email links and have them open in their preferred web-based email service instead of the system default.

## Specification

- **Status**: Living Standard (ls)
- **Specification URL**: [WHATWG HTML Specification - Custom Handlers](https://html.spec.whatwg.org/multipage/webappapis.html#custom-handlers)

## Categories

- HTML5

## Use Cases and Benefits

### Primary Use Cases

1. **Email Handling**: Webmail applications can register as default handlers for `mailto:` links
2. **Instant Messaging**: Web-based messaging apps can handle `xmpp://` and custom messaging protocols
3. **VoIP Applications**: Web-based phone services can handle `tel:` and `sip:` protocols
4. **Streaming Services**: Media platforms can register for custom streaming protocols
5. **Enterprise Applications**: Internal tools can register for company-specific protocols

### Key Benefits

- **Seamless User Experience**: Users don't need to maintain separate applications for common tasks
- **Web-First Approach**: Enables feature parity between web and native applications
- **User Control**: Allows explicit user approval for protocol handling
- **Cross-Platform**: Works consistently across browsers on different operating systems

## Browser Support

### Support Summary

| Browser | Support | Version | Notes |
|---------|---------|---------|-------|
| **Chrome** | Yes | 13+ | Limited protocol support |
| **Edge** | Yes | 79+ | Limited protocol support |
| **Firefox** | Yes | 3+ | Limited protocol support |
| **Opera** | Yes | 11.6+ | Limited protocol support |
| **Safari** | No | - | Not supported |
| **iOS Safari** | No | - | Not supported |
| **Android Browser** | No | - | Not supported |
| **Samsung Internet** | No | - | Not supported |

### Detailed Browser Support

#### Chromium-Based Browsers (Chrome, Edge, Opera)
- **Chrome**: Supported from version 13 onwards (#1 note applies)
- **Edge**: Supported from version 79 onwards (#1 note applies)
- **Opera**: Supported from version 11.6 onwards (#1 note applies)

#### Mozilla Firefox
- **Full Support**: Since Firefox 3 and all versions thereafter
- **Comprehensive Protocol Support**: Supports various protocols compared to Chromium browsers

#### Apple Safari
- **Desktop Safari**: Not supported in any version
- **iOS Safari**: Not supported in any version

#### Mobile Browsers
- **Android Browser**: Not supported
- **Opera Mobile**: Not supported
- **Chrome Mobile**: Not supported
- **Firefox Mobile**: Not supported (Firefox Android mirrors desktop Firefox support)
- **Samsung Internet**: Not supported
- **UC Browser**: Not supported

### Global Usage
- **Supported Browsers Usage**: 36.46% of global web traffic
- **Partial Support**: 0%

## Implementation Notes

### Important Limitations and Restrictions (#1)

Browsers that support this feature implement **protocol whitelisting** for security reasons:

- **Allowed Protocols**:
  - `mailto` - Email addresses
  - `mms` - Media streaming
  - `nntp` - Network News Transfer Protocol
  - `rtsp` - Real Time Streaming Protocol
  - `webcal` - Web calendar

- **Custom Protocols**: Custom protocols must start with the `web+` prefix
  - Example: `web+myprotocol://` is allowed
  - Example: `customprotocol://` is not allowed without the `web+` prefix

This restriction prevents malicious websites from hijacking important system protocols.

## Basic Usage Example

```javascript
// Register a handler for a custom protocol
navigator.registerProtocolHandler(
  'web+myapp',
  'https://myapp.example.com/handle?protocol=%s',
  'My Custom App'
);

// Register a handler for mailto
navigator.registerProtocolHandler(
  'mailto',
  'https://mail.example.com/compose?to=%s',
  'Example Mail'
);
```

### Parameters

1. **protocol** (string): The protocol to handle (e.g., `web+myapp`, `mailto`)
2. **url** (string): The URL to invoke when the protocol is used. Must include `%s` placeholder for the full URL
3. **title** (string): A human-readable name for the protocol handler

## Security Considerations

- Browsers require explicit user approval before registering a protocol handler
- Protocol whitelisting prevents malicious scripts from hijacking critical protocols
- Users can revoke protocol handlers in browser settings
- The handler URL must be HTTPS in most modern browsers

## Related Resources

### Official Documentation
- [MDN Web Docs - Navigator.registerProtocolHandler()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/registerProtocolHandler)
- [WHATWG HTML Standard - Custom Handlers](https://html.spec.whatwg.org/multipage/webappapis.html#custom-handlers)

### Compatibility Resources
- [Can I Use - Custom Protocol Handling](https://caniuse.com/registerprotocolhandler)

## Summary

Custom protocol handling is a well-established feature with strong support in Chromium-based browsers and Firefox, but notably absent from Safari. The feature requires careful attention to protocol whitelisting and security considerations. While the API enables powerful integration scenarios, developers should be aware of Safari's lack of support when building applications that rely on this functionality.
