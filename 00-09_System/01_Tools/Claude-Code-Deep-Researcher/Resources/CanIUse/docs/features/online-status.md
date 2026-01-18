# Online/Offline Status API

## Overview

The Online/Offline Status API provides web developers with the ability to detect the user's network connectivity state. This feature includes events to indicate when the user becomes connected or disconnected (`online` and `offline` events) and the `navigator.onLine` property to check the current online status.

---

## Description

The Online/Offline Status API enables applications to respond to changes in network connectivity. When a user's browser detects a change in network status, it fires either an `online` or `offline` event on the `window` or `document.body`. Developers can also check the current connectivity status at any time using the `navigator.onLine` property, which returns a boolean value.

**Key Components:**
- **`navigator.onLine`**: A property that returns `true` if the browser has network connectivity, `false` otherwise
- **`online` event**: Fires on `window` when the browser detects it has network connectivity
- **`offline` event**: Fires on `window` when the browser detects loss of network connectivity

---

## Specification Status

**Status:** Living Standard (LS)

**Official Specification:** [WHATWG HTML Living Standard - Browser State](https://html.spec.whatwg.org/multipage/browsers.html#browser-state)

---

## Categories

- **JavaScript API**

---

## Benefits & Use Cases

### Primary Use Cases

1. **Progressive Application Enhancement**
   - Display offline indicators in the UI when connectivity is lost
   - Disable network-dependent features gracefully when offline

2. **Service Worker Integration**
   - Coordinate with Service Workers to manage offline-first strategies
   - Sync data when connectivity is restored

3. **User Experience Optimization**
   - Show appropriate messaging when functionality is unavailable due to offline status
   - Automatically retry failed operations when connectivity is restored

4. **Real-Time Applications**
   - Pause data synchronization when offline
   - Resume data syncing when online is restored
   - Manage live connection features (chat, notifications, etc.)

5. **Development & Debugging**
   - Test offline scenarios using browser "Offline" mode
   - Validate graceful degradation behavior

### Key Benefits

- **User Awareness**: Keep users informed about their connectivity status
- **Better Resilience**: Build more robust applications that handle network fluctuations
- **Improved UX**: Provide appropriate feedback and functionality based on connectivity
- **Enhanced Performance**: Reduce unnecessary network requests when offline

---

## Browser Support

### Support Legend

- ✅ **Yes (y)**: Full support
- ⚠️ **Partial (a)**: Partial or limited support with notes
- ❌ **No (n)**: No support
- ❓ **Unknown (u)**: Unknown or untested
- ⏸️ **Not Applicable (op_mini)**: Not applicable for this browser

### Desktop Browsers

| Browser | Minimum Version | Status | Notes |
|---------|-----------------|--------|-------|
| **Chrome** | 14+ | ✅ Full Support | Fully supported from v14 onwards |
| **Edge** | 12+ | ✅ Full Support | Full support in all versions |
| **Firefox** | 3.5+ | ✅ Full Support | Full support from v3.5, with caveats in earlier versions (see notes) |
| **Safari** | 5+ | ✅ Full Support | Full support from v5 onwards |
| **Opera** | 15+ | ✅ Full Support | Full support from v15 onwards |
| **Internet Explorer** | 9+ | ✅ Full Support | Limited support in IE8 (events only on document.body) |

### Mobile Browsers

| Browser | Minimum Version | Status | Notes |
|---------|-----------------|--------|-------|
| **iOS Safari** | 4.2+ | ✅ Full Support | Full support from iOS 4.2 onwards |
| **Android Browser** | 2.3+ | ✅ Full Support | Full support from Android 2.3 onwards |
| **Chrome Android** | Latest | ✅ Full Support | Fully supported |
| **Firefox Android** | Latest | ✅ Full Support | Fully supported |
| **Samsung Internet** | 4+ | ✅ Full Support | Full support from v4 onwards |
| **Opera Mobile** | 80+ | ✅ Full Support | Full support from v80 onwards |
| **UC Browser** | 15.5+ | ✅ Full Support | Supported from v15.5 onwards |
| **Opera Mini** | All | ❌ No Support | Not supported in any version |
| **IE Mobile** | 10+ | ✅ Full Support | Full support in v10+ |

### Regional/Alternative Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| **BlackBerry Browser** | 10 | ✅ Full Support | Full support in v10; v7 has partial support |
| **KaiOS Browser** | 2.5+ | ✅ Full Support | Full support from v2.5 onwards |
| **Baidu Browser** | 13.52+ | ✅ Full Support | Supported |
| **QQ Browser** | 14.9+ | ✅ Full Support | Supported |

---

## Usage Statistics

Based on global usage data:

- **Full Support (y)**: 93.59% of users
- **Partial Support (a)**: 0.09% of users

This indicates near-universal support for the Online/Offline Status API across modern browsers.

---

## Implementation Notes

### Important Caveats

1. **Not Just Internet Connectivity**
   - The `navigator.onLine` status does not necessarily mean connection to the internet itself
   - It may indicate connection to any network (local, VPN, etc.)
   - True internet connectivity requires additional validation (e.g., attempting a network request)

2. **Early Chrome and Safari Behavior**
   - Early versions of Chrome and Safari always reported `true` for `navigator.onLine`
   - This limitation no longer applies to modern versions

3. **Firefox Work Offline Mode**
   - Desktop Firefox responds to the status of its "Work Offline" mode
   - If not in offline mode, `navigator.onLine` is always `true`, regardless of actual network connectivity
   - See [Mozilla Bug #654579](https://bugzilla.mozilla.org/show_bug.cgi?id=654579) for details

4. **Event Attachment Points**
   - **IE8**: Supports events only on `document.body`, not on `window`
   - **Safari 7+**: Supports only `window` event listeners, not on `document.body`
   - Most modern browsers support both locations

5. **BlackBerry 7**
   - Appears to support `navigator.onLine` but not `online`/`offline` events

---

## Example Usage

### Basic Connectivity Check

```javascript
// Check current online status
if (navigator.onLine) {
  console.log('User is online');
} else {
  console.log('User is offline');
}
```

### Listening to Connectivity Changes

```javascript
// Listen for when the user comes online
window.addEventListener('online', () => {
  console.log('Connection restored');
  // Sync data, retry failed requests, etc.
});

// Listen for when the user goes offline
window.addEventListener('offline', () => {
  console.log('Connection lost');
  // Stop data sync, show offline message, etc.
});
```

### Handling User Feedback

```javascript
function updateOnlineStatus() {
  const status = document.getElementById('status');
  if (navigator.onLine) {
    status.textContent = 'Online';
    status.classList.remove('offline');
  } else {
    status.textContent = 'Offline';
    status.classList.add('offline');
  }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus(); // Check initial state
```

### Progressive Web App Example

```javascript
// Disable submit button when offline
const form = document.getElementById('myForm');
window.addEventListener('offline', () => {
  form.disabled = true;
  form.title = 'This form cannot be submitted while offline';
});

window.addEventListener('online', () => {
  form.disabled = false;
  form.title = '';
});
```

---

## Best Practices

1. **Don't Rely Solely on `navigator.onLine`**
   - Use as a hint, not definitive proof of connectivity
   - Always handle network failures gracefully with proper error handling
   - Consider implementing actual connectivity checks (e.g., fetch requests)

2. **Combine with Service Workers**
   - Use with Service Workers for effective offline-first strategies
   - Cache essential content for offline access
   - Queue requests to sync when connectivity is restored

3. **Provide User Feedback**
   - Always inform users when offline with clear visual indicators
   - Show helpful messages about what's unavailable
   - Reassure users that data will sync when online

4. **Graceful Degradation**
   - Disable network-dependent features when offline
   - Don't bombard users with error messages
   - Provide alternatives or offline functionality when possible

5. **Testing**
   - Test offline scenarios using browser developer tools
   - Use Firefox's "Work Offline" mode or Chrome's offline simulation
   - Validate that your application behaves correctly in both states

---

## Related APIs

- **[Service Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)**: Essential for offline-first web applications
- **[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)**: For making network requests with proper error handling
- **[Navigator Interface](https://developer.mozilla.org/en-US/docs/Web/API/Navigator)**: Container for the `onLine` property

---

## Resources

### Official Documentation

- [WHATWG HTML Specification - Browser State](https://html.spec.whatwg.org/multipage/browsers.html#browser-state)
- [MDN Web Docs - NavigatorOnLine.onLine](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine.onLine#Specification)

### Learning Resources

- [MDN - Online and Offline Events](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine)
- [Web.dev - Offline Cookbook](https://jakearchibald.com/2014/offline-cookbook/)
- [Service Worker Fundamentals](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

## Browser Compatibility Summary

| Category | Support Level | Details |
|----------|---------------|---------|
| **Desktop Browsers** | ✅ Excellent | All modern browsers fully supported (Chrome 14+, Firefox 3.5+, Safari 5+, Edge 12+) |
| **Mobile Browsers** | ✅ Excellent | Broadly supported (iOS 4.2+, Android 2.3+, Samsung Internet 4+) |
| **Legacy Browsers** | ⚠️ Limited | IE 8-11 supported with caveats; very old Safari/Chrome need testing |
| **Overall Global Coverage** | ✅ 93.59% | Near-universal support in modern web development |

---

**Last Updated:** 2024
**Data Source:** CanIUse.com
