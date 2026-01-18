# XMLHttpRequest Advanced Features (XHR2)

## Overview

**XMLHttpRequest advanced features**, formerly known as XMLHttpRequest Level 2, represents a significant update to the original XHR specification. These features have been integrated into the modern XMLHttpRequest specification and provide essential functionality for contemporary web applications requiring advanced data transfer and progress tracking capabilities.

## Specification Details

- **Current Specification**: [XMLHttpRequest - WHATWG Living Standard](https://xhr.spec.whatwg.org/)
- **Specification Status**: Living Standard
- **Previous Standard**: [XMLHttpRequest Level 2 (W3C Working Draft)](https://www.w3.org/TR/2012/WD-XMLHttpRequest-20120117/)

## Key Features & Benefits

### File Uploads
Enable users to upload files through XMLHttpRequest with fine-grained control and progress monitoring.

### Transfer Progress Information
Monitor the progress of data transfers in real-time using progress events, allowing for accurate progress bars and user feedback.

### FormData API
Send form data (including multipart form data) directly through XMLHttpRequest without manual serialization, supporting both structured and file data.

### Response Type Support
Enhanced response type handling including:
- `json` - Automatic JSON parsing
- `blob` - Binary data handling
- `arraybuffer` - Low-level binary data
- `document` - XML/HTML document parsing
- `text` - Plain text (default)

### Timeout Handling
Set request timeouts and handle timeout events for improved error handling and user experience.

### Event Handling
Comprehensive event system including:
- `loadstart` - Transfer begins
- `progress` - Data transfer in progress
- `abort` - Request aborted
- `error` - Request failed
- `load` - Request completed successfully
- `timeout` - Request timed out
- `loadend` - Transfer finished (regardless of success/failure)

## Categories

- **DOM API**
- **JavaScript API**

## Browser Support Matrix

### Legend
- ✅ **Y** - Full support
- ⚠️ **A** - Partial support
- ❌ **N** - No support
- ❓ **U** - Unknown

### Desktop Browsers

#### Internet Explorer & Edge
| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Internet Explorer | 5.5-9 | ❌ No Support | |
| Internet Explorer | 10-11 | ⚠️ Partial | See known issues |
| Edge (Legacy) | 12-18 | ⚠️ Partial | Missing FormData functionality |
| Edge (Chromium) | 79+ | ✅ Full Support | Complete support |

#### Firefox
| Version Range | Status | Notes |
|---------------|--------|-------|
| 2-3 | ❌ No Support | |
| 3.5-4 | ⚠️ Partial | Limited feature support |
| 5-6 | ⚠️ Partial | Partial JSON & timeout support |
| 7-11 | ⚠️ Partial | Missing FormData improvements |
| 12-46 | ⚠️ Partial | Missing synchronous request support |
| 47+ | ✅ Full Support | Complete support |

#### Chrome
| Version Range | Status | Notes |
|---------------|--------|-------|
| 4-6 | ❓ Unknown Support | |
| 7-28 | ⚠️ Partial | Growing feature support |
| 29-49 | ⚠️ Partial | Missing synchronous request support |
| 50+ | ✅ Full Support | Complete support |

#### Safari
| Version | Status | Notes |
|---------|--------|-------|
| 3.1-4 | ❌ No Support | |
| 5-6 | ⚠️ Partial | Limited features |
| 6.1-10.1 | ⚠️ Partial | Missing FormData improvements |
| 11+ | ✅ Full Support | Complete support |

#### Opera
| Version Range | Status | Notes |
|---------------|--------|-------|
| 9-11.6 | ❌ No Support | |
| 12-16 | ⚠️ Partial | Early partial support |
| 17-36 | ⚠️ Partial | Growing feature support |
| 37+ | ✅ Full Support | Complete support |

### Mobile Browsers

#### iOS Safari
| Version Range | Status | Notes |
|---------------|--------|-------|
| 3.2-4.3 | ❌ No Support | |
| 5.0-6.1 | ⚠️ Partial | Limited feature support |
| 7.0-10.3 | ⚠️ Partial | Missing FormData improvements |
| 11.0+ | ✅ Full Support | Complete support |

#### Android Browser
| Version Range | Status | Notes |
|---------------|--------|-------|
| 2.1-2.3 | ❌ No Support | |
| 3-4.1 | ⚠️ Partial | Basic support with limitations |
| 4.2-4.3 | ⚠️ Partial | Missing blob responseType |
| 4.4 | ⚠️ Partial | Missing JSON support |
| 4.4.3+ | ⚠️ Partial | Missing FormData improvements |
| 142+ | ✅ Full Support | Complete support |

#### Chrome Android
| Version | Status |
|---------|--------|
| 142+ | ✅ Full Support |

#### Firefox Android
| Version | Status |
|---------|--------|
| 144+ | ✅ Full Support |

#### Opera Mobile
| Version Range | Status | Notes |
|---------------|--------|-------|
| 10-11.5 | ❌ No Support | |
| 12-12.1 | ⚠️ Partial | Missing FormData improvements |
| 80+ | ✅ Full Support | Complete support |

#### Samsung Internet
| Version | Status |
|---------|--------|
| 4 | ⚠️ Partial |
| 5.0+ | ✅ Full Support |

#### Other Mobile Browsers
| Browser | Version | Status |
|---------|---------|--------|
| Opera Mini | All | ❌ No Support |
| IE Mobile | 10-11 | ⚠️ Partial |
| UC Browser | 15.5+ | ✅ Full Support |
| QQ Browser | 14.9+ | ✅ Full Support |
| Baidu Browser | 13.52+ | ✅ Full Support |
| KaiOS | 2.5+ | ✅ Full Support |

### Overall Global Usage
- **Full Support**: 93.05%
- **Partial Support**: 0.54%
- **No Support**: ~6.41%

## Known Issues & Limitations

### Issue #1: JSON Response Type Not Supported
Several versions of older browsers do not support `json` as a `responseType` value. This affects:
- Firefox 3.5-5
- Chrome 7-28
- Safari 5-6
- Opera 15-16
- Android browsers 3-4.2
- iOS Safari 5.0-7.0
- BlackBerry 7

**Workaround**: Manually parse JSON responses using `JSON.parse(xhr.responseText)` for older browsers.

### Issue #2: Timeout Property Not Supported
The `.timeout` property and `.ontimeout` event handler are not available in:
- Firefox 3.5-10
- Chrome 7-28
- Safari 5-6
- Opera 15-16
- Android browsers 3-4.2
- iOS Safari 5.0-7.0
- BlackBerry browsers

**Workaround**: Implement timeout handling using `setTimeout()` with manual abort logic.

### Issue #3: Blob Response Type Not Supported
The `blob` responseType is not available in:
- Firefox 3.5-4
- Chrome 7-28
- Android browsers 3-4.1
- iOS Safari 5.0-7.0

**Workaround**: Use `arraybuffer` responseType and manually convert to Blob.

### Issue #4: FormData Functionality Gaps
Many browsers have incomplete FormData support or are missing newer FormData APIs:
- Firefox 3.5-46
- Chrome 7-49
- Safari 5-11
- Opera 12-36
- Android browsers 3-4.4.3
- iOS Safari 5.0-10.3
- Edge 12-18
- IE 10-11 (with synchronous request limitations)

**Workaround**: Check for specific API availability or use polyfills for missing functionality.

### Issue #5: Firefox Progress Event Limitations
Firefox 3.5-3.6 provide only partial support, including support for the `progress` event but not other advanced features.

### Issue #6: WebKit onloadend Event
WebKit versions 535 and older (before r103502) do not implement the `onloadend` event. This affects Safari 4-5 and early Chrome versions.

### Issue #7: Synchronous Requests Phased Out
IE 10 and 11 do not support synchronous XMLHttpRequest operations. Modern browsers are phasing out synchronous requests due to their negative impact on browser performance and user experience.

**Impact**: `XMLHttpRequest.open()` with `async: false` will fail or be ignored.

**Recommendation**: Always use asynchronous requests; synchronous requests block the UI thread.

### Issue #8: Chrome iOS Progress Event
The `progress` event is reported not to work in Chrome for iOS.

### Issue #9: Internet Explorer Timeout Property Timing
In Internet Explorer, the `.timeout` property may only be set after calling `open()` and before calling `send()`. Setting it at other times may be ignored.

**Example of correct IE timeout usage:**
```javascript
xhr.open('GET', url);
xhr.timeout = 5000;  // Must be set after open, before send
xhr.send();
```

## Related Resources

### Documentation
- [MDN Web Docs - FormData](https://developer.mozilla.org/en/XMLHttpRequest/FormData)
- [WebPlatform Docs - XMLHttpRequest](https://webplatform.github.io/docs/apis/xhr/XMLHttpRequest)

### Tools & Polyfills
- [FormData Polyfill](https://github.com/jimmywarting/FormData) - Comprehensive FormData implementation for environments lacking full support

## Additional Notes

The FormData API has received significant updates since the original XMLHttpRequest Level 2 specification was released. For comprehensive FormData support information, refer to the dedicated [FormData API documentation](/mdn-api_formdata).

### Migration from XMLHttpRequest
While XMLHttpRequest advanced features are well-supported across modern browsers, newer applications should consider using the **Fetch API** as the modern replacement for XMLHttpRequest. The Fetch API provides:
- Promise-based API (better async/await support)
- Simpler, cleaner syntax
- Better separation of concerns
- Superior streaming support

However, XMLHttpRequest remains important for:
- Legacy browser support (if required)
- Upload progress tracking (more reliable than Fetch in some scenarios)
- Existing codebases and established patterns

## Recommendations

### For Modern Applications
- Use the **Fetch API** for new projects
- Ensure XMLHttpRequest advanced features are available in target browsers
- Implement proper error handling for older browser support

### For Legacy Browser Support
- Include polyfills for missing FormData functionality
- Implement manual timeout handling for IE10/IE11
- Use feature detection before using advanced response types
- Consider using libraries that abstract these differences (e.g., axios, jQuery AJAX)

### Best Practices
- Always use asynchronous requests (never use `async: false`)
- Implement comprehensive error handling with timeout fallbacks
- Use appropriate response types (json, blob, etc.) when supported
- Provide user feedback for long-running transfers using progress events
- Test in target browsers to verify feature support

---

**Last Updated**: 2025-12-13
**Feature Status**: Living Standard (Integrated into main XMLHttpRequest specification)
