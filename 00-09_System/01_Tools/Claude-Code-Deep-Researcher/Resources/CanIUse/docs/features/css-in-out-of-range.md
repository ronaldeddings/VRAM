# CSS `:in-range` and `:out-of-range` Pseudo-Classes

## Overview

The `:in-range` and `:out-of-range` CSS pseudo-classes enable targeted styling of form inputs based on their value relative to defined constraints. These selectors apply to temporal and numeric `<input>` elements that have `min` and/or `max` attributes.

- **`:in-range`** - Matches when the input value falls within the specified range
- **`:out-of-range`** - Matches when the input value falls outside the specified range

If an input element has no range constraints (`min`/`max`), neither pseudo-class will match.

## Specification Details

| Property | Value |
|----------|-------|
| **Specification** | [CSS Selectors Level 4](https://www.w3.org/TR/selectors4/#range-pseudos) |
| **Status** | Working Draft |
| **W3C Link** | https://www.w3.org/TR/selectors4/#range-pseudos |
| **WHATWG HTML Spec** | [HTML Selectors for `:in-range` and `:out-of-range`](https://html.spec.whatwg.org/multipage/scripting.html#selector-in-range) |

## Categories

- **CSS**

## Common Use Cases

### Form Validation Styling

Provide immediate visual feedback to users when their input values are valid or invalid:

```css
/* Style valid range values */
input:in-range {
  border-color: green;
  background-color: #f0fff0;
}

/* Style out-of-range values */
input:out-of-range {
  border-color: red;
  background-color: #fff0f0;
}
```

### Age Verification

Style inputs for age-restricted content:

```css
input[type="number"][name="age"]:in-range {
  outline: 2px solid green;
}

input[type="number"][name="age"]:out-of-range {
  outline: 2px solid red;
}
```

### Price Range Filters

Highlight pricing inputs that fall within acceptable ranges:

```css
.price-filter input:in-range {
  box-shadow: inset 0 0 0 2px #2ecc71;
}

.price-filter input:out-of-range {
  box-shadow: inset 0 0 0 2px #e74c3c;
}
```

### Date Input Validation

Apply styling to temporal inputs with date constraints:

```html
<input type="date" min="2024-01-01" max="2024-12-31" />
```

```css
input[type="date"]:in-range {
  color: #27ae60;
}

input[type="date"]:out-of-range {
  color: #c0392b;
}
```

## Browser Support

### Support Status Summary

| Browser | First Full Support | Status |
|---------|-------------------|--------|
| **Chrome** | 53 | ✅ Full Support |
| **Edge** | 79 | ✅ Full Support |
| **Firefox** | 50 | ✅ Full Support |
| **Safari** | 10.1 | ✅ Full Support |
| **Opera** | 40 | ✅ Full Support |
| **iOS Safari** | 10.3 | ✅ Full Support |
| **Samsung Internet** | 5.0 | ✅ Full Support |

### Detailed Browser Support Table

#### Desktop Browsers

| Browser | Version | Support |
|---------|---------|---------|
| **Internet Explorer** | 5.5–11 | ❌ Not Supported |
| **Edge (Legacy)** | 12–18 | ⚠️ Partial (v13–18) |
| **Edge (Chromium)** | 79+ | ✅ Full Support |
| **Chrome** | 4–52 | ❌/⚠️ No or Partial |
| **Chrome** | 53+ | ✅ Full Support |
| **Firefox** | 2–49 | ❌/⚠️ No or Partial |
| **Firefox** | 50+ | ✅ Full Support |
| **Safari** | 3.1–10.0 | ⚠️ Partial (v5.1–10.0) |
| **Safari** | 10.1+ | ✅ Full Support |
| **Opera** | 9–39 | ⚠️ Partial (v10.0–39) |
| **Opera** | 40+ | ✅ Full Support |

#### Mobile Browsers

| Browser | Version | Support |
|---------|---------|---------|
| **iOS Safari** | 3.2–10.2 | ⚠️ Partial (v5.0–10.2) |
| **iOS Safari** | 10.3+ | ✅ Full Support |
| **Android Browser** | 2.1–4.4 | ⚠️ Partial (v4.0+) |
| **Android Browser** | 142+ | ✅ Full Support |
| **Opera Mini** | All | ⚠️ Partial Support* |
| **Opera Mobile** | 10–39 | ⚠️ Partial (v10–39) |
| **Opera Mobile** | 80+ | ✅ Full Support |
| **Samsung Internet** | 4 | ⚠️ Partial |
| **Samsung Internet** | 5.0+ | ✅ Full Support |

### Global Support

- **Full Support**: 93.03% of users globally
- **Partial Support**: 0.22% of users globally

## Known Issues and Bugs

### Important Caveat for `<input type="range">`

> **Note:** The `<input type="range">` element can **never** match `:out-of-range` because the user cannot input a value outside the defined range. If the initial value is outside the range, the browser automatically clamps it to the minimum or maximum bound. Therefore, these pseudo-classes are only meaningful for `number`, `date`, `time`, `datetime-local`, `month`, `week`, and `email` inputs.

### Browser-Specific Issues

#### Issue #1: Opera Mini - Dynamic Value Updates
**Affected Browser:** Opera Mini (all versions)
**Status:** Partial Support

Opera Mini correctly applies `:in-range` and `:out-of-range` styles on initial page load, but **does not correctly update** when the input value is changed. This means styling remains static and doesn't reflect value changes.

**Workaround:** Use JavaScript event listeners (`input`, `change` events) to apply dynamic styling classes when targeting Opera Mini users.

#### Issue #2: Incorrect Matching on Unconstrained Inputs
**Affected Browsers:**
- Edge (v13–18)
- Chrome (v15–51)
- Opera (v10–38)
- Safari (v5.1–10.0)
- iOS Safari (v5.0–10.2)
- Android Browser (v4.0–4.4)
- BlackBerry Browser (v10)
- Opera Mobile (v10–39)
- Samsung Internet (v4)

**Status:** Partial Support
**Issue:** The `:in-range` pseudo-class **incorrectly matches** temporal and `number` inputs that **don't have** `min` or `max` attributes defined. According to the specification, it should only match inputs with explicit range constraints.

**Bug References:**
- [Edge bug](https://web.archive.org/web/20171213080515/https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7200501/)
- [Chrome bug](https://bugs.chromium.org/p/chromium/issues/detail?id=603268)
- [WebKit bug](https://bugs.webkit.org/show_bug.cgi?id=156558)

**Workaround:** Always explicitly define `min` and `max` attributes on inputs where you want these pseudo-classes to apply, or use JavaScript for more reliable validation styling.

#### Issue #3: Incorrect Matching on Disabled/Readonly Inputs
**Affected Browsers:**
- Edge (v13–18)
- Chrome (v15–51)
- Firefox (v29–49)
- Safari (v5.1–10.0)
- iOS Safari (v5.0–10.2)
- Opera (v15–38)
- Opera Mobile (v10–39)
- Android Browser (v4.0–4.4)
- KaiOS (v2.5)

**Status:** Partial Support
**Issue:** The `:in-range` and `:out-of-range` pseudo-classes **incorrectly match** inputs that are `disabled` or `readonly`. According to the specification, these pseudo-classes should only apply to inputs that are neither disabled nor readonly.

**Bug References:**
- [Edge bug](https://web.archive.org/web/20171213073431/https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7190958/)
- [Mozilla bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1264157)
- [WebKit bug](https://bugs.webkit.org/show_bug.cgi?id=156530)
- [Chrome bug](https://bugs.chromium.org/p/chromium/issues/detail?id=602568)

**Workaround:** For disabled or readonly inputs, use CSS attribute selectors instead:
```css
input:disabled:in-range {
  /* This may not work reliably in affected browsers */
}

/* More reliable alternative */
input[disabled] {
  /* Apply alternate styling */
}
```

## Implementation Examples

### Basic Range Validation

```html
<input
  type="number"
  min="0"
  max="100"
  placeholder="Enter a number between 0-100"
/>
```

```css
input:in-range {
  border: 2px solid #27ae60;
  background-color: #ecf9f1;
}

input:out-of-range {
  border: 2px solid #e74c3c;
  background-color: #fadbd8;
}
```

### Date Range Validation

```html
<label for="event-date">Select an event date:</label>
<input
  type="date"
  id="event-date"
  min="2024-12-01"
  max="2024-12-31"
/>
```

```css
#event-date:in-range {
  border-color: #3498db;
}

#event-date:out-of-range {
  border-color: #e67e22;
}
```

### Combined Form Validation

```html
<form id="survey">
  <label>
    Age (18-65):
    <input type="number" min="18" max="65" required />
  </label>

  <label>
    Price ($1-$999):
    <input type="number" min="1" max="999" step="0.01" />
  </label>
</form>
```

```css
#survey input:in-range {
  border-left: 4px solid #2ecc71;
}

#survey input:out-of-range {
  border-left: 4px solid #c0392b;
}

#survey input:in-range + label::after {
  content: " ✓";
  color: #2ecc71;
}

#survey input:out-of-range + label::after {
  content: " ✗";
  color: #c0392b;
}
```

## Related Resources

### Official Documentation
- [MDN Web Docs - CSS `:out-of-range`](https://developer.mozilla.org/en-US/docs/Web/CSS/:out-of-range)
- [WHATWG HTML Specification - `:in-range` and `:out-of-range` Selectors](https://html.spec.whatwg.org/multipage/scripting.html#selector-in-range)
- [W3C CSS Selectors Level 4](https://www.w3.org/TR/selectors4/#range-pseudos)

### Related CSS Features
- [`:valid` and `:invalid` pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/:valid) - Alternative validation styling
- [HTML5 Form Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation) - Comprehensive validation guide
- [HTML5 Input Types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types) - Full list of supported input types

### Browser Compatibility
- [CanIUse - `:in-range` and `:out-of-range`](https://caniuse.com/css-in-out-of-range)
- [MDN Browser Compatibility Table](https://developer.mozilla.org/en-US/docs/Web/CSS/:out-of-range#browser_compatibility)

## Migration and Fallback Strategies

### For Older Browsers

For browsers without support, use the `:valid` and `:invalid` pseudo-classes as a fallback, or implement JavaScript-based validation:

```css
/* Primary: Use :in-range and :out-of-range */
input:in-range {
  border-color: green;
}

/* Fallback: Use :valid for older browsers */
input:valid {
  border-color: green;
}
```

Or implement JavaScript polyfill:

```javascript
function updateRangeValidation() {
  document.querySelectorAll('input[type="number"][min], input[type="number"][max]')
    .forEach(input => {
      const min = parseFloat(input.getAttribute('min'));
      const max = parseFloat(input.getAttribute('max'));
      const value = parseFloat(input.value);

      if (value >= min && value <= max) {
        input.classList.add('in-range');
        input.classList.remove('out-of-range');
      } else {
        input.classList.add('out-of-range');
        input.classList.remove('in-range');
      }
    });
}

document.addEventListener('DOMContentLoaded', updateRangeValidation);
document.addEventListener('input', updateRangeValidation);
```

## Summary

The `:in-range` and `:out-of-range` pseudo-classes provide a native CSS solution for styling form inputs based on their values relative to min/max constraints. With 93% global browser support and excellent coverage in all modern browsers, they are suitable for most projects. However, developers should be aware of the documented browser bugs and test thoroughly, especially for older versions of Edge, Chrome, and Safari.
