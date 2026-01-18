# Autofocus Attribute

## Overview

The `autofocus` attribute allows a form field to be immediately focused when a webpage loads. This HTML5 feature automatically sets keyboard focus to a specified input element without requiring user interaction.

## Specification

**Status:** Living Standard (LS)

**Official Specification:** [WHATWG HTML Living Standard - Autofocus Attribute](https://html.spec.whatwg.org/multipage/forms.html#autofocusing-a-form-control:-the-autofocus-attribute)

## Categories

- HTML5

## Benefits & Use Cases

### Improved User Experience
- **Search Interfaces:** Focus the search input field immediately when users land on a search page, reducing the number of clicks required to start searching.
- **Login Forms:** Pre-focus the username or email field on login pages, allowing users to begin typing immediately.
- **Modal Dialogs:** Focus the primary input field in dialog boxes for better accessibility and user flow.

### Accessibility Considerations
- **Reduced Friction:** Eliminates the need for users to manually click on form fields to begin data entry.
- **Mobile Optimization:** Particularly useful for mobile devices where keyboard focus can automatically open the on-screen keyboard.
- **Keyboard Navigation:** Supports users relying on keyboard navigation by placing focus where they need it.

### Common Scenarios
- **Dedicated Form Pages:** Pages where the primary purpose is form submission (search, login, sign-up).
- **Single Input Focus:** Best used with a single input per page to avoid confusion.
- **Inline Search:** Search bars on homepages that benefit from immediate focus.

## Browser Support

### Desktop Browsers

| Browser | First Version with Support |
|---------|---------------------------|
| **Chrome** | 5+ (All current versions) |
| **Firefox** | 4+ (All current versions) |
| **Safari** | 5+ (All current versions) |
| **Opera** | 9.5+ (All current versions) |
| **Edge** | 12+ (All current versions) |
| **Internet Explorer** | 10-11 only |

### Mobile Browsers

| Browser | Support Status | Notes |
|---------|---|---|
| **Android Browser** | 3+ (Full support from v3 onward) |  |
| **Chrome Mobile** | Full support | Latest versions |
| **Firefox Mobile** | Full support | Latest versions |
| **Safari (iOS)** | ❌ Not supported | See notes below |
| **Opera Mobile** | 80+ (Full support) |  |
| **Samsung Internet** | 4+ (Full support) |  |
| **Opera Mini** | ❌ Not supported |  |
| **UC Browser** | 15.5+ |  |

### Legacy/Deprecated Browsers

| Browser | Support Status |
|---------|---|
| Internet Explorer 5.5-9 | ❌ No support |
| IE Mobile 10-11 | ✅ Supported |
| BlackBerry Browser 7+ | ✅ Supported |
| KaiOS 3.0-3.1 | ✅ Supported |

## Usage Example

### Basic Usage

```html
<!-- Focus the search input immediately on page load -->
<form action="/search">
  <input type="text" name="q" placeholder="Search..." autofocus>
  <button type="submit">Search</button>
</form>
```

### With Login Form

```html
<form method="post" action="/login">
  <div>
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" autofocus required>
  </div>
  <div>
    <label for="password">Password:</label>
    <input type="password" id="password" name="password" required>
  </div>
  <button type="submit">Log In</button>
</form>
```

### Multiple Form Elements

```html
<!-- Only the first autofocus attribute takes effect -->
<form>
  <input type="text" placeholder="First field" autofocus>
  <input type="text" placeholder="Second field">
  <!-- The autofocus on the second field is ignored -->
  <input type="text" placeholder="Third field" autofocus>
</form>
```

## Known Issues & Limitations

### Firefox Bug
**Issue:** Firefox has a known bug where the `autofocus` attribute doesn't always scroll to the correct part of the page when the focused element is out of view.

**Bug Report:** [Mozilla Bugzilla #712130](https://bugzilla.mozilla.org/show_bug.cgi?id=712130)

**Workaround:** Consider combining with JavaScript to ensure proper scrolling behavior:

```javascript
document.getElementById('myInput').focus();
document.getElementById('myInput').scrollIntoView({ behavior: 'smooth' });
```

### iOS Safari Limitation
**Issue:** The `autofocus` attribute is **not supported in iOS Safari** browsers. However, it does work in iOS WebViews, which are used by some in-app browsers.

**Implication:** Mobile Safari users will not experience automatic focus on iPhone and iPad, but the page will still function normally—users simply need to tap the field manually.

### Single Autofocus Per Page
- Only the **first** `autofocus` attribute on a page takes effect
- Multiple autofocus attributes will be ignored after the first
- If multiple elements need to be managed, use JavaScript to prioritize which element receives focus

### Multiple Element Behavior
When multiple elements have the `autofocus` attribute, behavior varies slightly by browser, but generally only the first element in document order receives focus.

## Best Practices

### Do
- ✅ Use `autofocus` on search bars and login forms where it's the primary action
- ✅ Ensure the autofocused element is visible on page load
- ✅ Combine with appropriate labels and ARIA attributes for accessibility
- ✅ Use `tabindex` and JavaScript to enhance focus management on complex pages
- ✅ Test on mobile devices to understand behavior differences

### Don't
- ❌ Use autofocus on every input field—only use it for the primary input
- ❌ Rely on autofocus as the sole accessibility mechanism
- ❌ Use autofocus on pages where the focused element is hidden or off-screen
- ❌ Assume autofocus will work identically across all browsers and devices
- ❌ Use autofocus to redirect focus away from important content

## Accessibility Considerations

### Positive Impacts
- **Reduces friction** for users who rely on keyboard navigation
- **Helpful for users with mobility challenges** who benefit from pre-positioned focus
- **Mobile users** can immediately interact with the intended input

### Potential Issues
- **Screen reader users** may be confused if focus moves unexpectedly
- **User expectations** may be disrupted on pages where autofocus is unexpected
- **Keyboard users** should always be able to move focus to other interactive elements

### Recommendations
- Combine autofocus with clear visual indicators (placeholder text, labels, focus styles)
- Use semantic HTML with proper `<label>` elements
- Ensure all interactive elements are keyboard-accessible
- Provide clear feedback when focus changes

## Global Browser Support Summary

**Overall Support:** 84.26% of global users have browsers that support autofocus

**Supported In:**
- All modern versions of Chrome, Firefox, Safari (desktop), Opera, and Edge
- Most Android browsers (3+)
- Not supported in iOS Safari or Opera Mini
- Limited support in older Internet Explorer versions

## Related Resources

### Official Documentation
- [MDN Web Docs - autofocus attribute](https://developer.mozilla.org/en/docs/Web/HTML/Element/input#attr-autofocus)
- [WHATWG HTML Standard](https://html.spec.whatwg.org/multipage/forms.html#autofocusing-a-form-control:-the-autofocus-attribute)

### Additional Reading
- [Article on Autofocus Implementation](https://davidwalsh.name/autofocus)

## See Also

- [HTML Form Elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element#forms)
- [Input Type Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
- [Focus Management with JavaScript](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)
- [ARIA Attributes for Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
