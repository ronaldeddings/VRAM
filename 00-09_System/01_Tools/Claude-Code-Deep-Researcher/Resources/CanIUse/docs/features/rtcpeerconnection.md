# WebRTC Peer-to-peer Connections (RTCPeerConnection)

## Overview

**RTCPeerConnection** is a Web API that enables direct, browser-to-browser communication for real-time data exchange. It forms the foundation of the WebRTC (Web Real-Time Communication) platform, allowing developers to build peer-to-peer applications without relying on centralized servers for media transmission.

## Description

The RTCPeerConnection API provides a method for two users to communicate directly, browser to browser. This enables:

- **Real-time audio and video communication** - Stream media between peers with minimal latency
- **Peer-to-peer data channels** - Exchange arbitrary data without server intermediaries
- **Interactive applications** - Build video conferencing, voice calls, gaming, and collaborative tools

## Specification Status

- **Status**: Working Draft (WD)
- **Specification URL**: [W3C WebRTC PC Specification](https://w3c.github.io/webrtc-pc/)
- **Standards Body**: W3C (World Wide Web Consortium)

## Categories

- JavaScript API

## Benefits & Use Cases

### Core Benefits

1. **Low Latency Communication** - Direct peer connections reduce latency compared to server-routed communication
2. **Reduced Server Load** - Media streams bypass servers, reducing infrastructure costs
3. **End-to-End Encryption Potential** - Secure communication between peers at the application level
4. **Flexible Media Handling** - Support for audio, video, and arbitrary data channels

### Use Cases

#### Communication Applications
- **Video Conferencing** - Multi-party video calls (Zoom, Google Meet, Teams)
- **VoIP Services** - Telephone-like voice calls over the internet
- **Live Streaming** - Interactive streaming with real-time engagement
- **Screen Sharing** - Share screen content during calls or presentations

#### Collaborative Tools
- **Collaborative Editing** - Real-time document collaboration with low latency
- **Whiteboarding** - Interactive drawing and diagramming applications
- **Remote Assistance** - Support agents providing real-time help with screen sharing

#### Gaming & Entertainment
- **Multiplayer Gaming** - Real-time game state synchronization between players
- **Live Interactive Events** - Interactive broadcasts with audience participation
- **Social Applications** - Peer-to-peer messaging and presence sharing

#### Industrial & Enterprise
- **Remote Desktop Access** - Secure remote control of computers
- **Telemedicine** - Secure video consultations between healthcare providers and patients
- **Remote Monitoring** - Real-time surveillance and monitoring systems

## Browser Support

### Support Legend

| Symbol | Meaning |
|--------|---------|
| **y** | Fully supported |
| **y x** | Supported with prefix (webkit) or limited implementation |
| **a** | Partially supported or experimental |
| **n** | Not supported |

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | 23 (with prefix) | ✅ Full support from v56+ | Prefix required in versions 23-55 |
| **Firefox** | 22 (with prefix) | ✅ Full support from v44+ | Prefix required in versions 22-43 |
| **Safari** | 11 | ✅ Full support | Full support since Safari 11 |
| **Edge (Chromium)** | 79 | ✅ Full support | No support in legacy Edge (v15-18 had partial support) |
| **Opera** | 18 (with prefix) | ✅ Full support from v43+ | Prefix required in versions 18-42 |
| **Internet Explorer** | - | ❌ Not supported | No WebRTC support in any IE version |

### Mobile Browsers

| Browser | First Support | Current Status |
|---------|---------------|----------------|
| **iOS Safari** | 11.0 | ✅ Full support |
| **Android Chrome** | 142 | ✅ Full support |
| **Android Firefox** | 144 | ✅ Full support |
| **Samsung Internet** | 4 (with prefix) | ✅ Full support from v6.2+ |
| **Opera Mobile** | 80 | ✅ Full support |
| **UC Browser** | 15.5 | ✅ Supported |
| **Opera Mini** | - | ❌ Not supported |
| **Android UC** | 15.5 | ✅ Supported |

### Global Usage Statistics

- **Supported (y)**: 93.17% of web traffic
- **Partially Supported (a)**: 0%
- **Not Supported (n)**: 6.83% of web traffic

## Implementation Notes

### RTCDataChannel Limitation

⚠️ **Important**: The legacy Edge browser (versions 15-18) **does not support RTCDataChannel**, even though it has partial WebRTC support. See [API Catalogue](https://web.archive.org/web/20190327013248/https://developer.microsoft.com/en-us/microsoft-edge/platform/catalog/?q=specName%3Awebrtc) for details.

### BlackBerry Support

BlackBerry 10 recognizes RTCPeerConnection API but real-world support is unconfirmed.

### Legacy Alternative: ObjectRTC

The legacy Edge browser offers a compatible implementation known as **ObjectRTC** for real-time communications. This is a separate API with different syntax and method calls. See [ObjectRTC Feature Page](https://caniuse.com/#feat=objectrtc) for support details on this alternative API.

### Vendor Prefixes

Early implementations required vendor prefixes:
- **webkit prefix**: Used in Chrome, Safari, Opera, and Samsung Internet
- Available as `webkitRTCPeerConnection` in older browsers
- Full unprefixed support available in modern versions

## Getting Started

### Basic Setup

```javascript
// Create a peer connection
const peerConnection = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
  ]
});

// Handle incoming media streams
peerConnection.onaddstream = (event) => {
  remoteVideo.srcObject = event.stream;
};

// Handle ICE candidates
peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    sendCandidateToRemotePeer(event.candidate);
  }
};
```

### Key APIs

- **RTCPeerConnection** - Main interface for peer connections
- **RTCDataChannel** - Bidirectional data communication
- **RTCIceCandidate** - Network connectivity information
- **RTCSessionDescription** - Offer/answer session information
- **MediaStream** - Container for audio/video tracks

## Browser Prefixes Reference

### Chrome/Chromium Variants
```javascript
window.RTCPeerConnection ||
window.webkitRTCPeerConnection ||
window.mozRTCPeerConnection
```

### Firefox
```javascript
window.mozRTCPeerConnection || window.RTCPeerConnection
```

### Safari
```javascript
window.webkitRTCPeerConnection || window.RTCPeerConnection
```

## Recommended Fallback Approach

For maximum compatibility:

```javascript
const RTCPeerConnection = window.RTCPeerConnection ||
                         window.webkitRTCPeerConnection ||
                         window.mozRTCPeerConnection;

if (!RTCPeerConnection) {
  console.error('WebRTC not supported in this browser');
}
```

## Related Features

- [WebRTC API](https://caniuse.com/rtcpeerconnection)
- [getUserMedia API](https://caniuse.com/stream) - Access camera and microphone
- [RTCDataChannel](https://caniuse.com/rtcdatachannel) - Peer-to-peer data communication
- [ObjectRTC](https://caniuse.com/#feat=objectrtc) - Legacy Edge implementation

## Testing Support

To detect RTCPeerConnection support:

```javascript
const hasWebRTC = !!(
  window.RTCPeerConnection ||
  window.webkitRTCPeerConnection ||
  window.mozRTCPeerConnection
);

console.log('WebRTC Support:', hasWebRTC);
```

## Resources & References

### Official Resources
- [WebRTC Project Site](https://webrtc.org/) - Official WebRTC project information
- [W3C WebRTC PC Specification](https://w3c.github.io/webrtc-pc/) - Complete technical specification
- [MDN WebRTC API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) - Comprehensive developer guide

### Implementation Resources
- [WebRTC Samples](https://webrtc.github.io/samples/) - Official sample applications
- [Plug-in Support](https://temasys.atlassian.net/wiki/display/TWPP/WebRTC+Plugins) - IE & Safari plugin compatibility

### Browser-Specific Resources
- [Microsoft Edge WebRTC Announcement](https://blogs.windows.com/msedgedev/2017/01/31/introducing-webrtc-microsoft-edge/) - Introducing WebRTC 1.0 in Microsoft Edge

## Summary

RTCPeerConnection is a mature, well-supported web standard for real-time peer-to-peer communication. With 93%+ global browser support and full coverage in all modern browsers, it's suitable for production use in most applications. Legacy browser support (IE, older Edge) requires alternative solutions or graceful degradation strategies.

---

*Last Updated: December 2024*
*Based on CanIUse Feature Data*
