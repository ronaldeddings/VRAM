# iframe sandbox Attribute

## Overview

The `sandbox` attribute for iframes provides a method of running external site pages with reduced privileges in iframes. This security feature allows developers to embed untrusted content while limiting its capabilities.

## Description

The sandbox attribute isolates an iframe's content, restricting JavaScript execution, form submissions, plugin access, and other potentially dangerous features by default. You can selectively re-enable specific features as needed using sandbox tokens.

**Key Benefits:**
- Run untrusted or third-party content safely
- Prevent JavaScript execution from embedded pages
- Restrict access to parent window's data
- Limit plugin functionality
- Prevent form submissions from embedded content
- Maintain same-origin policies within sandboxed contexts

## Specification

- **Specification:** [WHATWG HTML Living Standard - iframe sandbox](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-sandbox)
- **Status:** Living Standard (ls)

## Categories

- HTML5
- Security

## Browser Support

### Support Legend
- **✅ Full Support (y)** - Feature is fully supported
- **⚠️ Partial Support (a)** - Feature is partially supported with limitations
- **❌ No Support (n)** - Feature is not supported

### Desktop Browsers

| Browser | First Supported | Current Support |
|---------|-----------------|-----------------|
| Chrome | 5+ | ✅ All versions 5+ |
| Firefox | 17+ (partial) | ✅ Full (28+) |
| Safari | 5+ | ✅ All versions 5+ |
| Edge | 12+ | ✅ All versions |
| Opera | 15+ | ✅ All versions 15+ |
| Internet Explorer | 10+ | ✅ IE 10-11 |

### Mobile Browsers

| Browser | Support Status |
|---------|----------------|
| iOS Safari | ✅ 4.0+ |
| Android Browser | ✅ 2.2+ |
| Chrome Android | ✅ Modern versions |
| Firefox Android | ✅ Modern versions |
| Opera Mini | ❌ Not supported |
| Samsung Internet | ✅ 4+ |
| UC Browser | ✅ 15.5+ |
| Opera Mobile | ✅ 80+ |
| BlackBerry | ✅ 7-10 |
| Android UC | ✅ 15.5+ |
| Baidu | ✅ 13.52+ |
| KaiOS | ✅ 2.5+ |

### Detailed Browser Version Table

#### Chrome
- **First Support:** Version 5
- **Status:** Fully supported in all versions from 5 onwards

#### Firefox
- **Partial Support:** Versions 17-27 (with `allow-popups` limitations)
  - Note: Firefox versions below 28 do not support `allow-popups` correctly
- **Full Support:** Version 28+

#### Safari
- **First Support:** Version 5
- **Status:** Fully supported in all versions from 5 onwards

#### Edge (Chromium-based)
- **First Support:** Version 12
- **Status:** Fully supported in all versions

#### Opera
- **First Support:** Version 15
- **Status:** Fully supported in all versions from 15 onwards

#### Internet Explorer
- **First Support:** Version 10
- **Status:** Supported in IE 10 and IE 11

#### iOS Safari
- **First Support:** Version 4.0+
- **Status:** Fully supported since 4.0

#### Android Browser
- **First Support:** Version 2.2
- **Status:** Fully supported since 2.2

### Global Usage

- **Global Support:** 93.54% of users have browsers with full support
- **Partial Support:** 0% (minimal edge cases)
- **No Support:** 6.46% (primarily Opera Mini)

## Use Cases & Benefits

### Security Applications

1. **Third-Party Content Embedding**
   - Safely embed widgets from untrusted sources
   - Isolate analytics scripts and ad networks
   - Embed user-generated content safely

2. **Sandboxed Environments**
   - Create isolated execution contexts for plugins
   - Run untrusted code in restricted environments
   - Prevent clickjacking attacks

3. **Content Isolation**
   - Prevent access to parent window's DOM
   - Restrict cookie and local storage access
   - Limit cross-origin communication

### Common Patterns

```html
<!-- Completely restricted iframe -->
<iframe sandbox src="untrusted.html"></iframe>

<!-- Allow scripts but restrict others -->
<iframe sandbox="allow-scripts" src="content.html"></iframe>

<!-- Allow scripts and form submission -->
<iframe sandbox="allow-scripts allow-forms" src="app.html"></iframe>

<!-- Allow scripts and cross-origin requests -->
<iframe sandbox="allow-scripts allow-same-origin" src="app.html"></iframe>
```

### Sandbox Tokens

The following tokens can be used to selectively re-enable features:

- `allow-forms` - Allow form submission
- `allow-scripts` - Allow JavaScript execution
- `allow-same-origin` - Treat as same-origin
- `allow-popups` - Allow window.open()
- `allow-top-navigation` - Allow navigation of parent window
- `allow-pointer-lock` - Allow pointer lock
- `allow-presentation` - Allow presentation API

## Important Notes

### Known Issues

- **Firefox Versions < 28:** The `allow-popups` sandbox token does not work correctly. If you need popup functionality, ensure Firefox 28 or later is targeted.

### Implementation Considerations

1. **Default Restrictions:** By default, sandboxed iframes cannot:
   - Execute JavaScript
   - Access parent window
   - Submit forms
   - Open popups
   - Access plugins

2. **Gradual Permission Grant:** Only enable the minimum required tokens for your use case

3. **Performance:** Sandboxing adds minimal performance overhead

4. **Compatibility:** Consider targeting Internet Explorer 10+ for broad compatibility

## Related Resources

- [Chromium Blog: Security in Depth - HTML5's Sandbox](https://blog.chromium.org/2010/05/security-in-depth-html5s-sandbox.html)
- [MSDN - iframe sandbox Attribute](https://msdn.microsoft.com/en-us/hh563496)
- [WebPlatform Docs - sandbox](https://webplatform.github.io/docs/html/attributes/sandbox)
- [WHATWG HTML Standard - iframe Element](https://html.spec.whatwg.org/multipage/iframe-embed-object.html)

## Quick Facts

| Metric | Value |
|--------|-------|
| **Specification Status** | Living Standard |
| **First Implementation** | Chrome 5 (2010) |
| **Current Global Support** | 93.54% |
| **Desktop Support** | 99%+ |
| **Mobile Support** | 95%+ |
| **Production Ready** | Yes |

---

*Documentation generated from CanIUse feature data. Last updated with CanIUse feature database.*
