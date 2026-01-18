# Input Event

## Overview

The `input` event fires when the user changes the value of an `<input>` element, `<select>` element, or `<textarea>` element. Unlike the `change` event, which typically fires only after a form control loses focus, the `input` event fires immediately as the user modifies the value.

## Specification Status

**Status:** Living Standard (ls)

**Official Specification:** [HTML Living Standard - input event](https://html.spec.whatwg.org/multipage/forms.html#event-input-input)

## Categories

- DOM (Document Object Model)
- HTML5

## Description

### Key Differences from Change Event

The `input` event provides real-time feedback during user input, making it ideal for:
- Live validation
- Character counters
- Search-as-you-type functionality
- Real-time preview updates

In contrast, the `change` event only fires after the user finishes editing and the element loses focus.

## Use Cases & Benefits

### Common Applications

1. **Live Form Validation**
   - Provide immediate feedback on input validity
   - Display error messages as users type
   - Enable/disable form submission based on validation

2. **Character Counters**
   - Track remaining characters in text fields
   - Useful for limited-length inputs like social media posts

3. **Search Autocomplete**
   - Implement search-as-you-type functionality
   - Fetch and display results as users type

4. **Real-time Preview**
   - Update preview displays as users modify content
   - Live markdown preview, text formatting, etc.

5. **Data Synchronization**
   - Sync form data in real-time
   - Auto-save functionality

6. **Accessibility**
   - Announce changes to screen readers
   - Keep dynamic content up-to-date for assistive technologies

## Browser Support

### Support Legend

- **y** - Full support
- **a** - Partial/Alternate support (with limitations)
- **u** - Unknown/Unsupported
- **n** - Not supported

### Desktop Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | 4-14 | Unsupported | |
| Chrome | 15-34 | Full | #3 #4 |
| Chrome | 35-65 | Full | #4 |
| Chrome | 66+ | Full | |
| Firefox | 2 | Unknown | |
| Firefox | 3-3.5 | Partial | #2 #3 #4 |
| Firefox | 3.6-48 | Full | #3 #4 |
| Firefox | 49+ | Full | |
| Safari | 3.1-5 | Unknown | |
| Safari | 5.1 | Full | #3 #4 |
| Safari | 6 | Unknown | |
| Safari | 6.1+ | Full | |
| Edge | 12-18 | Full | #3 #5 |
| Edge | 79+ | Full | |
| Opera | 9-11.6 | Unknown/Partial | #2 |
| Opera | 12-12.1 | Full/Unknown | |
| Opera | 15-21 | Full | #3 #4 |
| Opera | 22+ | Full | |
| Internet Explorer | 5.5-8 | Not Supported | |
| Internet Explorer | 9 | Partial | #1 #3 #5 |
| Internet Explorer | 10-11 | Full | #3 #5 |

### Mobile Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| iOS Safari | 3.2-4.3 | Unknown | |
| iOS Safari | 5.0-7.1 | Full | #3 #4 |
| iOS Safari | 8-12.1 | Full | #4 |
| iOS Safari | 12.2+ | Full | #6 |
| Android Browser | 2.1-2.2 | Unknown | |
| Android Browser | 2.3-4.4.2 | Full | #3 #4 |
| Android Browser | 4.4.3+ | Full | #4 |
| Samsung Internet | 4+ | Full | #4 |
| Opera Mini | All | Not Supported | |
| UC Browser | 15.5+ | Full | |
| Baidu Browser | 13.52+ | Full | |
| QQ Browser | 14.9+ | Full | |
| KaiOS | 2.5+ | Full | |

### Global Browser Support Statistics

- **Full Support (y):** 93.6% of users
- **Partial Support (a):** 0.05% of users

## Limitations & Known Issues

### #1: Internet Explorer 9 - Backspace/Delete Not Detected
Internet Explorer 9 does not fire an `input` event when deleting text via Backspace, Delete, Cut, or similar operations.

### #2: Firefox 3-3.5, Opera 11.6 - Drag and Drop
Does not fire an `input` event when drag-and-dropping text into an `<input>` or `<textarea>` element.

### #3: Select Element Support
The `<select>` element does not fire `input` events in:
- Internet Explorer (9-11)
- Edge (12-18)
- Chrome (15-34)
- Firefox (3.6-48)
- Opera (15-21)

Related bugs:
- [MS Edge Platform Issue #4660045](https://developer.microsoft.com/microsoft-edge/platform/issues/4660045/)
- [Firefox Bug #1024350](https://bugzilla.mozilla.org/show_bug.cgi?id=1024350)

### #4: Checkbox, Radio, and File Input Limitations
Does not fire an `input` event when:
- (Un)checking a checkbox or radio button
- Changing selected file(s) in an `<input type="file">` element

Affected browsers and bug reports:
- [Chrome Bug #534245](https://code.google.com/p/chromium/issues/detail?id=534245)
- [WebKit Bug #149398](https://bugs.webkit.org/show_bug.cgi?id=149398)
- [WebKit Bug #190223](https://bugs.webkit.org/show_bug.cgi?id=190223)
- [Firefox Bug #1206616](https://bugzilla.mozilla.org/show_bug.cgi?id=1206616)

### #5: Internet Explorer 10-11 - Checkbox/Radio Buttons
Internet Explorer 10 and 11 do not fire an `input` event when (un)checking checkbox or radio button elements.

Related: [MS Edge Platform Issue #1883692](https://web.archive.org/web/20160328154136/https://connect.microsoft.com/IE/feedback/details/1883692/edge-input-of-type-radio-or-type-checkbox-doesnt-fire-input-events)

### #6: Safari & WebKit - File Input
Does not fire an `input` event when changing the selected file(s) of an `<input type="file">` element.

Related bugs:
- [WebKit Bug #149398](https://bugs.webkit.org/show_bug.cgi?id=149398)
- [WebKit Bug #204292](https://bugs.webkit.org/show_bug.cgi?id=204292)

### #7: Internet Explorer 10-11 - Placeholder Issues
Internet Explorer 10 and 11 fire the `input` event incorrectly:
- When an input field with a placeholder attribute is focused
- On page load when the placeholder contains certain characters (e.g., Chinese characters)

Related: [MS Connect Feedback #885747](https://connect.microsoft.com/IE/feedback/details/885747/ie-11-fires-the-input-event-when-a-input-field-with-placeholder-is-focused)

## Basic Usage Example

```javascript
// Get the input element
const inputElement = document.getElementById('myInput');

// Listen for input events
inputElement.addEventListener('input', (event) => {
  console.log('Input value changed:', event.target.value);
});

// Alternative: Using the oninput attribute
// <input id="myInput" oninput="handleInput(event)" type="text">
```

### Real-World Example: Live Character Counter

```html
<textarea id="messageBox" maxlength="140" placeholder="Enter your message..."></textarea>
<p>Characters remaining: <span id="remaining">140</span></p>

<script>
  const textArea = document.getElementById('messageBox');
  const remaining = document.getElementById('remaining');
  const maxLength = 140;

  textArea.addEventListener('input', (event) => {
    const currentLength = event.target.value.length;
    remaining.textContent = maxLength - currentLength;
  });
</script>
```

## Related References

### Official Documentation
- [MDN Web Docs - input event](https://developer.mozilla.org/en-US/docs/Web/Events/input)
- [HTML Specification - select element update notifications](https://html.spec.whatwg.org/multipage/forms.html#send-select-update-notifications)

### Related Events
- `change` - Fires when form control value is finalized (after blur)
- `keydown` / `keyup` - Low-level keyboard events
- `keypress` - Deprecated; avoid in new code
- `beforeinput` - Fires before the input value actually changes

### Browser Compatibility
View the full compatibility matrix on [Can I Use](https://caniuse.com/input-event)

## Recommendations

### Safe Implementation Strategy

Given the widespread support, the `input` event is safe to use for most modern web applications:

1. **For Modern Browsers (>93% coverage):** Use `input` event directly without fallbacks
2. **For Legacy IE Support (9-11):** Consider using both `input` and `change` events:
   ```javascript
   ['input', 'change'].forEach(eventType => {
     element.addEventListener(eventType, handler);
   });
   ```
3. **For File Inputs:** Use `change` event instead, as `input` event support is limited
4. **For Select Elements:** Use `change` event for broader compatibility (modern browsers support `input` for select)
5. **For Checkboxes/Radio Buttons:** Use `change` event instead of `input` event

### Progressive Enhancement

- Use `input` event for primary real-time functionality
- Provide fallback mechanisms for older browsers if needed
- Test thoroughly across target browsers and devices

## Notes

- The `input` event is a trusted event, meaning it can only be dispatched by the browser in response to user action
- The event bubbles and is cancelable
- The `data` property of the event object contains the newly inserted character(s)
- For better performance, debounce or throttle event handlers if they perform expensive operations

---

**Last Updated:** 2025
**Data Source:** Can I Use Feature Database
**Specification:** HTML Living Standard
