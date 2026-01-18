# Background Sync API

## Overview

The **Background Sync API** provides one-off and periodic synchronization capabilities for Service Workers through the `onsync` event. This allows web applications to defer network requests until the user has stable connectivity, enabling reliable data synchronization even when the app is not actively in use.

## Specification

- **Status**: Unofficial/In Development
- **Specification**: [W3C WICG Background Sync Specification](https://wicg.github.io/BackgroundSync/spec/)
- **Category**: JavaScript API

## What is Background Sync?

Background Sync allows a web application to reliably make background HTTP requests with the help of a Service Worker. It's particularly useful for scenarios where:

- A user fills out a form but loses connection before submitting
- An app needs to sync data periodically without user interaction
- Requests fail temporarily and need automatic retry mechanisms
- Apps need to ensure critical data reaches the server

## Benefits and Use Cases

### Key Benefits

- **Offline-First Architecture**: Queue operations when offline and sync when connection restored
- **Improved User Experience**: Users don't need to manually retry failed requests
- **Battery Efficient**: Batch requests and sync at optimal times
- **Network Efficient**: Leverage native platform scheduling for better resource usage
- **Automatic Retries**: Built-in retry mechanisms with exponential backoff

### Common Use Cases

1. **Form Submissions**: Queue form data when offline, auto-submit when online
2. **Content Synchronization**: Sync notes, emails, or messages in background
3. **Analytics**: Batch send tracking events without blocking user interaction
4. **Media Uploads**: Queue photo/video uploads to sync in background
5. **Chat Applications**: Ensure messages are delivered when connection restored
6. **Collaborative Editing**: Sync document changes automatically
7. **E-commerce**: Guarantee order submissions even during connectivity issues

## Browser Support

### Support Legend

| Symbol | Meaning |
|--------|---------|
| **✅ Yes** | Full support |
| **⚠️ Under Development** | Experimental/In Development |
| **❌ No** | Not supported |

### Desktop Browsers

| Browser | First Version | Current Status |
|---------|---------------|----------------|
| Chrome | 49 | ✅ Yes (v49+) |
| Edge | 79 | ✅ Yes (v79+) |
| Firefox | — | ⚠️ Under Development (v146+) |
| Safari | — | ❌ Not Supported |
| Opera | 42 | ✅ Yes (v42+) |
| Internet Explorer | — | ❌ Not Supported |

### Mobile & Tablet Browsers

| Browser | First Version | Current Status |
|---------|---------------|----------------|
| Chrome Android | 49 | ✅ Yes (v142+) |
| Firefox Android | — | ❌ Not Supported (v144) |
| Safari iOS | — | ❌ Not Supported |
| Opera Mobile | 80 | ✅ Yes (v80+) |
| Samsung Internet | 5.0 | ✅ Yes (v5.0+) |
| UC Browser | 15.5 | ✅ Yes (v15.5+) |
| Opera Mini | — | ❌ Not Supported |
| Android Browser | 142 | ✅ Yes (v142+) |
| QQ Browser | 14.9 | ✅ Yes (v14.9+) |
| Baidu Browser | 13.52 | ✅ Yes (v13.52+) |

### Global Support Summary

**Global Usage**: ~80.26% of users have support for Background Sync API across all browsers

## Implementation Example

### Basic Service Worker Setup

```javascript
// Register for background sync
self.addEventListener('sync', event => {
  if (event.tag === 'sync-posts') {
    event.waitUntil(syncPosts());
  }
});

// Function to sync posts
async function syncPosts() {
  try {
    const db = await openDatabase();
    const posts = await db.getPendingPosts();

    for (const post of posts) {
      try {
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(post)
        });

        if (response.ok) {
          await db.removePendingPost(post.id);
        }
      } catch (error) {
        console.error('Failed to sync post:', error);
        throw error; // Trigger retry
      }
    }
  } catch (error) {
    console.error('Sync failed:', error);
    throw error;
  }
}
```

### Requesting Sync from Main App

```javascript
// Main application code
async function submitForm(data) {
  try {
    // Try immediate sync
    const response = await fetch('/api/data', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response;
  } catch (error) {
    // Save for later sync
    await saveForSync(data);

    // Request background sync
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register('data-sync');

    // Notify user
    showNotification('Saved offline - will sync when online');
  }
}
```

## Periodic Sync (Experimental)

The Background Sync API also supports periodic synchronization:

```javascript
// Request periodic sync
const registration = await navigator.serviceWorker.ready;
await registration.periodicSync.register('update-data', {
  minInterval: 24 * 60 * 60 * 1000 // Every 24 hours
});

// Handle periodic sync event
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-data') {
    event.waitUntil(updateData());
  }
});
```

## Known Limitations

### Browser Coverage

- **Firefox**: Not yet implemented; support is under consideration (see [Firefox Bug #1217544](https://bugzilla.mozilla.org/show_bug.cgi?id=1217544))
- **Safari**: No support for Background Sync API
- **IE/Legacy Edge**: Not supported

### Platform Limitations

- **iOS Safari**: No Service Worker support limits Background Sync availability
- **Opera Mini**: Limited support due to proxy architecture
- **Older Android Browsers**: Require specific browser versions

## Polyfills and Fallbacks

For browsers without native support, consider implementing a fallback strategy:

```javascript
async function queueForSync(data) {
  // Try to use Background Sync if available
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('data-sync');
      return;
    } catch (error) {
      console.warn('Background Sync not available, using fallback');
    }
  }

  // Fallback: Use periodic sync with IndexedDB
  const db = await openDatabase();
  await db.savePendingRequest(data);

  // Use fetch with retry
  retryFetch(data, 3);
}
```

## Permissions and Requirements

### Required Permissions

- Service Worker must be registered and active
- HTTPS connection (or localhost for development)
- User must have granted necessary permissions

### Manifest Requirements

```json
{
  "permissions": [
    "background_sync"
  ]
}
```

## Debugging and Tools

### Chrome DevTools

1. **Application Tab**: Service Workers > Sync Manager to view registered syncs
2. **Network Tab**: Simulated offline mode to test sync behavior
3. **Service Workers**: View sync registration status

### Testing Background Sync

```javascript
// Manual test in DevTools console
const registration = await navigator.serviceWorker.ready;

// Register sync
await registration.sync.register('test-sync');

// Go offline, trigger some action, then come online
// Check if sync event fires in Service Worker
```

## Related Resources

### Official Documentation

- [SyncManager on MDN Web Docs](https://developer.mozilla.org/docs/Web/API/SyncManager)
- [Google Developers: Introducing Background Sync](https://developers.google.com/web/updates/2015/12/background-sync)
- [W3C WICG Specification](https://wicg.github.io/BackgroundSync/spec/)

### Related APIs

- [Service Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

### Feature Tracking

- **Firefox Support**: [Mozilla Bug #1217544](https://bugzilla.mozilla.org/show_bug.cgi?id=1217544)
- **Chrome Platform**: Status tracked via [Chrome Features](https://www.chromestatus.com)

## Best Practices

### Do's

- ✅ Use HTTPS for all Background Sync operations
- ✅ Implement proper error handling and retry logic
- ✅ Store sync state in IndexedDB or similar persistent storage
- ✅ Test sync behavior in offline scenarios
- ✅ Provide user feedback about pending syncs
- ✅ Batch multiple requests when possible

### Don'ts

- ❌ Don't rely on Background Sync alone without fallback
- ❌ Don't sync sensitive data without encryption
- ❌ Don't ignore sync failures indefinitely
- ❌ Don't assume users have unlimited data
- ❌ Don't perform long-running operations in sync handlers

## Considerations for Cross-Browser Development

Given the limited browser support (notably missing in Safari and Firefox), consider:

1. **Feature Detection**: Always check for availability before use
2. **Graceful Degradation**: Implement fallback sync mechanisms
3. **Progressive Enhancement**: Use Background Sync as an enhancement, not a requirement
4. **Queue Management**: Maintain your own queue in storage as fallback
5. **User Communication**: Clearly indicate what data is pending sync

## Conclusion

The Background Sync API is a powerful tool for building reliable offline-first web applications. With strong support in Chrome, Edge, Opera, and many mobile browsers, it enables seamless data synchronization across connectivity interruptions. However, until Firefox and Safari implement support, a fallback strategy is essential for cross-browser applications.

For modern web applications targeting Chromium-based browsers and Android devices, Background Sync provides a robust foundation for building resilient, user-centric offline experiences.
