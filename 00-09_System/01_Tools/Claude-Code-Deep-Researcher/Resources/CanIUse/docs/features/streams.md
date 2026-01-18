# Streams API

## Overview

**Streams** is a JavaScript API that provides a method of creating, composing, and consuming streams of data, which map efficiently to low-level I/O primitives and allow easy composition with built-in backpressure and queuing.

## Description

The Streams API enables developers to work with sequential data in a more efficient way. Streams allow you to:

- Process large amounts of data chunk by chunk, rather than loading everything into memory at once
- Create pipelines that transform data as it flows through multiple stages
- Handle backpressure automatically, preventing overwhelming the system with more data than it can process
- Compose multiple streams together for complex data processing workflows

This API is particularly useful for handling network responses, file uploads/downloads, real-time data processing, and any scenario involving sequential data handling.

## Specification Status

**Status:** Living Standard (LS)

- **Official Specification:** [WHATWG Streams Standard](https://streams.spec.whatwg.org/)
- **Repository:** [GitHub - whatwg/streams](https://github.com/whatwg/streams)

## Categories

- **JS API** - JavaScript Application Programming Interface

## Key Benefits & Use Cases

### Benefits
- **Memory Efficiency**: Process data incrementally rather than loading entire datasets into memory
- **Performance**: Automatic backpressure handling prevents system overload
- **Composability**: Chain multiple stream operations together seamlessly
- **Low-level I/O Integration**: Efficient mapping to underlying I/O primitives
- **Real-time Processing**: Handle streaming data sources naturally

### Common Use Cases
- Handling large file uploads/downloads
- Processing network responses chunk by chunk
- Real-time data pipelines (video, audio, sensor data)
- Data transformation and filtering workflows
- Building efficient data processing applications
- Consuming server-sent events (SSE) data

## Browser Support

### Support Legend
- **y** = Full support
- **a** = Partial/Alternative support with limitations (see notes)
- **d** = Disabled by default
- **u** = Unsupported/Partial
- **n** = Not supported

### Desktop Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| **Internet Explorer** | All | n | Not supported |
| **Internet Explorer** | 11 | n | Different API implementation |
| **Edge** | 12-13 | u | Unsupported |
| **Edge** | 14-18 | a | Partial support with limitations |
| **Edge** | 19+ | y | Full support |
| **Firefox** | 2-56 | n | Not supported |
| **Firefox** | 57-64 | n | Disabled by default |
| **Firefox** | 65-101 | a | Partial support with limitations |
| **Firefox** | 102+ | y | Full support |
| **Chrome** | 4-51 | n | Not supported |
| **Chrome** | 52-58 | a | Partial support (basic read only) |
| **Chrome** | 59-88 | a | Partial support with limitations |
| **Chrome** | 89+ | y | Full support |
| **Safari** | 3.1-9.1 | n | Not supported |
| **Safari** | 10-18.5 | a | Partial support with limitations |
| **Safari** | 26+ | a | Partial support with limitations |
| **Opera** | 9-38 | n | Not supported |
| **Opera** | 39-45 | a | Partial support (basic read only) |
| **Opera** | 46-75 | a | Partial support with limitations |
| **Opera** | 76+ | y | Full support |

### Mobile Browsers

| Platform | Version | Status | Notes |
|----------|---------|--------|-------|
| **iOS Safari** | 3.2-10.2 | n/u | Not supported |
| **iOS Safari** | 10.3+ | a | Partial support with limitations |
| **Android Browser** | All older versions | n | Not supported |
| **Android Browser** | 142+ | y | Full support |
| **Android Chrome** | 142+ | y | Full support |
| **Android Firefox** | 144+ | y | Full support |
| **Opera Mobile** | 10-80 | n | Not supported |
| **Opera Mobile** | 80+ | y | Full support |
| **Samsung Internet** | 4-6.4 | n | Not supported |
| **Samsung Internet** | 7.2-14.0 | a | Partial support with limitations |
| **Samsung Internet** | 15+ | y | Full support |
| **Opera Mini** | All | n | Not supported |

## Implementation Notes

### Limitations in Partial Support

When browsers show **partial support (a)**, the following limitations typically apply:

1. **BYOB Support** - No support for BYOB (Bring Your Own Buffer) stream readers
2. **WritableStream** - No support for the `WritableStream` interface
3. **Pipe Methods** - No support for `pipeTo()` or `pipeThrough()` methods
4. **Firefox-Specific** - Disabled by default behind feature flags:
   - `javascript.options.streams`
   - `dom.streams.enabled`

### Browser-Specific Notes

- **Internet Explorer 11**: Implements a different, non-standard API
- **Chrome 52-58**: Only basic read support available
- **Firefox 57-64**: Behind feature flags, not enabled by default
- **Safari/iOS Safari**: Limited WritableStream and pipe method support

## Global Usage Statistics

- **Full Support (y)**: 81.88% of users
- **Partial Support (a)**: 11.15% of users
- **No Support**: ~7% of users

## Related Resources

### Official Documentation
- [MDN: ReadableStream API](https://developer.mozilla.org/en/docs/Web/API/ReadableStream)
- [WHATWG Streams Specification](https://streams.spec.whatwg.org/)
- [GitHub Repository](https://github.com/whatwg/streams)

### Learning Resources
- [Jake Archibald's Blog: "Streams FTW"](https://jakearchibald.com/2016/streams-ftw/)

## Implementation Details

### Core Components

The Streams API consists of three main interfaces:

1. **ReadableStream**: Represents a source of data that can be read from
2. **WritableStream**: Represents a destination that can be written to
3. **TransformStream**: Represents a stream that transforms data as it passes through

### API Features

- Readable streams with backpressure support
- Writable streams with queue management
- Transform streams for data processing
- Pipe connections (with limitations in partial support)
- Queuing strategies

## Recommendations

### When to Use Streams

- **Large Data Handling**: For files larger than available memory
- **Real-time Data**: Processing continuous data streams
- **Network Operations**: Efficient handling of HTTP responses
- **Data Pipelines**: Multi-stage data transformation workflows

### Compatibility Considerations

- Modern browsers (Chrome 89+, Firefox 102+, Safari 10+, Edge 89+) have excellent support
- Mobile support is improving with Android and Samsung Internet showing full support in recent versions
- For legacy browser support, consider polyfills or fallback approaches
- Test BYOB and WritableStream support specifically before using in production

### Browser Support Summary

- **Modern Desktop**: Fully supported across all major browsers from 2020+
- **Recent Mobile**: Full support in modern Android and iOS devices
- **Legacy Support**: Limited to ReadableStream basics, WritableStream not available
- **Polyfills**: Available from npm for older browser environments

## See Also

- [Web APIs - Streams](/docs/features/)
- [Reading from Files](/docs/guides/file-handling/)
- [Fetch API](/docs/features/fetch/)
- [Promise API](/docs/features/promises/)
