# BroadcastChannel API

## Overview

The **BroadcastChannel API** enables scripts running in the same origin but within different browsing contexts (windows, tabs, frames, and workers) to send messages to each other. This is a powerful tool for cross-context communication in modern web applications.

## Description

BroadcastChannel allows you to create a named channel and broadcast messages to all other browsing contexts that are subscribed to the same channel name. This is particularly useful for:

- Keeping multiple tabs/windows synchronized
- Sharing state across browser contexts
- Coordinating actions between worker threads and the main thread
- Building real-time collaborative features
- Cache invalidation across contexts

## Specification

**Status:** Living Standard

**Specification Link:** [HTML Standard - Broadcasting to Other Browsing Contexts](https://html.spec.whatwg.org/multipage/comms.html#broadcasting-to-other-browsing-contexts)

The BroadcastChannel API is part of the WHATWG HTML specification and continues to evolve alongside the web platform standards.

## Categories

- **JavaScript API**

## Benefits and Use Cases

### Key Benefits

1. **Cross-Tab Communication**: Synchronize state and events across multiple browser tabs or windows
2. **Worker Coordination**: Communicate between Web Workers, Shared Workers, and the main thread
3. **No Server Required**: Client-side only solution that doesn't require backend infrastructure
4. **Simple API**: Easy-to-use interface with `postMessage()` and `message` event
5. **Same-Origin Safe**: Inherent security through same-origin policy enforcement

### Common Use Cases

| Use Case | Description |
|----------|-------------|
| **Tab Synchronization** | Keep user session state synchronized across all open tabs of your application |
| **Cache Invalidation** | Notify all tabs when cache needs to be refreshed or data is updated |
| **Dark Mode Toggle** | Broadcast theme changes to all open windows instantly |
| **User Authentication** | Notify all tabs when user logs in or out |
| **Real-Time Collaboration** | Coordinate collaborative editing sessions across contexts |
| **Worker Communication** | Send commands or data between main thread and background workers |
| **Analytics Events** | Broadcast analytics events to prevent duplicate tracking |
| **Progress Tracking** | Monitor file uploads or long-running operations across windows |

## Basic Usage

### Creating a Channel

```javascript
// Open a broadcast channel
const channel = new BroadcastChannel('my-channel');

// Send a message
channel.postMessage({ type: 'update', data: 'Hello from Tab 1' });

// Listen for messages
channel.onmessage = (event) => {
  console.log('Received:', event.data);
};

// Close the channel when done
channel.close();
```

### Example: Theme Synchronization

```javascript
// Dark mode toggle code in one tab
const themeChannel = new BroadcastChannel('theme');

function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark');

  // Broadcast the change to all tabs
  themeChannel.postMessage({ theme: isDark ? 'dark' : 'light' });
}

// Listen for theme changes from other tabs
themeChannel.onmessage = (event) => {
  if (event.data.theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};
```

## Browser Support

### Summary

BroadcastChannel has excellent support across modern browsers with **92.62% global usage**. The API is fully supported in Chrome, Firefox, Safari, Edge, and Opera.

### Detailed Support Table

| Browser | First Version with Full Support | Status |
|---------|--------------------------------|--------|
| **Chrome** | 54+ | ✅ Full Support |
| **Edge** | 79+ | ✅ Full Support |
| **Firefox** | 38+ | ✅ Full Support |
| **Safari** | 15.4+ | ✅ Full Support |
| **Opera** | 41+ | ✅ Full Support |
| **iOS Safari** | 15.4+ | ✅ Full Support |
| **Android Chrome** | 142+ | ✅ Full Support |
| **Android Firefox** | 144+ | ✅ Full Support |
| **Samsung Internet** | 7.2+ | ✅ Full Support |
| **Opera Mini** | — | ❌ Not Supported |
| **Internet Explorer** | — | ❌ Not Supported |
| **IE Mobile** | — | ❌ Not Supported |
| **BlackBerry** | — | ❌ Not Supported |

### Support by Generation

#### Desktop Browsers
- **Chrome/Edge/Brave**: Full support since Chrome 54 (2016)
- **Firefox**: Full support since Firefox 38 (2015)
- **Safari**: Full support since Safari 15.4 (2022)
- **Opera**: Full support since Opera 41 (2016)

#### Mobile Browsers
- **iOS Safari**: Full support since version 15.4 (2022)
- **Android Browser**: Full support (latest versions)
- **Samsung Internet**: Full support since version 7.2 (2017)
- **Opera Mobile**: Full support since version 80 (2020)

#### Known Unsupported
- Internet Explorer (all versions)
- Opera Mini (all versions)
- Older Android versions (pre-5.0)

## API Reference

### Constructor

```javascript
const channel = new BroadcastChannel(name);
```

**Parameters:**
- `name` (string): The name of the channel to connect to. All contexts using the same name can communicate.

### Methods

#### `postMessage(message)`
Sends a message to all listeners on the channel (excluding the sender).

```javascript
channel.postMessage({ type: 'action', payload: data });
```

#### `close()`
Closes the channel and stops listening for messages.

```javascript
channel.close();
```

### Events

#### `message` Event
Fired when a message is received from another context on the same channel.

```javascript
channel.addEventListener('message', (event) => {
  console.log('Data:', event.data);
});
```

#### `messageerror` Event
Fired when a message cannot be deserialized.

```javascript
channel.addEventListener('messageerror', (event) => {
  console.error('Message error:', event);
});
```

## Polyfills and Fallbacks

For applications that need to support older browsers, there are several polyfill options:

### Recommended Polyfills

1. **[broadcast-channel](https://github.com/pubkey/broadcast-channel)**
   - Uses LocalStorage, IndexedDB, or WebSockets as fallbacks
   - Maintains API compatibility
   - Actively maintained

### Fallback Strategies

If BroadcastChannel is not available, consider alternatives:

```javascript
// Check for support
if (typeof BroadcastChannel !== 'undefined') {
  // Use native BroadcastChannel
} else {
  // Use fallback (polyfill, localStorage, etc.)
}
```

#### LocalStorage-based Fallback

```javascript
function broadcastMessage(channel, data) {
  try {
    const event = new CustomEvent('broadcast-message', {
      detail: { channel, data }
    });
    localStorage.setItem(`bc_${channel}`, JSON.stringify(data));
    window.dispatchEvent(event);
  } catch (e) {
    console.warn('Broadcast fallback failed:', e);
  }
}
```

## Important Notes and Considerations

### Security

- BroadcastChannel is **same-origin only**: Messages can only be sent between contexts of the same origin
- Cross-origin contexts cannot communicate via BroadcastChannel
- Consider this when designing multi-domain applications

### Performance

- BroadcastChannel is **optimized for infrequent, small messages**
- Avoid broadcasting large objects or high-frequency updates
- For real-time data synchronization, consider WebSockets or SSE
- Keep message payloads small to minimize memory and CPU overhead

### Best Practices

1. **Use Descriptive Channel Names**: Choose meaningful names to avoid conflicts
2. **Clean Up Channels**: Always call `close()` when the channel is no longer needed
3. **Handle Errors**: Listen to `messageerror` events for malformed data
4. **Validate Messages**: Validate message structure and content for security
5. **Avoid Circular Communication**: Be careful not to create infinite message loops
6. **Keep Messages Serializable**: Only send data that can be cloned with structured cloning

### Structured Cloning

BroadcastChannel uses [structured cloning](https://developer.mozilla.org/en-US/docs/Glossary/Structured_clone) to serialize messages. The following types are supported:

- Primitives: undefined, null, boolean, number, string, symbol
- Objects: Object, Array, Map, Set, Date, RegExp
- Typed Arrays: All typed array types
- Blobs and Files
- ImageBitmaps

The following types are NOT supported:
- Functions
- DOM Nodes
- Error objects (properties are lost)

## Known Issues and Limitations

### No Known Critical Bugs

As of the latest data, there are no reported critical bugs affecting BroadcastChannel functionality across supported browsers.

### Browser-Specific Notes

- **Safari (macOS/iOS)**: Full support as of version 15.4
- **Chrome/Edge**: Fully stable and consistent behavior
- **Firefox**: Excellent compatibility with all standard features
- **Opera**: Full feature parity with Chromium base

### Limitations

1. **Same-Origin Only**: Cannot communicate across different origins
2. **No Message Ordering Guarantees**: Messages may arrive out of order in rare cases
3. **Unidirectional Broadcasting**: Messages go to all listeners except the sender
4. **Not Persistent**: Messages are lost if no listener is active
5. **No Built-in Queuing**: Messages sent when no listener is active are discarded

## Related Resources

### Official Documentation

- [MDN Web Docs - BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)

### Polyfills and Shims

- [broadcast-channel (GitHub)](https://github.com/pubkey/broadcast-channel) - Feature-complete polyfill with multiple fallback strategies

### Related APIs

- **SharedWorker**: For shared computation across multiple browsing contexts
- **Service Worker**: For background tasks and offline functionality
- **MessagePort**: For direct, bidirectional communication
- **WebSocket**: For server-based real-time communication
- **PostMessage**: For direct parent-child context communication

### Use Case Examples

- Building collaborative editing applications
- Implementing real-time synchronization across tabs
- Coordinating background workers
- Building robust multi-tab applications

## Migration Guide

### From localStorage-based Communication

```javascript
// Old: Using localStorage events
// Problem: All contexts listen to all changes

window.addEventListener('storage', (event) => {
  if (event.key === 'user-data') {
    updateUserData(JSON.parse(event.newValue));
  }
});

// New: Using BroadcastChannel
// Better: Only intended messages are received

const channel = new BroadcastChannel('user-data');
channel.onmessage = (event) => {
  updateUserData(event.data);
};

// Send update
channel.postMessage(newUserData);
```

### From MessagePort

```javascript
// Use BroadcastChannel for one-to-many communication
// Use MessagePort for one-to-one, bidirectional communication

// BroadcastChannel: Simple broadcasting
const broadcast = new BroadcastChannel('updates');
broadcast.postMessage(data); // Goes to all listeners

// MessagePort: Direct bidirectional communication
const { port1, port2 } = new MessageChannel();
worker.postMessage({ port: port2 }, [port2]);
port1.postMessage(data); // Goes to specific recipient
```

## Global Usage Statistics

- **Full Support**: 92.62% of global users
- **No Support**: 7.38% of global users

This high adoption rate makes BroadcastChannel a reliable choice for modern web applications, with graceful fallback options available for the remaining user base.

---

**Last Updated:** 2025-12-13
**Data Source:** CanIUse.com
**Specification Status:** Living Standard
