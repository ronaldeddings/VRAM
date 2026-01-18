# Object RTC (ORTC) API for WebRTC

## Overview

Object RTC (ORTC) API is a lower-level, more flexible alternative to the standard WebRTC API that enables mobile endpoints, servers, and web browsers to establish Real-Time Communications (RTC) capabilities through native and simple JavaScript APIs.

## Description

The Object RTC API provides a direct, object-oriented approach to WebRTC functionality, giving developers finer control over the communication process. Unlike the higher-level WebRTC 1.0 API, ORTC exposes individual components such as ICE transport, DTLS transport, and RTP senders/receivers, allowing for more granular manipulation of the connection setup and media handling.

ORTC is often referred to as "WebRTC 1.1" and is designed to be compatible with WebRTC 1.0 endpoints, enabling interoperability between implementations that use either API.

## Specification Status

**Status:** Community Standard (Other)

**Specification URL:** [W3C ORTC Community Group](https://www.w3.org/community/ortc/)

## Categories

- JavaScript API (JS API)

## Key Features & Benefits

### Use Cases

- **Mobile-to-Server Communication:** Enable mobile applications to establish RTC connections with servers
- **Flexible Network Handling:** Fine-grained control over ICE transport, DTLS, and media streams
- **Advanced RTC Scenarios:** Custom signaling protocols and connection management
- **IoT Applications:** Lightweight, flexible RTC implementation for IoT devices
- **Interoperability:** Ability to communicate with WebRTC 1.0 endpoints while leveraging ORTC advantages

### Benefits

1. **Lower-Level Control:** Direct access to transport and media components allows for custom implementations
2. **Performance Optimization:** Developers can optimize specific aspects of the communication pipeline
3. **Flexibility:** More granular API surface for specialized use cases
4. **Interoperable:** Can work alongside and communicate with WebRTC 1.0 implementations

## Browser Support

### Support Legend

- **✓ Yes** - Feature is fully supported
- **✗ No** - Feature is not supported
- **? Partial** - Feature is partially supported

### Browser Support Table

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Edge** | 13-18 | ✓ Yes | Original support for ORTC API |
| **Edge** | 79+ | ✗ No | Dropped support in Chromium-based Edge |
| **Firefox** | All versions | ✗ No | Never implemented |
| **Chrome** | All versions | ✗ No | Never implemented |
| **Safari** | All versions | ✗ No | Never implemented |
| **Opera** | All versions | ✗ No | Never implemented |
| **Internet Explorer** | All versions | ✗ No | Never implemented |
| **iOS Safari** | All versions | ✗ No | Never implemented |
| **Android Browser** | All versions | ✗ No | Never implemented |

### Summary Statistics

- **Global Usage:** 0% (as of last update)
- **Adoption Rate:** Minimal - primarily limited to legacy Edge implementations
- **Mobile Support:** No support across any major mobile browsers

## Current Implementation Status

ORTC support is extremely limited in modern browsers:

- **Only Edge 13-18** had native ORTC support
- **No other major browsers** have implemented or currently support ORTC
- The API remains **primarily a W3C Community Group specification** rather than a W3C Recommendation
- **Chromium-based Edge (79+)** dropped ORTC support in favor of the standard WebRTC 1.0 API

## Important Notes

### Relationship to WebRTC 1.0

ORTC is closely related to the WebRTC 1.0 API but operates at a different abstraction level. Key points:

- ORTC provides more granular, object-oriented control compared to WebRTC 1.0's higher-level interface
- ORTC is sometimes referred to as "WebRTC 1.1"
- **Interoperability:** ORTC implementations can communicate with WebRTC 1.0 endpoints
- For current projects, **WebRTC 1.0 (RTCPeerConnection)** is the recommended and universally supported approach

### Practical Considerations

- **Not Recommended for New Projects:** Due to limited browser support, new projects should use WebRTC 1.0 API instead
- **Legacy Systems:** Existing applications targeting Edge 13-18 may still use ORTC
- **Polyfills:** No reliable polyfills exist due to the low-level nature of the API and minimal adoption

## Related Technologies

- **WebRTC 1.0 (RTCPeerConnection):** The standard, widely-supported real-time communication API
  - [WebRTC Support on caniuse.com](https://caniuse.com/#feat=rtcpeerconnection)
- **MediaStream API:** For accessing audio and video input devices
- **Web Audio API:** For advanced audio processing in real-time applications
- **getUserMedia:** Standard API for accessing user's camera and microphone

## Resources & References

### Official Resources

- [W3C ORTC Community Group](https://www.w3.org/community/ortc/)
- [Microsoft Edge Blog - Object RTC Posts](https://blogs.windows.com/msedgedev/tag/object-rtc/)

### Related Documentation

- [WebRTC Specification (W3C)](https://www.w3.org/TR/webrtc/)
- [WebRTC 1.0: Real-time Communication Between Browsers](https://www.w3.org/TR/webrtc/)
- [WebRTC Implementation Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)

## Migration Guide

If you're using ORTC or considering it, here are recommended alternatives:

### From ORTC to WebRTC 1.0

Use the standard **RTCPeerConnection** API instead:

```javascript
// ORTC-style control can be partially replicated with WebRTC 1.0
const peerConnection = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
  ]
});

// Add media tracks
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true
});

stream.getTracks().forEach(track => {
  peerConnection.addTrack(track, stream);
});

// Handle connection setup
peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    // Send ICE candidate to peer
  }
};

peerConnection.ondatachannel = (event) => {
  const dataChannel = event.channel;
  // Handle incoming data channel
};
```

## Compatibility Checklist

- [ ] Check if targeting legacy Edge 13-18 browsers
- [ ] Confirm WebRTC 1.0 is insufficient for use case
- [ ] Evaluate polyfills or fallback mechanisms
- [ ] Document ORTC-specific requirements
- [ ] Plan migration path to WebRTC 1.0

## Browser History

### Implementation Timeline

| Date | Event |
|------|-------|
| 2015-2016 | Edge 13-18 implements ORTC API |
| 2020 | Chromium-based Edge (79+) drops ORTC in favor of WebRTC 1.0 |
| Present | ORTC remains a community specification with no active browser implementations |

## Final Recommendations

### Do Not Use ORTC For:

- New web applications
- Cross-browser real-time communication
- Mobile web applications
- Any project requiring broad browser compatibility

### Consider ORTC Only For:

- Legacy system maintenance (Edge 13-18 specific)
- Specialized research or experimental implementations
- Projects with custom signaling requirements and Edge-only deployment

### Recommended Alternative:

**Use WebRTC 1.0 (RTCPeerConnection)** - it's the de facto standard with:
- Universal browser support
- Stable API with W3C Recommendation status
- Extensive documentation and community resources
- Better library and framework support

---

*Documentation last updated: 2025*
*For current browser support data, visit [caniuse.com](https://caniuse.com)*
