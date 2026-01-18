# TextEncoder & TextDecoder

## Overview

**TextEncoder** and **TextDecoder** are JavaScript APIs for converting between strings and UTF-8 encoded bytes, providing essential text encoding and decoding functionality for modern web applications.

## Description

`TextEncoder` encodes a JavaScript string into bytes using the UTF-8 encoding and returns the resulting `Uint8Array` of those bytes. `TextDecoder` does the reverse, converting UTF-8 encoded bytes back into readable JavaScript strings.

These APIs are fundamental for working with:
- Binary data and byte arrays
- Network communication and protocols
- Cryptographic operations
- File I/O operations
- Web Workers and message passing

## Specification Status

**Status:** Living Standard (LS)
**Specification:** [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/#api)

The API is part of the WHATWG Encoding Standard and is actively maintained as a living standard, ensuring ongoing development and compatibility improvements.

## Categories

- **JavaScript API** - Core browser JavaScript API for text encoding/decoding operations

## Benefits & Use Cases

### Primary Benefits

1. **Native UTF-8 Support** - Direct string-to-bytes conversion without external libraries
2. **Performance** - Optimized native implementation for efficient encoding/decoding
3. **Standardization** - Cross-browser standard API with consistent behavior
4. **Simplicity** - Clean, straightforward API for common text operations
5. **Web Worker Support** - Available in worker threads for background processing

### Common Use Cases

- **Data Serialization** - Converting strings to bytes for network transmission
- **Cryptographic Operations** - Preparing text data for hashing and encryption
- **File Operations** - Encoding/decoding text when working with File APIs
- **Binary Protocols** - Handling text portions of binary communication protocols
- **Web Workers** - Sending serialized data between main thread and workers
- **Storage APIs** - Preparing data for IndexedDB and other storage mechanisms
- **Message Encoding** - Encoding messages for postMessage operations

## Browser Support

### Support Legend
- ✅ **Supported** - Full support in current and recent versions
- ⚠️ **Partial** - Limited support or available with flags
- ❌ **Not Supported** - No support available
- **n** - Not supported
- **y** - Supported
- **a** - Partially supported with notes

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | v38 (2014) | ✅ Fully Supported | Available since early versions |
| **Edge** | v79 (2020) | ✅ Fully Supported | Full support in Chromium-based versions |
| **Firefox** | v20 (2013) | ✅ Fully Supported | Partial in v19, full support from v20+ |
| **Safari** | v10.1 (2016) | ✅ Fully Supported | Available in recent macOS versions |
| **Opera** | v25 (2014) | ✅ Fully Supported | Available in modern versions |
| **Internet Explorer** | ❌ Not Supported | ❌ Never | IE 11 and earlier do not support this API |

### Mobile Browsers

| Platform | Browser/Version | Status |
|----------|-----------------|--------|
| **iOS Safari** | 10.3+ | ✅ Fully Supported |
| **Android** | 4.4+ | ✅ Fully Supported (recent) |
| **Samsung Internet** | 4.0+ | ✅ Fully Supported |
| **Opera Mobile** | 80+ | ✅ Fully Supported |
| **Android Chrome** | Current | ✅ Fully Supported |
| **Android Firefox** | Current | ✅ Fully Supported |
| **Opera Mini** | All versions | ❌ Not Supported |
| **IE Mobile** | All versions | ❌ Not Supported |

### Global Support Statistics

- **Global Usage Support:** 93.19%
- **Partial Support:** 0%
- **Vendor Prefix Not Required**

## API Reference

### TextEncoder

```javascript
// Create a new TextEncoder instance
const encoder = new TextEncoder();

// Encode a string to UTF-8 bytes
const string = "Hello, World!";
const uint8Array = encoder.encode(string);
console.log(uint8Array); // Uint8Array(13) [ 72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100, 33 ]

// Get encoding name
console.log(encoder.encoding); // "utf-8"

// Encode into existing buffer
const buffer = new Uint8Array(20);
const result = encoder.encodeInto(string, buffer);
console.log(result); // { read: 13, written: 13 }
```

### TextDecoder

```javascript
// Create a new TextDecoder instance
const decoder = new TextDecoder();

// Decode bytes to string
const uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
const string = decoder.decode(uint8Array);
console.log(string); // "Hello"

// Streaming decoding
const chunk1 = new Uint8Array([72, 101, 108]);
const chunk2 = new Uint8Array([108, 111]);
console.log(decoder.decode(chunk1, { stream: true })); // "Hel"
console.log(decoder.decode(chunk2));                    // "lo"
```

## Implementation Examples

### Basic Encoding/Decoding

```javascript
// Encode
const text = "JavaScript";
const encoded = new TextEncoder().encode(text);
console.log(encoded); // Uint8Array [ 74, 97, 118, 97, 83, 99, 114, 105, 112, 116 ]

// Decode
const decoded = new TextDecoder().decode(encoded);
console.log(decoded); // "JavaScript"
```

### Working with Binary Data

```javascript
// Convert JSON to bytes
const data = { name: "John", age: 30 };
const jsonString = JSON.stringify(data);
const bytes = new TextEncoder().encode(jsonString);

// Store or transmit bytes
// Later, recover the data
const recoveredString = new TextDecoder().decode(bytes);
const recoveredData = JSON.parse(recoveredString);
```

### Web Worker Communication

```javascript
// Main thread
const worker = new Worker('worker.js');
const message = "Hello from main thread";
const encoded = new TextEncoder().encode(message);
worker.postMessage(encoded);

// Worker
self.onmessage = (event) => {
  const decoded = new TextDecoder().decode(event.data);
  console.log(decoded); // "Hello from main thread"
};
```

## Notes

### Firefox Consideration
- **Note #1:** TextEncoder/TextDecoder were not available in Web Workers in Firefox 19
- **Resolution:** Full support (including Web Workers) from Firefox 20 onwards

### General Notes

- **Pure UTF-8:** Both APIs work exclusively with UTF-8 encoding
- **No Configuration:** Cannot specify alternative encodings (UTF-8 only)
- **Web Workers:** Supported in all modern browsers (with noted Firefox exception)
- **Performance:** Native implementation is highly optimized
- **Memory Efficient:** Uint8Array provides zero-copy buffer interaction

## Fallback & Polyfills

For Internet Explorer support, consider using polyfills:

```javascript
// Simple polyfill check
if (typeof TextEncoder === 'undefined') {
  console.warn('TextEncoder not supported, consider using a polyfill');
}

// Many popular libraries provide polyfills:
// - text-encoding library
// - encoding polyfill
```

However, modern development typically targets browsers with native TextEncoder support.

## Related APIs

- [Encoding Standard Specification](https://encoding.spec.whatwg.org/)
- [Blob API](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- [ArrayBuffer and Typed Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays)
- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [SubtleCrypto API](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## References & Resources

### Official Documentation

- [MDN Web Docs - TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)
- [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/#api)

### Bug Tracking

- [WebKit Bug 160653 - Support TextEncoder & TextDecoder APIs](https://bugs.webkit.org/show_bug.cgi?id=160653)

### Learning Resources

- [MDN TextDecoder Documentation](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder)
- [Can I Use - TextEncoder & TextDecoder](https://caniuse.com/textencoder)

## Compatibility Summary

TextEncoder and TextDecoder have achieved excellent cross-browser support, with over 93% global usage coverage. The APIs are stable and standardized, making them safe for production use in modern web applications. The only notable gap is legacy Internet Explorer versions and Opera Mini, which are typically not targets for modern web development.

For any project targeting modern browsers (2016 and later), TextEncoder and TextDecoder can be safely used without fallbacks or polyfills.
