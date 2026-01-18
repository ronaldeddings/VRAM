# Password Rules

## Description

The Password Rules specification provides an HTML input attribute that allows developers to define password requirements and customization rules. This feature enables websites to communicate password policies directly to password managers and browser autofill functionality, ensuring that auto-generated passwords comply with the website's specific requirements.

The `passwordrules` attribute works in conjunction with password autofill mechanisms to improve user experience by:
- Allowing password managers to generate compliant passwords automatically
- Reducing friction in the password creation process
- Ensuring generated passwords meet security requirements
- Supporting complex password policies without user confusion

## Specification Status

- **Status:** Living Standard (LS)
- **Spec URL:** [WHATWG HTML Issue #3518](https://github.com/whatwg/html/issues/3518)
- **Type:** HTML5 Input Attribute

## Categories

- HTML5
- JS API
- Security

## Benefits & Use Cases

### Improved User Experience
- Users can leverage password managers to generate compliant passwords without manual adjustment
- Reduces failed password creation attempts due to unmet requirements
- Streamlines account creation and password reset flows

### Enhanced Security
- Enables secure password generation that meets organizational requirements
- Reduces reliance on weak user-created passwords
- Supports modern password policies without sacrificing usability

### Better Password Manager Integration
- Allows password managers (Safari, Chrome, etc.) to understand specific requirements
- Enables intelligent password generation without user intervention
- Supports specialized password rules like character set restrictions

### Enterprise & Compliance
- Helps organizations enforce password policies across web applications
- Supports regulatory compliance requirements
- Reduces support costs related to password-related issues

## Browser Support

### Support Key
- **y** - Supported
- **u** - Unknown/Partial Support
- **n** - Not Supported

| Browser | Support | First Version | Notes |
|---------|---------|---------------|-------|
| **Safari** (macOS) | Supported | 12 | Full support, expanded to unknown in 13.1+ |
| **Safari Technology Preview** | Unknown | TP | Experimental support |
| **Chrome** | Unknown | 144+ | Partial/under development |
| **Edge** | Unknown | 79+ | Partial/under development |
| **Firefox** | Unknown | 146+ | Partial/under development (experimental) |
| **Opera** | Unknown | 53+ | Partial/under development |
| **iOS Safari** | Not Supported | All versions | No support detected |
| **Android Chrome** | Unknown | 142+ | Partial/under development |
| **Android Firefox** | Unknown | 144+ | Partial/under development |
| **Samsung Internet** | Unknown | 7.2+ | Partial/under development |
| **Opera Mini** | Unknown | All | Partial/under development |
| **Opera Mobile** | Unknown | 80+ | Partial/under development |
| **IE/IE Mobile** | Not Supported | All versions | Not supported |
| **BlackBerry** | Unknown | 10 | Partial/under development |

### Desktop Browsers Summary

| Browser | Status |
|---------|--------|
| Safari | ✅ Full Support (v12+) |
| Chrome | ⚠️ Unknown (v144+) |
| Edge | ⚠️ Unknown (v79+) |
| Firefox | ⚠️ Unknown (v146+) |
| Opera | ⚠️ Unknown (v53+) |
| Internet Explorer | ❌ Not Supported |

### Mobile Browsers Summary

| Browser | Status |
|---------|--------|
| iOS Safari | ❌ Not Supported |
| Android Chrome | ⚠️ Unknown (v142+) |
| Android Firefox | ⚠️ Unknown (v144+) |
| Samsung Internet | ⚠️ Unknown (v7.2+) |
| Opera Mobile | ⚠️ Unknown (v80+) |

## Usage Example

```html
<input
  type="password"
  id="password"
  name="password"
  passwordrules="minlength: 8; required: [upper, lower, digit, special];"
/>
```

### Common Password Rule Syntax

Password rules use a semicolon-delimited format with specific requirements:

```
passwordrules="
  minlength: 8;
  maxlength: 128;
  required: [upper, lower, digit, special];
  allowed: [upper, lower, digit, special, unicode];
  minlength: 8;
"
```

**Available Rule Components:**
- `minlength` - Minimum password length
- `maxlength` - Maximum password length
- `required` - Character classes that must be present (upper, lower, digit, special)
- `allowed` - Character classes that are allowed (upper, lower, digit, special, unicode)

## Implementation Notes

### Current Implementation Status

The Password Rules feature has varying levels of support across browsers:

- **Safari (macOS):** Full working implementation since version 12
- **Other Browsers:** Feature status is "unknown" - implementations may be incomplete, in development, or not fully compatible with the specification

### Considerations for Developers

1. **Fallback Behavior:** The `passwordrules` attribute is currently only reliably used by Safari. Other browsers ignore the attribute and fall back to standard password input behavior.

2. **Progressive Enhancement:** Use the attribute as a progressive enhancement. Don't rely on it alone for password validation - always validate passwords on both client and server.

3. **Validation:** Always implement server-side password validation independent of this attribute, as client-side validation can be bypassed.

4. **Compatibility:** Check current browser support before implementing - the status is still evolving across vendors.

5. **User Testing:** Test password creation flows on target devices to ensure the expected behavior with password managers.

## Related Resources & Links

- **[Safari Technology Preview 58](https://webkit.org/blog/8327/safari-technology-preview-58-with-safari-12-features-is-now-available/)** - Initial announcement of Password Rules support
- **[Apple Password Rules Validation Tool](https://developer.apple.com/password-rules/)** - Official tool for validating password rule syntax
- **[Apple Developer Documentation: Customizing Password AutoFill Rules](https://developer.apple.com/documentation/security/password_autofill/customizing_password_autofill_rules)** - Comprehensive guide for implementing password rules
- **[WHATWG HTML Specification](https://html.spec.whatwg.org/)** - Official HTML specification
- **[CanIUse: Password Rules](https://caniuse.com/passwordrules)** - Browser compatibility data

## Key Takeaways

- **Primary Use:** Define password requirements for password manager integration
- **Best Support:** Safari on macOS (v12+)
- **Emerging Support:** Chrome, Firefox, Edge showing unknown status in recent versions
- **Mobile:** Limited to no support on iOS and Android platforms
- **Best Practice:** Use as progressive enhancement alongside robust server-side validation
- **Validation Tool:** Use Apple's official validation tool to ensure correct syntax

---

*Last Updated: 2025-12-13*
*Data Source: CanIUse Database*
