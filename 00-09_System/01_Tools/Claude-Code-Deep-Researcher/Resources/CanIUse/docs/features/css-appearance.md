# CSS Appearance

## Overview

The `appearance` CSS property defines how elements (particularly form controls) appear by default. By setting the value to `none`, the default appearance can be entirely redefined using other CSS properties, allowing developers to fully customize form elements and UI components without relying on browser defaults.

## Specification

- **Status:** Working Draft
- **Specification URL:** [CSS UI Module Level 4 - Appearance Switching](https://www.w3.org/TR/css-ui-4/#appearance-switching)

## Categories

- CSS

## Benefits & Use Cases

### Primary Benefits
- **Form Control Customization:** Remove default browser styling from inputs, buttons, selects, and other form controls
- **Consistent Branding:** Create uniform UI components across different browsers
- **Design Freedom:** Implement custom checkbox, radio button, and select dropdown designs
- **Component Libraries:** Build styled component libraries without fighting browser defaults

### Common Use Cases
1. **Custom Input Styling:** Style text inputs, checkboxes, and radio buttons to match design systems
2. **Select Dropdown Replacement:** Create custom dropdown interfaces while maintaining accessibility
3. **Button Redesign:** Override browser default button appearance for branded button components
4. **Consistent Form Appearance:** Ensure form elements look identical across all browsers
5. **Progressive Enhancement:** Create stylized form controls with fallbacks for older browsers

### Typical Implementation Pattern
```css
/* Remove all default styling from a button */
button {
  appearance: none;
  background: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Custom checkbox styling */
input[type="checkbox"] {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
}
```

## Browser Support Summary

| Browser | First Full Support | Notes |
|---------|-------------------|-------|
| **Chrome** | 84 | Prefixed support from v4, unprefixed from v84 |
| **Edge** | 84 | Prefixed support from v12, unprefixed from v84 |
| **Firefox** | 80 | Prefixed support from v2, unprefixed from v80 |
| **Safari** | 15.4 | Prefixed support from v3.1, unprefixed from v15.4 |
| **Opera** | 73 | Prefixed support from v15, unprefixed from v73 |
| **iOS Safari** | 15.4 | Prefixed support from v3.2, unprefixed from v15.4 |
| **Android Browser** | 142 | Prefixed support from v2.1 |
| **Samsung Internet** | 14.0 | Prefixed support from v4, unprefixed from v14.0 |
| **Opera Mini** | Not Supported | No support in any version |

### Global Support Statistics
- **Full Support (y):** 92.2% of users
- **Partial Support (a):** 1.07% of users
- **No Support (n):** Remaining users

## Detailed Browser Support Table

### Desktop Browsers

#### Chromium-Based (Chrome, Edge, Opera)
- **Chrome 4-82:** Partial support with `-webkit-` prefix (`a x`)
- **Chrome 83:** Partial support with `-webkit-` prefix and extra flags (`y x`)
- **Chrome 84+:** Full unprefixed support (`y`)

- **Edge 12-82:** Partial support with `-webkit-` prefix (`a x #1 #2`)
- **Edge 83:** Partial support with `-webkit-` prefix and extra flags (`y x`)
- **Edge 84+:** Full unprefixed support (`y`)

- **Opera 9-12.1:** No support (`n`)
- **Opera 15-69:** Partial support with `-webkit-` prefix (`a x`)
- **Opera 70-72:** Partial support with `-webkit-` prefix and extra flags (`y x`)
- **Opera 73+:** Full unprefixed support (`y`)

#### Firefox
- **Firefox 2-34:** Partial support with `-moz-` prefix (`a x #1 #3`)
- **Firefox 35-79:** Partial support with `-moz-` prefix (`a x`)
- **Firefox 80+:** Full unprefixed support (`y`)

#### Safari
- **Safari 3.1-15.2-15.3:** Partial support with `-webkit-` prefix (`a x`)
- **Safari 15.4+:** Full unprefixed support (`y`)

### Mobile Browsers

#### iOS Safari
- **iOS Safari 3.2-15.2-15.3:** Partial support with `-webkit-` prefix (`a x`)
- **iOS Safari 15.4+:** Full unprefixed support (`y`)

#### Android Browsers
- **Android Browser 2.1-4.4.3-4.4.4:** Partial support with `-webkit-` prefix (`a x`)
- **Android Browser 142+:** Full unprefixed support (`y`)

#### Chrome for Android
- **Chrome for Android 142+:** Full unprefixed support (`y`)

#### Firefox for Android
- **Firefox for Android 144+:** Full unprefixed support (`y`)

#### Samsung Internet
- **Samsung Internet 4-13.0:** Partial support with `-webkit-` prefix (`a x`)
- **Samsung Internet 14.0+:** Full unprefixed support (`y`)

#### Opera Mobile
- **Opera Mobile 10-11.5:** No support (`n`)
- **Opera Mobile 12-12.1:** No support (`n`)
- **Opera Mobile 80+:** Full unprefixed support (`y`)

#### Other Browsers
- **Opera Mini:** No support (`n`)
- **UC Browser 15.5+:** Full unprefixed support (`y`)
- **Baidu Browser 13.52+:** Full unprefixed support (`y`)
- **KaiOS 2.5:** Partial support with `-webkit-` prefix (`a x`)
- **KaiOS 3.0-3.1:** Full unprefixed support (`y`)

## Known Issues & Notes

### General Support Notes
WebKit, Blink, and Gecko browsers also support additional vendor-specific values beyond the standard `none` value.

### Vendor Prefix Support
The `appearance` property requires vendor prefixes in most browsers for historical reasons:
- **WebKit/Blink browsers (Chrome, Edge, Safari, Opera):** Use `-webkit-appearance` prefix
- **Firefox:** Use `-moz-appearance` prefix
- **Unprefixed support:** Available in modern versions (Chrome 84+, Firefox 80+, Safari 15.4+, Edge 84+)

### Known Limitations

#### Note #1: `none` Value Support Only
The `appearance` property is supported with the `none` value in most browsers, but not the `auto` value. This means you can reset to custom styling but cannot always restore the original appearance.

**Affected Browsers:**
- Chrome 4-82 (partial)
- Edge 12-82 (partial)
- Firefox 2-79 (partial)
- Safari 3.1-15.3 (partial)
- Opera 15-69 (partial)
- iOS Safari 3.2-15.3 (partial)
- Android browsers (partial)
- Samsung Internet (partial)

#### Note #2: Webkit Prefix in Edge/IE Mobile
Microsoft Edge and IE Mobile support this property with the `-webkit-` prefix rather than `-ms-` for interoperability reasons.

**Affected Browsers:**
- Edge 12-82
- IE Mobile 11

#### Note #3: Dropdown Arrow Not Removed in Firefox
The `-moz-appearance:none` value did not remove the dropdown arrow in the `<select>` tag in earlier Firefox versions (Firefox 2-34).

**Affected Browsers:**
- Firefox 2-34

## Recommended Usage

### Progressive Enhancement Strategy
For maximum browser compatibility, use vendor prefixes alongside the unprefixed property:

```css
button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  /* Custom styles */
  background: #3498db;
  border: none;
  padding: 10px 20px;
}

input[type="checkbox"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  /* Add custom dropdown arrow */
  background-image: url("data:image/svg+xml;...");
  background-repeat: no-repeat;
  background-position: right center;
  padding-right: 30px;
}
```

### Browser Support Decision Tree
- **Target: Modern browsers only (84+):** Use unprefixed `appearance` only
- **Target: Broader support (includes Safari 15.3-):** Use all three versions with vendor prefixes
- **Target: Wide legacy support:** Include vendor-prefixed versions and provide fallbacks

## Related Resources

### Documentation & Guides
- [CSS Tricks - appearance Property Reference](https://css-tricks.com/almanac/properties/a/appearance/)

### Known Issues
- [Safari WebKit Bug 143842 - Unprefixed `appearance` Implementation](https://bugs.webkit.org/show_bug.cgi?id=143842)

## Examples

### Basic Button Reset
```css
button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
```

### Custom Checkbox
```css
input[type="checkbox"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #999;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.2s;
}

input[type="checkbox"]:checked {
  background-color: #007bff;
  border-color: #007bff;
}

input[type="checkbox"]:checked::after {
  content: "✓";
  display: block;
  color: white;
  text-align: center;
  line-height: 1;
}
```

### Custom Select Dropdown
```css
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 100%;
  padding: 10px;
  padding-right: 35px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 12px;
  cursor: pointer;
}

select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}
```

---

**Last Updated:** 2025
**Source:** [Can I Use - CSS Appearance](https://caniuse.com/css-appearance)
