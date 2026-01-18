# Subresource Integrity (SRI)

## Overview

Subresource Integrity (SRI) is a web platform security feature that enables browsers to verify that resources (such as libraries, stylesheets, and scripts) are delivered without unexpected manipulation. It allows web developers to provide a cryptographic hash of a resource, which the browser can use to verify that the fetched resource matches the expected hash before executing or applying it.

## Description

Subresource Integrity enables browsers to verify that file is delivered without unexpected manipulation.

## Specification

- **Status**: Recommendation (REC)
- **Specification URL**: [W3C Subresource Integrity](https://www.w3.org/TR/SRI/)

## Categories

- HTML5
- Security

## Use Cases & Benefits

### Primary Benefits

1. **Protection Against Compromised CDNs**: Ensures that resources served from Content Delivery Networks haven't been tampered with by hackers or compromised servers.

2. **Verification of Third-Party Libraries**: Allows developers to safely include external JavaScript libraries, CSS frameworks, and other assets from third-party sources with confidence that the content hasn't been modified.

3. **Protection Against Man-in-the-Middle (MITM) Attacks**: Provides cryptographic verification that the resource received is exactly what was intended, even if transmitted over compromised networks.

4. **Supply Chain Security**: Helps mitigate risks associated with supply chain attacks where malicious code could be injected into commonly-used libraries.

5. **Regulatory Compliance**: Assists in meeting security compliance requirements by demonstrating security measures for external resource validation.

### Implementation Example

```html
<!-- Example: Loading jQuery from a CDN with SRI -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"
        integrity="sha384-4bNvY5snLikJaZnZD3hSNnFWJSrqV1n9MUMyDMSeCnuKfsEYoswCS50Is8ouklAj"
        crossorigin="anonymous"></script>

<!-- Example: Loading Bootstrap CSS with SRI -->
<link rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
      integrity="sha384-1BmE4kWBq78iYhFldwKuhfstunjODlUX58VxWZrJ5jLPaEjGKh0LSAOk08K+VBwYvVNGsVMaUGKvVzqvvRFm49"
      crossorigin="anonymous">
```

## Browser Support

| Browser | Support | First Version | Notes |
|---------|---------|---------------|-------|
| Chrome | ✅ Yes | 45 | Fully supported |
| Firefox | ✅ Yes | 43 | Fully supported |
| Safari | ✅ Yes | 11 | Fully supported |
| Edge | ✅ Yes | 17 | Fully supported since Edge 17 |
| Opera | ✅ Yes | 32 | Fully supported |
| Internet Explorer | ❌ No | — | Not supported in any version |
| iOS Safari | ⚠️ Partial | 11.3 | Supported from iOS 11.3+ (Note #1) |
| Android Chrome | ✅ Yes | v142+ | Supported in recent versions |
| Samsung Internet | ✅ Yes | 5.0+ | Fully supported |

### Support Notes

**Note #1**: iOS Safari 11.0-11.2 supports the feature but requires enabling via "Experimental Features" developer menu.

### Global Coverage

- **Users with Support**: 92.92% of global web traffic
- **Users without Support**: ~7.08% (primarily older browsers and IE)

### Unsupported Browsers

- **Internet Explorer** (all versions): Complete lack of support
- **Opera Mini**: No support (all versions)
- **Older Mobile Browsers**: Limited support on older Android and iOS versions

## Technical Details

### How It Works

1. **Hash Generation**: Developers generate a cryptographic hash of the resource using algorithms like SHA-256, SHA-384, or SHA-512.

2. **Integrity Attribute**: The hash is included in the `integrity` attribute of `<script>`, `<link>`, or other resource-loading elements.

3. **Browser Verification**: When the browser downloads the resource, it computes the hash of the received content.

4. **Comparison & Action**:
   - If hashes match: Resource is loaded normally
   - If hashes don't match: The resource is rejected and a security error is triggered

### Supported Hash Algorithms

- `sha256` - SHA-256
- `sha384` - SHA-384
- `sha512` - SHA-512

### Hash Format

```
algorithm-hash
```

Example: `sha384-4bNvY5snLikJaZnZD3hSNnFWJSrqV1n9MUMyDMSeCnuKfsEYoswCS50Is8ouklAj`

### Attributes

- **`integrity`**: Required attribute containing the hash value
- **`crossorigin`**: Recommended attribute to enable CORS and hash verification for cross-origin resources

## Practical Considerations

### Advantages

- ✅ Simple to implement
- ✅ No server-side changes required
- ✅ Works with existing infrastructure
- ✅ Excellent browser support in modern browsers
- ✅ Zero performance overhead
- ✅ No privacy concerns

### Limitations

- ⚠️ Must regenerate hashes when updating resources
- ⚠️ Limited to verifying static resources
- ⚠️ No support in Internet Explorer
- ⚠️ Older mobile browsers may not support it

### Best Practices

1. **Always use HTTPS**: SRI is most effective when resources are served over HTTPS.

2. **Use with `crossorigin` attribute**: When loading cross-origin resources, include `crossorigin="anonymous"` or `crossorigin="use-credentials"` to enable proper hash verification.

3. **Pin specific versions**: SRI works best when using specific versions of libraries rather than version aliases.

4. **Automate hash generation**: Use tools like [SRIHash.org](https://www.srihash.org/) to generate hashes automatically.

5. **Document the source**: Keep track of where hashes were generated and which versions they represent.

## Related Links

- [MDN Documentation: Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)
- [SRIHash Generator & Browser Support Test](https://www.srihash.org/)
- [W3C Specification](https://www.w3.org/TR/SRI/)
- [WebKit Feature Request](https://bugs.webkit.org/show_bug.cgi?id=148363)

## Keywords

`SRI`, `security`, `hash`, `integrity`, `CDN`, `subresource`

## References

- **Specification URL**: https://www.w3.org/TR/SRI/
- **CanIUse ID**: Features-json/subresource-integrity.json
- **Chrome Platform Status ID**: 6183089948590080
- **Current Global Support**: 92.92%

---

*Last Updated: 2025*
*This documentation is based on current browser capability data from CanIUse.com*
