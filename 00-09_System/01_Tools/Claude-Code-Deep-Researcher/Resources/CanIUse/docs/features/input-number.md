# Number Input Type (`<input type="number">`)

## Overview

The number input type is an HTML5 form field specifically designed for numeric input. It provides built-in validation, keyboard controls, and browser-native UI enhancements for handling numerical data entry.

**Specification Status:** Living Standard
**Category:** HTML5
**Feature ID:** `input-number`

---

## Description

The `<input type="number">` element creates a form input field that:

- Accepts only numeric values
- Provides optional increment/decrement controls (spinner UI in many browsers)
- Supports min, max, and step attributes for validation and constraints
- Exposes JavaScript APIs for programmatic number handling
- Normalizes numeric format according to the HTML specification

This is a specialized input type for form fields that should contain numeric data, providing better user experience and data validation compared to text inputs.

---

## Specification

**Official Specification:** [WHATWG HTML Standard - Number State (type=number)](https://html.spec.whatwg.org/multipage/forms.html#number-state-(type=number))

The specification defines:
- Valid numeric input formats and validation rules
- Attributes: `min`, `max`, `step`, `readonly`, `required`, `disabled`, `value`
- DOM interfaces: `HTMLInputElement` with number-specific properties and methods
- Constraint validation semantics
- Form submission normalization to invariant locale format

---

## Use Cases & Benefits

### Primary Use Cases

1. **Quantity Selection** - E-commerce product quantity inputs
2. **Financial Data** - Price, amount, and monetary value inputs
3. **Measurements** - Height, weight, distance, temperature inputs
4. **Age & Years** - Birth year, age, experience level inputs
5. **Ratings & Scores** - Numeric ratings, test scores, ratings
6. **Statistical Data** - Form fields in data collection applications
7. **Calculations** - Mathematical computation inputs
8. **Configuration** - Numeric settings and parameters

### Key Benefits

**For Developers:**
- Built-in HTML5 validation without additional JavaScript
- Native DOM APIs for number handling (`valueAsNumber`, `stepUp()`, `stepDown()`)
- Simplified form processing with type-safe input
- Consistent behavior across modern browsers

**For Users:**
- Mobile keyboards optimized for numeric entry (numeric pad)
- Native increment/decrement controls (spinners) where supported
- Browser-native validation feedback
- Better accessibility with semantic HTML
- Improved usability compared to text inputs for numbers

**For Applications:**
- Automatic input type constraints
- Validation without additional libraries
- Improved form submission data quality
- Better accessibility compliance (WCAG)

---

## Browser Support

### Current Support Summary

- **Full Support (y):** 38.44% global usage
- **Partial Support (a):** 55.10% global usage
- **No Support (n):** 6.46% global usage

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---|---|---|
| **Chrome** | v6 (2010) | Full | Complete support since version 6 |
| **Firefox** | v29 (2014) | Full with limitations | See Firefox limitations below |
| **Safari** | v5 (2010) | Full | Complete support since version 5 |
| **Opera** | v9 (2006) | Full | Supported since version 9 |
| **Edge** | v12 (2015) | Full with limitations | Versions 12-18 have partial support |
| **IE** | v10 (2012) | Partial (#1, #4) | Limited support with known bugs |

### Mobile & Tablet Browsers

| Browser | Status | Details |
|---------|--------|---------|
| **iOS Safari** | Partial (a) | All versions from 3.2 onwards (limited UI controls) |
| **Android Browser** | Partial (a) | Version 4.0+ (limited UI controls) |
| **Android Chrome** | Partial (a) | Limited UI controls |
| **Android Firefox** | Full | Version 144+ has full support |
| **Opera Mobile** | Partial-Full | Version 10-12 full, version 80 partial |
| **Samsung Internet** | Partial (a) | All versions (limited UI controls) |
| **Opera Mini** | None (n) | No support in any version |
| **UC Browser** | Partial (a) | Version 15.5 |

---

## Known Issues & Limitations

### Issue #1: Missing UI Controls
**Affected Browsers:** Internet Explorer, Mobile browsers (iOS Safari, Android, Samsung)

iOS Safari and Android browsers do not provide increment/decrement buttons in the UI, though they may support arrow key input on some devices.

### Issue #2: Incomplete Attribute Support
**Affected Browsers:** Mobile platforms

The UI widget does not properly respect the `step`, `min`, and `max` attributes when displaying constraints to users.

### Issue #3: Datalist Integration
**Affected Browsers:** Firefox

Firefox doesn't support autocomplete suggestions via `<datalist>` elements with number inputs.

### Issue #4: Keyboard-Only Arrow Controls
**Affected Browsers:** Edge (versions 12-18)

These versions do not include visible increment/decrement buttons but support increment/decrement via arrow up/down keys. Additionally, newer Edge versions have a bug where changing value via arrow keys does not fire `input` or `change` events.

### Issue #5: `.valueAsNumber` Bug
**Affected Browsers:** Internet Explorer 10 & 11

Returns `NaN` for valid numeric values due to incorrect specification compliance (e.g., `input.value = "9"` results in `input.valueAsNumber` returning `NaN`).

### Issue #6: `.stepUp()` and `.stepDown()` Errors
**Affected Browsers:** Internet Explorer 10 & 11

These methods incorrectly invoke `InvalidStateError` exceptions instead of working as specified.

### Issue #7: Locale-Based Decimal Separator
**Affected Browsers:** Most browsers (except modern implementations)

Very few browsers properly support localized decimal marks (commas in some regions). Most browsers expect standard period (.) regardless of user locale. Form submission standardizes to invariant format, but input UI/validation may not reflect user's regional settings.

### Issue #8: Firefox Alpha Character Filtering
**Affected Browsers:** Firefox (versions 39-42)

Firefox 39 does not prevent alpha character input; Firefox 42 validates only without disabling alpha keys in the keyboard.

---

## Implementation Example

```html
<!-- Basic number input -->
<input type="number" name="age" min="0" max="120" required>

<!-- With decimal places -->
<input type="number" name="price" min="0" step="0.01" placeholder="0.00">

<!-- With increment controls -->
<input type="number" name="quantity" value="1" min="1" max="999" step="1">

<!-- With label and validation feedback -->
<label for="score">Test Score (0-100):</label>
<input
  type="number"
  id="score"
  name="score"
  min="0"
  max="100"
  step="1"
  required
>

<!-- Readonly number display -->
<input type="number" value="42" readonly disabled>
```

### JavaScript Usage

```javascript
// Get numeric value
const input = document.querySelector('input[type="number"]');
const numValue = input.valueAsNumber; // Returns Number type
const strValue = input.value;         // Returns String type

// Increment/Decrement
input.stepUp();      // Increase by step value
input.stepDown();    // Decrease by step value
input.stepUp(5);     // Increase by 5x step value

// Validation
if (input.validity.valid) {
  // Valid number within min/max
}

// Event handling
input.addEventListener('input', (e) => {
  console.log('Number changed:', e.target.valueAsNumber);
});

input.addEventListener('change', (e) => {
  console.log('Input blurred, final value:', e.target.valueAsNumber);
});
```

---

## Progressive Enhancement & Fallbacks

### Feature Detection

```javascript
function supportsNumberInput() {
  const input = document.createElement('input');
  input.setAttribute('type', 'number');
  return input.type === 'number';
}
```

### Fallback Strategies

1. **Type Fallback:** Browsers that don't support `type="number"` automatically fall back to `type="text"`
2. **JavaScript Validation:** Add custom validation for unsupported browsers:

```javascript
if (!supportsNumberInput()) {
  // Add manual validation
  input.addEventListener('input', function() {
    if (!/^\d*\.?\d*$/.test(this.value)) {
      this.setCustomValidity('Please enter a valid number');
    }
  });
}
```

3. **Polyfill:** [number-polyfill](https://github.com/jonstipe/number-polyfill) provides enhanced support for older browsers

---

## Accessibility Considerations

- Semantic HTML: `type="number"` is recognized by assistive technologies
- Mobile keyboards: Automatically switches to numeric input method
- Validation feedback: Native constraint validation provides accessible error messages
- ARIA attributes: Can be combined with `aria-describedby`, `aria-required`, etc.
- Keyboard navigation: Supports arrow keys for increment/decrement where available

---

## Cross-Browser Compatibility Workarounds

### For Mobile Browsers (Partial Support)

```html
<!-- Accept text input but validate as number -->
<input
  type="number"
  inputmode="numeric"
  pattern="[0-9]*"
  placeholder="Enter number"
>
```

### For IE Support

```html
<!-- Provide fallback input with JavaScript validation -->
<input
  type="number"
  id="legacy-number"
  value="0"
  onblur="validateNumber(this)"
>

<script>
function validateNumber(input) {
  const num = parseFloat(input.value);
  if (isNaN(num)) {
    input.value = 0;
  }
}
</script>
```

### Event Firing Bug Workaround (Edge)

```javascript
// For Edge versions with event firing bug
const numberInput = document.querySelector('input[type="number"]');
const spinButtonUp = numberInput.parentElement.querySelector('[class*="up"]');

if (spinButtonUp) {
  spinButtonUp.addEventListener('click', () => {
    numberInput.dispatchEvent(new Event('input', { bubbles: true }));
    numberInput.dispatchEvent(new Event('change', { bubbles: true }));
  });
}
```

---

## Related Resources

### Documentation
- [WebPlatform Docs - HTML input type="number"](https://webplatform.github.io/docs/html/elements/input/type/number)
- [MDN Web Docs - input type="number"](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number)
- [WHATWG HTML Specification](https://html.spec.whatwg.org/multipage/forms.html#number-state-(type=number))

### Feature Detection
- [has.js Detection Test](https://raw.github.com/phiggins42/has.js/master/detect/form.js#input-type-number)

### Tools & Polyfills
- [number-polyfill](https://github.com/jonstipe/number-polyfill) - Cross-browser number input enhancement

### Articles & Guides
- [HTML5 Number Input Localization Issues](https://www.ctrl.blog/entry/html5-input-number-localization.html) - Deep dive into decimal separator and localization problems

---

## Summary

The `<input type="number">` element is a well-supported HTML5 feature with nearly 94% global support (full + partial). While modern desktop browsers provide excellent support with full functionality, mobile browsers offer partial support with limitations on UI controls and attribute handling.

**Recommendation:** Use `<input type="number">` for all numeric form fields. Modern browser support is excellent, and graceful fallback to text input provides adequate experience in unsupported browsers. Consider adding JavaScript validation for critical applications targeting legacy browsers (IE) or enhanced mobile support requirements.
