# Promise.prototype.finally

## Overview

The `finally()` method is called on a Promise and executes a callback function when the promise is settled, regardless of whether it was fulfilled or rejected. This provides a way to run code after a promise completes without caring about its outcome.

## Description

When the promise is settled—whether fulfilled or rejected—the specified callback function is executed. The `finally()` method always returns a new promise that will:

- Execute the callback function
- Return the original promise's value/reason if the callback doesn't throw
- Propagate any error thrown by the callback

## Specification Status

**Status:** Other (Standard)
**Specification:** [ECMAScript Promise.prototype.finally](https://tc39.es/ecma262/#sec-promise.prototype.finally)

## Categories

- JavaScript (JS)

## Benefits & Use Cases

### Resource Cleanup
Execute cleanup code regardless of promise outcome:
```javascript
fetch(url)
  .then(response => response.json())
  .catch(error => console.error(error))
  .finally(() => {
    // Hide loading spinner, close connections, etc.
    hideLoadingSpinner();
  });
```

### State Management
Reset application state after async operations:
```javascript
loadData()
  .then(data => updateUI(data))
  .catch(error => showError(error))
  .finally(() => {
    isLoading = false;
  });
```

### Transaction Finalization
Ensure transaction-related code runs regardless of success/failure:
```javascript
processTransaction()
  .then(result => logSuccess(result))
  .catch(error => logFailure(error))
  .finally(() => {
    releaseTransactionLock();
  });
```

### Cleaner Code
Avoid code duplication between `.then()` and `.catch()` handlers:
```javascript
// Before: Duplication
operation()
  .then(result => {
    cleanup();
    return result;
  })
  .catch(error => {
    cleanup(); // Duplicated
    throw error;
  });

// After: DRY with finally()
operation()
  .then(result => result)
  .catch(error => { throw error; })
  .finally(() => cleanup());
```

## Browser Support

| Browser | First Supported | Current Status |
|---------|-----------------|----------------|
| Chrome | 63 | ✅ Supported |
| Firefox | 58 | ✅ Supported |
| Safari | 11.1 | ✅ Supported |
| Edge | 18 | ✅ Supported |
| Opera | 50 | ✅ Supported |
| Internet Explorer | — | ❌ Not Supported |
| Opera Mini | — | ❌ Not Supported |

### Mobile Browser Support

| Platform | Browser | First Supported |
|----------|---------|-----------------|
| iOS Safari | 11.3+ | ✅ Supported |
| Android | 4.4+ | ✅ Mostly Supported* |
| Android Chrome | Latest | ✅ Supported |
| Android Firefox | Latest | ✅ Supported |
| Samsung Internet | 8.2+ | ✅ Supported |

*Android browser support varies by version and manufacturer

### Legacy Browser Status

| Browser | Status | Notes |
|---------|--------|-------|
| IE 5.5-11 | ❌ Not Supported | No plans for support |
| Opera Mini (All versions) | ❌ Not Supported | Limited JS engine |
| BlackBerry 7-10 | ❌ Not Supported | Legacy platform |
| Windows Phone IE Mobile | ❌ Not Supported | Legacy platform |

## Global Usage Statistics

- **Global Support:** 92.72% of users
- **No Support:** 0% (nearly universal adoption)

## Notes

- Internet Explorer and Opera Mini do not support this feature
- For legacy browser support, consider using the [core-js polyfill](https://github.com/zloirock/core-js#ecmascript-promise)
- The `finally()` callback always executes, making it ideal for cleanup operations
- Unlike `.then()` and `.catch()`, the `finally()` callback doesn't receive the promise's value or reason

## Related Resources

### Documentation
- [MDN Web Docs - Promise.prototype.finally](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally)

### Polyfills
- [core-js - ECMAScript Promise](https://github.com/zloirock/core-js#ecmascript-promise) - Provides polyfill for this feature and other Promise-related enhancements

## Code Examples

### Basic Usage
```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve('Success!'), 1000);
});

promise
  .then(result => console.log(result))
  .finally(() => console.log('Promise settled'));
```

### Error Handling
```javascript
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error))
  .finally(() => {
    console.log('Request complete');
    // Always runs
  });
```

### Cleanup Pattern
```javascript
async function fetchUserData(userId) {
  showLoading();
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } finally {
    hideLoading(); // Runs regardless of success/failure
  }
}
```

---

*Documentation generated from [Can I Use](https://caniuse.com) data for Promise.prototype.finally*
