# Web NFC API

## Overview

**Web NFC** is a JavaScript API that enables web applications to communicate with NFC (Near Field Communication) tags through a device's NFC reader. This allows websites to interact with NFC-enabled hardware for various use cases including device pairing, data transfer, and smart tag reading.

## Description

This API allows a website to communicate with NFC tags through a device's NFC reader, providing web developers with access to NFC capabilities previously limited to native applications. The Web NFC API enables reading and writing data to NFC tags using the NDEF (NFC Data Exchange Format) protocol.

## Specification Status

| Property | Value |
|----------|-------|
| **Current Status** | Unofficial/Experimental (`unoff`) |
| **Specification URL** | [W3C Web NFC Specification](https://w3c.github.io/web-nfc/) |
| **Standard Track** | Not yet part of official W3C standards |

### Browser Vendor Positions

- **Chrome/Chromium**: Experimental support behind feature flag
- **Firefox**: [Marked as "Harmful"](https://mozilla.github.io/standards-positions/#web-nfc)
- **Safari**: [Officially opposed](https://lists.webkit.org/pipermail/webkit-dev/2020-January/031007.html)
- **Opera**: Experimental support behind feature flag

## Categories

- **JavaScript API**

## Use Cases & Benefits

### Primary Use Cases

1. **Mobile Payment & Ticketing**
   - NFC-based payment confirmation
   - Digital ticket scanning and validation
   - Transit pass functionality

2. **Device Pairing & Configuration**
   - Quick device setup by tapping NFC tags
   - Simplified authentication flows
   - Smart device configuration

3. **Data Transfer**
   - Reading data from NFC tags
   - Writing information to NFC-enabled cards
   - IoT device interaction

4. **Smart Tags & Labels**
   - Product information retrieval
   - Asset tracking
   - Inventory management

### Key Benefits

- **Direct hardware access**: Enable web apps to interact with NFC hardware
- **Native app parity**: Bring NFC capabilities to web applications
- **User convenience**: Simplified tag-based interactions
- **Cross-platform**: Works across devices with NFC support

## Browser Support

### Desktop Browsers

| Browser | Status | Details |
|---------|--------|---------|
| **Chrome** | Not supported (desktop) | Experimental flag support in versions 80-88 (v80+: `n d #1 #2`) |
| **Edge** | Not supported (desktop) | Experimental flag support in versions 80-88 (v80+: `n d #1 #2`) |
| **Firefox** | Not supported | No support across all versions |
| **Safari** | Not supported | No support across all versions |
| **Opera** | Not supported (desktop) | Experimental flag support in versions 67-75 (v67+: `n d #1 #2`) |

### Mobile Browsers

| Browser | Status | Details |
|---------|--------|---------|
| **Chrome Mobile (Android)** | **Supported** | Full support in Chrome 142+ (`y #2`) |
| **Firefox Mobile (Android)** | Not supported | No support across all versions |
| **Safari iOS** | Not supported | No support across all versions |
| **Opera Mobile** | Not supported | No support across versions |
| **Samsung Internet** | Not supported | No support across all versions |
| **Baidu Browser** | **Supported** | Full support in version 13.52 (`y`) |
| **UC Browser (Android)** | Not supported | No support across all versions |
| **Opera Mini** | Not supported | No support on all versions |

### Legacy Browsers

- **Internet Explorer**: Not supported
- **BlackBerry**: Not supported

## Implementation Notes

### Important Limitations

1. **Hardware Requirement**: Many devices are not equipped with NFC readers and won't return any data, even though an installed browser might support this API.

2. **Protocol Limitation**: Current implementations only allow communication through the **NDEF (NFC Data Exchange Format)** protocol in order to minimize security and privacy issues.

3. **Flag Requirement**:
   - Desktop support required activation of the `enable-experimental-web-platform-features` flag in Chromium-based browsers
   - This is not recommended for production use

### Security & Privacy Considerations

- NDEF protocol restriction minimizes potential security vulnerabilities
- Only supports read/write operations on NFC tags
- Requires explicit user permission and interaction

## API Usage

The Web NFC API provides the following main interfaces:

```javascript
// Basic API structure
navigator.nfc.scan()      // Read from NFC tags
navigator.nfc.write()     // Write to NFC tags
```

### Core Objects

- **NDEFReader**: Interface for reading NDEF messages from NFC tags
- **NDEFWriter**: Interface for writing NDEF messages to NFC tags
- **NDEFMessage**: Represents an NDEF message
- **NDEFRecord**: Represents a single NDEF record

## Related Resources

### Official Documentation
- [W3C Web NFC Specification](https://w3c.github.io/web-nfc/)
- [Web.dev: Using the Web NFC API](https://web.dev/nfc/)

### Browser Positions
- [Firefox Standards Position: Web NFC (Harmful)](https://mozilla.github.io/standards-positions/#web-nfc)
- [Safari Position: Web NFC (Opposed)](https://lists.webkit.org/pipermail/webkit-dev/2020-January/031007.html)

## Feature Detection

```javascript
// Check if Web NFC is supported
if ('NDEFReader' in window) {
  // Web NFC is available
  console.log('Web NFC is supported');
} else {
  // Web NFC is not supported
  console.log('Web NFC is not available');
}
```

## Adoption Statistics

- **Global Usage**: 41.86% of browsers with support (among supporting browsers)
- **Market Coverage**: Very limited due to minimal browser support and hardware requirements

## Summary

Web NFC is an experimental API with limited browser support that enables web applications to read and write NFC tags. While it has promising use cases in mobile payment systems and device pairing, its adoption is severely limited by:

1. Limited browser support (primarily Chrome on Android)
2. Opposition from major browser vendors (Firefox, Safari)
3. Dependency on device hardware (NFC reader availability)
4. Experimental status and lack of standardization

Developers should carefully consider browser support and hardware constraints before implementing Web NFC functionality, potentially maintaining fallback mechanisms for unsupported environments.

---

**Last Updated**: 2025-12-13

**Specification Version**: Latest (from https://w3c.github.io/web-nfc/)

**Support Status**: ❌ Limited (experimental, not standard)
