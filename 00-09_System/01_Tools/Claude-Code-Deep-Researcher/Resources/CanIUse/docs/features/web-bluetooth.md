# Web Bluetooth API

## Overview

Web Bluetooth is a JavaScript API that allows web applications to communicate with nearby Bluetooth devices in a secure and privacy-preserving manner. It enables direct interaction with Bluetooth Low Energy (BLE) devices, opening up new possibilities for web-based IoT applications and device connectivity.

## Description

The Web Bluetooth API allows websites to communicate over GATT (Generic Attribute Profile) with nearby user-selected Bluetooth devices in a secure and privacy-preserving way. This API provides web developers with the ability to interact with physical devices like wearables, heart rate monitors, fitness trackers, medical devices, and other IoT hardware directly from web browsers.

## Specification Status

**Status:** Unofficial/Draft
**Specification URL:** [Web Bluetooth CG Specification](https://webbluetoothcg.github.io/web-bluetooth/)

The Web Bluetooth API is maintained by the Web Bluetooth Community Group and is not yet a formal W3C standard, though it continues to evolve with growing browser support.

## Categories

- **JavaScript API**

## Key Features & Use Cases

### Benefits

- **Direct Device Communication:** Connect web applications directly to Bluetooth devices without requiring native apps
- **IoT Integration:** Build web-based IoT solutions that interact with smart devices and sensors
- **Wearable Device Support:** Access data from fitness trackers, smartwatches, and health monitors
- **Privacy-Preserving:** User explicitly grants permission to connect to devices; websites cannot auto-connect or scan without permission
- **Secure Communication:** Uses GATT protocol with encryption and authentication mechanisms
- **Cross-Platform Compatibility:** Works across multiple operating systems where supported

### Use Cases

1. **Health & Fitness:** Access heart rate data, sleep tracking, and activity monitoring from wearable devices
2. **Smart Home Control:** Control Bluetooth-enabled smart lights, locks, and thermostats
3. **Medical Devices:** Interface with blood pressure monitors, glucose meters, and other medical equipment
4. **Gaming & Input Devices:** Connect wireless controllers, fitness devices, or other input peripherals
5. **Industrial IoT:** Web-based monitoring and control of Bluetooth-equipped industrial devices
6. **Asset Tracking:** Real-time location tracking and asset management via Bluetooth beacons

## Browser Support

### Support Legend

| Status | Meaning |
|--------|---------|
| ✅ Yes | Full support |
| ⚠️ Partial | Partial/experimental support |
| ❌ No | Not supported |

### Desktop Browsers

| Browser | Versions | Status | Notes |
|---------|----------|--------|-------|
| **Chrome** | 56+ | ✅ Yes | Full support from version 56 onwards. Support varies by OS. |
| **Edge** | 79+ | ✅ Yes | Full support from version 79 onwards (Chromium-based). |
| **Firefox** | All versions | ❌ No | Not implemented. Mozilla's position is "Harmful" |
| **Safari** | All versions | ❌ No | No support |
| **Opera** | 43+ | ✅ Yes | Full support from version 43 onwards. |
| **Internet Explorer** | All versions | ❌ No | Not supported |

### Mobile Browsers

| Browser/Platform | Version | Status | Notes |
|------------------|---------|--------|-------|
| **Android Chrome** | 142+ | ✅ Yes | Full support. Support varies by OS version. |
| **Android Browser** | 4.4+ | ⚠️ Partial | Limited support with experimental flag |
| **Opera Mobile** | 80+ | ✅ Yes | Full support |
| **Samsung Internet** | 6.2+ | ✅ Yes | Full support from version 6.2+ |
| **Android Firefox** | All versions | ❌ No | Not supported |
| **Opera Mini** | All versions | ❌ No | Not supported |
| **iOS Safari** | All versions | ❌ No | Not supported on iOS |
| **UC Browser** | 15.5+ | ✅ Yes | Full support |
| **Baidu Browser** | 13.52+ | ✅ Yes | Full support |
| **QQ Browser** | All tested versions | ❌ No | Not supported |

### Current Implementation Status

**Overall Usage:** Approximately 80% of users have Web Bluetooth support

**Key Implementation Notes:**

- **Chrome/Edge:** Support varies by operating system. Full support on macOS, Windows 10+, Android M+, and Chrome OS
- **Firefox:** Not implemented. Mozilla's standards position indicates they view Web Bluetooth as potentially harmful
- **Safari/iOS:** No support, including iOS Safari and desktop Safari
- **Samsung Internet:** Full support following Chromium updates

## Notes

### Feature Detection & Experimental Access

1. **Chrome 45-55:** Available by enabling the "Web Bluetooth" experimental flag in `about:flags`
2. **Chrome/Android:** Originally available via Origin Trials for Chrome OS, Android M, and macOS
3. **Firefox:** Available by enabling the "Web Bluetooth" experimental flag in `about:config`
4. **Current Support:** Support varies by operating system even in browsers that claim compatibility

### Implementation Limitations

- **OS-Level Dependencies:** Bluetooth support requires OS-level Bluetooth capabilities
- **Security Requirements:** Must be served over HTTPS
- **User Gesture Required:** Connection requires explicit user interaction
- **Permission Model:** Users must explicitly select which device to connect to
- **Platform Variations:** Exact functionality varies by operating system (Windows, macOS, Linux, Android, Chrome OS)

### Security & Privacy

- **No Background Scanning:** Websites cannot scan for devices without user interaction
- **Explicit Permissions:** Each device connection requires explicit user permission
- **Device Selection:** Users select specific devices from a browser-provided dialog
- **HTTPS Requirement:** API only works on secure contexts (HTTPS)
- **No Fingerprinting:** Cannot be used for fingerprinting due to permission requirements

## Related Resources

### Official Documentation & Guides

- **[Web Bluetooth Introduction](https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web)** - Google's introductory guide to Web Bluetooth
- **[Specification](https://webbluetoothcg.github.io/web-bluetooth/)** - Official Web Bluetooth CG specification
- **[Implementation Status](https://github.com/WebBluetoothCG/web-bluetooth/blob/main/implementation-status.md)** - Detailed implementation status by browser and OS

### Code Samples & Demos

- **[Chrome Samples](https://googlechrome.github.io/samples/web-bluetooth/)** - Official Web Bluetooth code samples
- **[WebBluetoothCG Demos](https://github.com/WebBluetoothCG/demos)** - Community-maintained demo applications

### Standards Positions

- **[Mozilla Standards Position](https://mozilla.github.io/standards-positions/#web-bluetooth)** - Mozilla's official position on Web Bluetooth (labeled as "Harmful")

## Detection & Usage

### Feature Detection

```javascript
// Check if Web Bluetooth API is available
if (navigator.bluetooth) {
  // Web Bluetooth is available
  console.log('Web Bluetooth supported');
} else {
  console.log('Web Bluetooth not supported');
}
```

### Basic Usage Example

```javascript
// Request Bluetooth device
navigator.bluetooth.requestDevice({
  filters: [
    { services: ['heart_rate'] }
  ]
})
.then(device => {
  console.log('Selected device:', device.name);
  return device.gatt.connect();
})
.then(server => {
  console.log('Connected to device');
  return server.getPrimaryService('heart_rate');
})
.then(service => {
  return service.getCharacteristic('heart_rate_measurement');
})
.then(characteristic => {
  return characteristic.readValue();
})
.then(value => {
  console.log('Heart rate:', value.getUint8(1));
})
.catch(error => {
  console.error('Error:', error);
});
```

## Compatibility Considerations

### When to Use Web Bluetooth

✅ **Good Use Cases:**
- Web-based IoT dashboards
- Health/fitness data collection
- Smart device control panels
- Location-aware services with Bluetooth beacons
- Cross-platform device interaction

### When NOT to Use Web Bluetooth

❌ **Poor Use Cases:**
- Applications requiring iOS support
- Browser extensions (limited API availability)
- Requirements for 100% browser compatibility
- Applications requiring background operation without user interaction

### Fallback Strategies

1. **Progressive Enhancement:** Provide fallback functionality for unsupported browsers
2. **Native App Redirects:** Offer native app alternatives for unsupported platforms
3. **Alternative Protocols:** Consider WebUSB or WebHID as alternatives
4. **Graceful Degradation:** Ensure core functionality works without Bluetooth connectivity

## Additional Information

### Data Format Support

- **GATT Services & Characteristics:** Full support for standard and custom GATT profiles
- **UUID Handling:** Support for 16-bit, 32-bit, and 128-bit UUIDs
- **Characteristic Descriptors:** Access to descriptors for detailed characteristic information

### Known Issues & Workarounds

- Some devices may have intermittent connection issues on certain OS versions
- Permission dialogs vary by browser implementation
- Device discovery can be slow depending on environment and number of devices
- Some GATT services may require additional permission/pairing at OS level

### Future Development

The Web Bluetooth API continues to evolve with potential enhancements including:
- Improved discovery mechanisms
- Expanded GATT support
- Better performance characteristics
- Additional device filtering options

---

**Last Updated:** December 2024
**Data Source:** CanIUse Feature Database
**Specification Version:** Maintained by Web Bluetooth Community Group
