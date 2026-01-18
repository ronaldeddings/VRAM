# Input autocomplete attribute: on & off values

## Overview

The `autocomplete` attribute for HTML `<input>` elements enables developers to control whether the browser should autofill form field values. This documentation covers support for the basic `on` and `off` values of this attribute.

## Description

The `autocomplete` attribute indicates to the browser whether a value should or should not be autofilled when appropriate. By setting `autocomplete="off"` on an input field or form, developers can prevent the browser from automatically populating the field with previously entered values. Conversely, `autocomplete="on"` explicitly enables autofill functionality.

This attribute is particularly useful for:
- Security-sensitive fields (passwords, sensitive information)
- Dynamic forms that shouldn't use cached values
- Custom autofill implementations
- User privacy protection

## Specification Status

**Status:** Living Standard (ls)

**Specification:** [WHATWG HTML Standard - Autofill](https://html.spec.whatwg.org/multipage/forms.html#autofill)

The `autocomplete` attribute is defined in the living HTML standard maintained by the Web Hypertext Application Technology Working Group (WHATWG).

## Categories

- **DOM** - Document Object Model specification

## Use Cases & Benefits

### Primary Use Cases

1. **Security & Privacy**
   - Prevent autofill on password fields to encourage strong password managers
   - Disable autofill on sensitive fields like credit card numbers
   - Control data retention in user sessions

2. **Form Usability**
   - Disable autocomplete on one-time codes and verification fields
   - Prevent incorrect autofill on similar looking fields
   - Create custom form experiences with external data sources

3. **Performance**
   - Reduce processing overhead on frequently-changing values
   - Optimize mobile device interactions
   - Control memory usage for dynamic forms

4. **User Experience**
   - Guide users toward password managers
   - Prevent confusion on multi-step forms
   - Enable custom input validation and suggestions

### Benefits

- **User Control:** Modern browsers prioritize user intent, allowing manual override when needed
- **Security Enhancement:** Reduces accidental exposure of sensitive data
- **Compatibility:** Widely supported across modern browsers
- **Flexibility:** Can be applied at field or form level
- **Standards-Based:** Part of official HTML specification

## Browser Support

### Support Legend

- **y** - Full support
- **a** - Partial support (with notes)
- **n** - No support

### Support Table

| Browser | Initial Support | Latest Version | Support Level | Notes |
|---------|-----------------|-----------------|---------------|-------|
| **Chrome** | 17 | 146 | a #2 | Full support until v26, partial from v27+ (intentionally ignores `off` for autofill) |
| **Firefox** | 2 | 148 | a #3 | Full support 2-29, partial from 30+ (ignores `off` for login forms) |
| **Safari** | 5.1 | 18.x | a #5 | Full support in 5.1-6.1, partial from 7+ (ignores `off` for username/email/password fields) |
| **Opera** | 9 | 122 | y | Full support since version 9 |
| **Edge** | 12 | 143 | a #2 | Partial support (intentionally ignores `off` for autofill) |
| **Internet Explorer** | 5.5 | 11 | a #1 | Partial support (ignores `off` for password fields) |

### Mobile Browsers

| Browser | Support | Notes |
|---------|---------|-------|
| **iOS Safari** | y #4 | 5.0+ (does not display previously submitted values with `on`) |
| **Android Browser** | y | 2.1+ (does not display previously submitted values with `on`) |
| **Chrome Android** | y | 142+ |
| **Firefox Android** | y | 144+ |
| **Samsung Internet** | y | 4.0+ |
| **Opera Mobile** | y | 10+ |
| **Opera Mini** | y #4 | All versions |
| **UC Browser** | y #4 | 15.5+ |
| **QQ Browser** | a #2 | 14.9+ (partial - intentionally ignores `off`) |
| **Baidu Browser** | y | 13.52+ |
| **KaiOS** | a #3 | 2.5+ (partial - ignores `off` for login forms) |
| **IE Mobile** | a #5 | 10-11 (ignores `off` for username/email/password) |
| **BlackBerry** | y | 7, 10 |

### Support Summary

- **Full Support (y):** 55.85% of browser usage
- **Partial Support (a):** 37.87% of browser usage
- **No Support (n):** Minimal legacy browsers only

## Important Notes

### Browser Behavior & Caveats

This support information covers the basic `on` and `off` values of the `autocomplete` attribute and does not include support for other autocomplete values (such as `email`, `tel`, `url`, etc.).

### Modern Browser Behavior

Modern browsers intentionally override the `off` value in specific scenarios to enhance user security and experience:

1. **Password Managers:** Browsers intentionally ignore `autocomplete="off"` to allow password managers to function properly, giving users more control over form autofilling.

2. **Password Fields:** Most modern browsers ignore `off` on password fields specifically to:
   - Encourage the use of strong password managers
   - Prevent developers from blocking legitimate autofill tools
   - Balance developer intent with user security needs

3. **Login Forms:** Firefox, Safari, and other browsers ignore `off` on login form fields to maintain password manager functionality.

### Specific Browser Limitations

**Note #1 (IE 11, Edge 12-18):**
Partial support refers to ignoring the `off` value for password fields. [See related blog post](http://blogs.msdn.com/b/ieinternals/archive/2009/09/10/troubleshooting-stored-login-problems-in-ie.aspx)

**Note #2 (Chrome 41+, Edge 79+, QQ Browser):**
Partial support refers to the browser intentionally ignoring `autocomplete="off"` when the user uses the browser's autofill functionality. [See Chromium bug](https://code.google.com/p/chromium/issues/detail?id=468153#c29)

**Note #3 (Firefox 30+, KaiOS 2.5+):**
Partial support refers to ignoring `autocomplete="off"` for login forms. [See Firefox bug](https://bugzilla.mozilla.org/show_bug.cgi?id=956906)

**Note #4 (iOS Safari, Opera Mini, Android, UC Browser):**
Browser does not display previously submitted values as options with `on` value. Users must manually enter values or rely on system-level autofill.

**Note #5 (Safari 7+, IE Mobile 10-11):**
Safari ignores the `off` value for [username, email and password fields](https://stackoverflow.com/questions/22661977/disabling-safari-autofill-on-usernames-and-passwords) to maintain compatibility with password managers.

## Implementation Recommendations

### Best Practices

1. **Use `autocomplete="off"` Sparingly**
   - Only use on fields where autofill is genuinely inappropriate
   - Modern browsers may override this for security-sensitive fields

2. **Consider User Needs**
   - Allow password managers to work
   - Test with popular password managers (1Password, Bitwarden, LastPass, etc.)
   - Don't block legitimate user convenience features

3. **For Sensitive Fields**
   - Focus on server-side security measures
   - Implement HTTPS for all form submissions
   - Use modern form autofill values (e.g., `autocomplete="current-password"`)

4. **Mobile Considerations**
   - Some mobile browsers don't display previously submitted values
   - Test autocomplete behavior on target devices
   - Consider touch-friendly form layouts

### Example Usage

```html
<!-- Disable autocomplete on a single field -->
<input type="text" name="username" autocomplete="off">

<!-- Disable autocomplete on an entire form -->
<form autocomplete="off">
  <input type="email" name="email">
  <input type="password" name="password">
</form>

<!-- Recommended: Use specific autocomplete values -->
<input type="email" name="email" autocomplete="email">
<input type="password" name="password" autocomplete="current-password">
```

## Related Resources

- **MDN Web Docs:** [autocomplete attribute documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-autocomplete)
- **WHATWG Specification:** [HTML Autofill Section](https://html.spec.whatwg.org/multipage/forms.html#autofill)
- **Chromium Issue Tracker:** [Bug #468153 - autocomplete=off handling](https://code.google.com/p/chromium/issues/detail?id=468153#c29)
- **Mozilla Bugzilla:** [Bug #956906 - Firefox login form handling](https://bugzilla.mozilla.org/show_bug.cgi?id=956906)

## See Also

- [HTML5 Form Validation](/docs/html5-form-validation/)
- [Form Input Types](/docs/forms/)
- [Web Security Best Practices](/docs/security/)
- [Autocomplete Values Reference](/docs/references/autocomplete-values/)
