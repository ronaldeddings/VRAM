# Web Serial API

## Overview

The **Web Serial API** allows web applications to communicate with devices through a serial interface. This enables JavaScript code running in the browser to read from and write to serial ports, opening up possibilities for web-based applications to interact with hardware devices like Arduino boards, microcontrollers, and other serial-connected peripherals.

## Description

The Web Serial API provides access to serial ports connected to the user's computer, allowing bidirectional communication with external devices. Web applications can use this API to:

- Request access to available serial ports
- Open and close serial connections
- Read data from serial devices
- Write data to serial devices
- Monitor port connection and disconnection events

## Specification

**Status**: Unofficial/Editor's Draft
**Spec URL**: [https://wicg.github.io/serial/](https://wicg.github.io/serial/)

The API is being developed by the Web Incubation Community Group (WICG) and has not yet been adopted as an official W3C standard.

## Categories

- **JavaScript API** - Core browser API for hardware communication

## Benefits & Use Cases

### For Developers
- **Hardware Interaction**: Direct control over serial devices from web applications
- **Rapid Prototyping**: Quickly build web-based tools for IoT and embedded devices
- **Educational Tools**: Create browser-based tutorials and tools for microcontroller development
- **Accessibility**: Enable web-based interfaces for hardware configuration and testing

### For End Users
- **No Native Apps**: Use web applications instead of platform-specific desktop software
- **Cross-Platform**: Access serial devices from any browser that supports the API
- **Familiar Interface**: Leverage existing web technologies and frameworks
- **Cloud Integration**: Combine serial device data with cloud services

### Common Applications
- Arduino IDE alternatives
- Firmware upload and testing tools
- Serial port monitoring and debugging
- IoT device configuration dashboards
- Home automation control interfaces
- Industrial equipment interfaces

## Browser Support

| Browser | Support Status | Version Details |
|---------|---|---|
| **Chrome** | ✅ Full Support | v89+ |
| **Edge** | ✅ Full Support | v89+ |
| **Firefox** | ❌ Not Supported | Mozilla position: harmful |
| **Safari** | ❌ Not Supported | WebKit position: opposed |
| **Opera** | ✅ Full Support | v76+ |
| **iOS Safari** | ❌ Not Supported | — |
| **Android Chrome** | ⚠️ Limited Support | v142+ (Bluetooth RFCOMM only) |
| **Android Firefox** | ❌ Not Supported | — |
| **Samsung Internet** | ❌ Not Supported | — |

### Browser Market Coverage
- **Global Usage**: ~75.98% of users (Chrome + Edge + Opera)

### Platform Support Notes

- **Desktop**: Primary support on Windows, macOS, and Linux
- **Android**: Supported over Bluetooth RFCOMM (Chrome v138+)
- **iOS**: Not supported (Safari/WebKit opposition)

## Key Features

### Security & Privacy
- **User Approval**: Requires explicit user permission before accessing serial ports
- **Same-Origin Policy**: Follows standard CORS and same-origin restrictions
- **HTTPS Required**: Generally requires secure context (HTTPS)
- **No Silent Access**: Users see a permission dialog when sites request serial access

### Core API Objects

#### `navigator.serial`
Entry point for the Serial API. Provides methods to:
- `requestPort()` - Request user to select a serial port
- `getPorts()` - Get previously approved ports
- `onconnect` / `ondisconnect` - Listen for port connection changes

#### `SerialPort`
Represents a serial port connection:
- `open()` - Open the port with baud rate and other settings
- `close()` - Close the connection
- `readable` - ReadableStream for incoming data
- `writable` - WritableStream for outgoing data

#### `SerialPortInfo`
Contains information about a serial port:
- `getSignals()` - Get control signal states (RTS, DTR, etc.)
- `setSignals()` - Set control signals

## Current Implementation Status

### Released
- **Chrome**: v89 (March 2021)
- **Edge**: v89 (March 2021)
- **Opera**: v76 (May 2020)

### In Development
- **Android Chrome**: Bluetooth RFCOMM support (v138+)

### Not Planned
- **Firefox**: Mozilla marked as "harmful"
- **Safari**: WebKit opposed due to security and privacy concerns

## Notes

### Browser Position Summary

**Positive Support:**
- Google Chrome: Full support
- Microsoft Edge: Full support
- Opera: Full support

**Opposition:**
- **Mozilla**: [Position marked as "harmful"](https://mozilla.github.io/standards-positions/#webserial) - Concerned about security and privacy implications
- **WebKit**: [Position "opposed"](https://webkit.org/tracking-prevention/) - Tracking prevention and security concerns

### Android Considerations

Android support is more limited due to platform constraints:
- Bluetooth RFCOMM support available in Chrome 138+
- Standard USB serial connections not supported on Android
- Different permissions model on Android

### Security Considerations

When developing applications using the Web Serial API:
1. Always request permission explicitly
2. Handle user denial gracefully
3. Validate data from serial devices
4. Close connections when no longer needed
5. Test in secure HTTPS context
6. Document required permissions clearly

## Code Example

```javascript
// Request access to a serial port
const port = await navigator.serial.requestPort();

// Open the port
await port.open({ baudRate: 9600 });

// Write data
const writer = port.writable.getWriter();
await writer.write(new Uint8Array([0x01, 0x02, 0x03]));
writer.releaseLock();

// Read data
const reader = port.readable.getReader();
try {
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    console.log('Received:', value);
  }
} finally {
  reader.releaseLock();
}

// Close the port
await port.close();
```

## Relevant Resources

### Official Documentation
- [WICG Serial Explainer](https://github.com/WICG/serial/blob/main/EXPLAINER.md) - Technical overview and design rationale
- [Web.dev: Read from and write to a serial port](https://web.dev/serial/) - Comprehensive guide with examples

### Browser Position Papers
- [Mozilla Standards Position](https://mozilla.github.io/standards-positions/#webserial) - Firefox position statement
- [WebKit Tracking Prevention](https://webkit.org/tracking-prevention/) - Safari/WebKit position statement

### Community
- [WICG GitHub Repository](https://github.com/WICG/serial) - Issue tracker and discussions
- [Web Platform Tests](https://github.com/web-platform-tests/wpt/tree/master/serial) - Test suite

## Compatibility Notes

### Fallback Strategies
For applications needing broader browser support, consider:
- Providing a native desktop application alternative
- Using WebUSB for direct USB device communication (more widely supported)
- Implementing a proxy server for remote serial device access
- Progressive enhancement with graceful degradation

### Testing
Test your application in:
- Chrome/Edge (primary support)
- Opera (full support)
- Consider Android Chrome for Bluetooth RFCOMM scenarios
- Provide fallback UI for unsupported browsers

---

**Last Updated**: December 2025
**Data Source**: CanIUse.com
**Specification Status**: Unofficial Draft
