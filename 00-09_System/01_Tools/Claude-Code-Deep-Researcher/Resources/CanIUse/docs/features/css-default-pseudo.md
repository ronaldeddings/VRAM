# `:default` CSS Pseudo-Class

## Overview

The `:default` CSS pseudo-class matches form elements that represent the default state of their form group. This includes:

- Checkboxes and radio buttons that have the `checked` attribute
- `<option>` elements with the `selected` attribute
- The default submit button of a form (if applicable)

This selector enables developers to style default form states semantically without relying on additional classes or JavaScript.

---

## Specification Status

| Property | Details |
|----------|---------|
| **Status** | Working Draft (WD) |
| **W3C Spec** | [Selectors Level 4](https://w3c.github.io/csswg-drafts/selectors-4/#the-default-pseudo) |

---

## Categories

- **CSS Selectors**

---

## Use Cases & Benefits

### 1. **Visual Distinction of Defaults**
Highlight which options are selected by default without additional markup:

```css
input[type="radio"]:default,
input[type="checkbox"]:default {
  accent-color: #0066cc;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
}
```

### 2. **Form State Styling**
Differentiate default form states for improved UX:

```css
option:default {
  font-weight: bold;
  color: #333;
}
```

### 3. **Submit Button Styling**
Target the default submit button in a form:

```css
button:default {
  background-color: #0066cc;
  color: white;
  font-weight: bold;
}
```

### 4. **Accessibility Enhancements**
Provide visual cues for users about which options are pre-selected:

```css
input[type="checkbox"]:default::after {
  content: " (default)";
  margin-left: 0.5em;
  font-size: 0.9em;
  color: #666;
}
```

### 5. **Progressive Form Enhancement**
Combine with other pseudo-classes for comprehensive form styling:

```css
/* Default and focused state */
input:default:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}
```

---

## Browser Support

| Browser | First Version | Status Badge |
|---------|---------------|--------------|
| **Chrome** | 51 | ✅ Full Support |
| **Edge** | 79 | ✅ Full Support |
| **Firefox** | 4 | ✅ Full Support |
| **Safari** | 10.1 | ✅ Full Support |
| **Opera** | 38 | ✅ Full Support |
| **iOS Safari** | 10.3 | ✅ Full Support |
| **Android Browser** | 142 | ✅ Full Support |
| **Samsung Internet** | 5.0 | ✅ Full Support |
| **Internet Explorer** | N/A | ❌ Not Supported |

### Support Summary by Device

#### Desktop
- **Chrome**: 51+ (Full support)
- **Firefox**: 4+ (Full support)
- **Safari**: 10.1+ (Full support)
- **Edge**: 79+ (Full support)
- **Opera**: 38+ (Full support)
- **IE**: Not supported

#### Mobile
- **iOS Safari**: 10.3+ (Full support)
- **Android**: 142+ (Full support)
- **Samsung Internet**: 5.0+ (Full support)
- **Opera Mobile**: 80+ (Full support)

### Legacy Support Notes

#### Partial Support (with limitations)
- **Chrome 15-50**: Partial support (`a #1`) - Does not match checkboxes/radios with `checked`
- **Safari 5.1-10**: Partial support (`a #1`) - Does not match checkboxes/radios with `checked`
- **iOS Safari 7-10.2**: Partial support (`a #1`) - Does not match checkboxes/radios with `checked`
- **Android 4-4.4.4**: Partial support (`a #1`) - Does not match checkboxes/radios with `checked`
- **Opera 11.6-37**: Partial support - Limited support in various versions
- **BlackBerry 10**: Partial support (`a #1`) - Does not match checkboxes/radios with `checked`
- **Opera Mini**: Partial support (`a #2`) - Does not match default submit buttons

---

## Known Limitations & Bugs

### Global Support Notes

The `:default` pseudo-class has near-universal support across modern browsers, with adoption rates at **93.16%** globally.

### Browser-Specific Issues

#### #1: Checkbox and Radio Button Matching
**Affected Browsers**: Chrome 15-50, Safari 5.1-10, iOS Safari 7-10.2, Android 4-4.4.4, BlackBerry 10

In these older browser versions, the `:default` pseudo-class does **not match** `<input type="checkbox" checked>` or `<input type="radio" checked>`. This was a limitation in the implementation of the selector.

**Workaround**: Use fallback selectors for older browsers:
```css
input[type="checkbox"][checked],
input[type="checkbox"]:default {
  /* styles */
}
```

#### #2: Default Submit Button Matching
**Affected Browsers**: Opera 11.6-12.1, Opera Mini

In these Opera versions, the `:default` pseudo-class does **not match** the default submit button of a form.

**Workaround**: Use the `[type="submit"][default]` attribute selector or add explicit classes:
```css
button[type="submit"].default,
button:default {
  /* styles */
}
```

### Option Element Styling Caveat

**Important Note**: The specification states that `<option selected>` should match `:default`, however, `<select>` and `<option>` elements are generally not styleable across browsers due to platform-specific constraints. Testing this functionality is difficult without observable visual changes.

---

## Usage Example

### HTML

```html
<form id="preferences">
  <!-- Default checkbox -->
  <label>
    <input type="checkbox" name="newsletter" checked>
    Subscribe to newsletter
  </label>

  <!-- Default radio button -->
  <fieldset>
    <legend>Notification Preference</legend>
    <label>
      <input type="radio" name="notify" value="email" checked>
      Email
    </label>
    <label>
      <input type="radio" name="notify" value="sms">
      SMS
    </label>
  </fieldset>

  <!-- Default select option -->
  <label for="country">Country:</label>
  <select id="country">
    <option value="">-- Select --</option>
    <option value="us" selected>United States</option>
    <option value="ca">Canada</option>
  </select>

  <!-- Default submit button -->
  <button type="submit">Save Preferences</button>
</form>
```

### CSS

```css
/* Style default checkboxes and radios */
input[type="checkbox"]:default,
input[type="radio"]:default {
  accent-color: #0066cc;
  cursor: pointer;
}

/* Visual indicator for default state */
input:default {
  box-shadow: inset 0 0 0 2px rgba(0, 102, 204, 0.3);
}

/* Style the default submit button */
button:default {
  background-color: #0066cc;
  color: white;
  font-weight: 600;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
}

button:default:hover {
  background-color: #0052a3;
}

button:default:active {
  transform: scale(0.98);
}
```

---

## Fallback Strategies

For projects requiring support for older browsers:

### Using Attribute Selectors
```css
/* Fallback for browsers that don't support :default */
input[checked],
input[type="checkbox"][checked],
input[type="radio"][checked],
button[type="submit"][default] {
  /* fallback styles */
}

/* Modern browsers with :default */
input:default,
button:default {
  /* modern styles */
}
```

### Using JavaScript Fallback
```javascript
// For browsers that don't support :default
if (!CSS.supports('selector(:default)')) {
  document.querySelectorAll('input[checked], button[type="submit"]')
    .forEach(el => el.classList.add('default-state'));
}
```

---

## Related Resources

### Official Specifications
- [W3C Selectors Level 4 - :default](https://w3c.github.io/csswg-drafts/selectors-4/#the-default-pseudo)
- [HTML Standard - :default Selector](https://html.spec.whatwg.org/multipage/scripting.html#selector-default)

### Documentation
- [MDN Web Docs - CSS :default](https://developer.mozilla.org/en-US/docs/Web/CSS/:default)

### Tests & References
- [WebKit Bug #156230](https://bugs.webkit.org/show_bug.cgi?id=156230) - Implementation discussion for checkbox/radio matching
- [JS Bin Test Case](https://jsbin.com/hiyada/edit?html,css,output) - Interactive example

### Related Pseudo-Classes
- [`:checked`](https://developer.mozilla.org/en-US/docs/Web/CSS/:checked) - Matches checked form elements
- [`:enabled`](https://developer.mozilla.org/en-US/docs/Web/CSS/:enabled) - Matches enabled form elements
- [`:disabled`](https://developer.mozilla.org/en-US/docs/Web/CSS/:disabled) - Matches disabled form elements
- [`:required`](https://developer.mozilla.org/en-US/docs/Web/CSS/:required) - Matches required form fields
- [`:optional`](https://developer.mozilla.org/en-US/docs/Web/CSS/:optional) - Matches optional form fields

---

## Browser Compatibility Matrix (Extended)

### Desktop Browsers

#### Chrome
- **Unsupported**: Versions 4-14
- **Partial**: Versions 15-50 (limited checkbox/radio support)
- **Full**: Version 51+

#### Firefox
- **Unsupported**: Not applicable
- **Full**: Version 4+ (earliest tested version with full support)

#### Safari
- **Unsupported**: Versions 3.1-5
- **Partial**: Versions 5.1-10
- **Full**: Version 10.1+

#### Edge
- **Unsupported**: Versions 12-78
- **Full**: Version 79+

#### Opera
- **Unsupported**: Versions 9-11.5
- **Partial**: Versions 11.6-37 (varying levels of support)
- **Full**: Version 38+

### Mobile Browsers

#### iOS Safari
- **Unsupported**: Versions 3.2-6.1
- **Partial**: Versions 7.0-10.2
- **Full**: Version 10.3+

#### Android
- **Unsupported**: Versions 2.1-3
- **Partial**: Versions 4-4.4.4
- **Full**: Version 142+ (latest tested)

#### Samsung Internet
- **Partial**: Version 4
- **Full**: Version 5.0+

---

## Global Usage Statistics

| Metric | Value |
|--------|-------|
| **Full Support** | 93.16% of global users |
| **Partial Support** | 0.14% of global users |
| **Not Supported** | 6.70% of global users |

---

## Key Takeaways

1. **Modern Support**: The `:default` pseudo-class has excellent support in all modern browsers
2. **Consistent Implementation**: Firefox and newer Chrome/Edge have supported this since their earlier versions
3. **Safari/Mobile**: Full support since Safari 10.1 (iOS Safari 10.3)
4. **Legacy Limitation**: Older versions had issues matching checkboxes and radio buttons
5. **Safe to Use**: With 93%+ adoption, this selector is safe for production use

---

## See Also

- [CSS Selectors Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)
- [Form Styling Best Practices](https://developer.mozilla.org/en-US/docs/Learn/Forms/Styling_web_forms)
- [Can I Use: :default](https://caniuse.com/css-default-pseudo)
