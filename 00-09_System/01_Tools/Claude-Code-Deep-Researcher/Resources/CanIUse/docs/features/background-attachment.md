# CSS background-attachment

## Overview

The `background-attachment` property defines how a background image is attached to a scrollable element, determining whether the background scrolls with the content or remains fixed relative to the viewport.

## Description

Method of defining how a background image is attached to a scrollable element. Values include:

- **`scroll`** (default) - The background image scrolls with the element's content
- **`fixed`** - The background image remains fixed relative to the viewport and doesn't scroll
- **`local`** - The background image scrolls with the element's content, including when the element has scrollable overflow

## Specification

- **Status**: Candidate Recommendation (CR)
- **W3C Spec**: [CSS Backgrounds and Borders Module Level 3](https://www.w3.org/TR/css3-background/#the-background-attachment)

## Categories

- CSS

## Benefits and Use Cases

### Visual Effects
- Create parallax scrolling effects by fixing background images while content scrolls
- Maintain visual interest with decorative backgrounds that stay in place
- Enhance perceived depth and page hierarchy

### User Experience
- Draw attention to fixed backgrounds while content moves over them
- Create watermark effects that remain visible while users scroll through content
- Improve visual stability for large background images

### Web Design Patterns
- Header backgrounds that remain visible while scrolling
- Full-screen hero sections with fixed imagery
- Decorative backgrounds for form elements or containers
- Local scrolling within contained elements (dialogs, sidebars)

### Practical Applications
- E-commerce product showcases with fixed backgrounds
- Portfolio websites with immersive scrolling experiences
- Documentation sites with sticky header backgrounds
- Mobile-friendly responsive designs with controlled background behavior

## Browser Support

### Latest Versions with Full Support

| Browser | First Full Support | Current Status |
|---------|-------------------|----------------|
| Chrome | 4 | ✅ Full Support |
| Edge | 12 | ✅ Full Support |
| Firefox | 25 | ✅ Full Support |
| Safari | 5 | ✅ Full Support |
| Opera | 10.5 | ✅ Full Support |
| Safari (iOS) | 15.4 | ✅ Full Support |
| Android Chrome | Latest | ✅ Full Support |

### Support Details by Browser

#### Desktop Browsers

**Chrome**
- Full support since version 4
- Current version 146+ fully supported

**Edge**
- Full support since version 12
- All current versions (up to 143) fully supported

**Firefox**
- Partial support (scroll, fixed) until version 24
- Full support (including local) since version 25
- All current versions (up to 148) fully supported

**Safari**
- Partial support in versions 3.1-4 (scroll, fixed only)
- Full support since version 5
- Note: Versions 13-15.3 have broken support for fixed/local with outer scroll containers (bug #5)
- Full support restored in version 15.4+

**Opera**
- Partial support (scroll, fixed only) until version 10
- Full support since version 10.5
- All current versions (up to 122) fully supported

#### Mobile Browsers

**iOS Safari**
- No support through version 4.1
- Partial support (local only) in versions 5.0-12.5
- Broken support for fixed/local in versions 13.0-15.3 (bug #5)
- Full support restored since version 15.4
- Current version 18.5+ fully supported

**Android**
- Limited support; most versions show no support
- Partial support in Android 4.1-4.3 (scroll, fixed only)

**Android Chrome**
- Full support in latest versions

**Android Firefox**
- Full support in latest versions

**Opera Mobile**
- Partial support (scroll, fixed) in version 10
- Full support since version 11

**Samsung Internet**
- Partial support across all versions tested (bug #4)
- Does not support fixed
- Local only works if border-radius is set

### Global Usage

- **Full Support (y)**: 90.74% of global users
- **Partial Support (a)**: 2.35% of global users

## Known Bugs and Limitations

### Critical Issues

1. **iOS Background-Attachment: Fixed + Background-Size: Cover Bug**
   - **Affected**: iOS Safari (versions with partial support)
   - **Issue**: `background-attachment: fixed` cannot be reliably used together with `background-size: cover`
   - **Details**: [See StackOverflow discussion](https://stackoverflow.com/questions/21476380/background-size-on-ios)
   - **Workaround**: Use alternative sizing methods or avoid combining these properties on iOS

2. **Safari Fixed/Local Scroll Container Bug** (#5)
   - **Affected**: Safari 13-15.3, iOS Safari 13-15.3
   - **Issue**: Broken support for `background-attachment: fixed` and `local` when scrolling an outer scroll container
   - **Related**: [WebKit Bug Report](https://bugs.webkit.org/show_bug.cgi?id=219324)
   - **Resolution**: Fixed in Safari 15.4+

### Browser-Specific Issues

3. **Chrome Will-Change Property Conflict**
   - **Affected**: Chrome
   - **Issue**: Using the `will-change` property on a selector that also has `background-attachment: fixed` causes the background image to be cut off with whitespace appearing around it
   - **Workaround**: Avoid using `will-change` on elements with fixed background attachments

4. **Firefox Textarea Local Support**
   - **Affected**: Firefox (all versions)
   - **Issue**: Firefox does not support the `local` value when applied to `<textarea>` elements
   - **Workaround**: Use `scroll` or `fixed` for textarea elements

### Mobile Limitations

5. **Delayed Background Position Updates**
   - **Affected**: Most mobile devices
   - **Issue**: Mobile devices experience a delay in updating background position after scrolling a page with fixed backgrounds
   - **Impact**: Performance and visual smoothness on mobile platforms
   - **Note**: This is a general limitation of mobile browsers, not a bug

### Feature-Specific Limitations

**Partial Support Breakdown**:
- **Note #1**: Partial support refers to supporting `scroll` and `fixed` but not `local`
- **Note #2**: Partial support refers to supporting `local` but not `fixed` (e.g., iOS Safari 5-12.5)
- **Note #3**: iOS only supports `local` when `-webkit-overflow-scrolling: touch` is _not_ used
- **Note #4**: Samsung Internet does not support `fixed`, and due to a bug only supports `local` if a `border-radius` is set on the element
  - Reference: [Chromium Bug #627037](https://bugs.chromium.org/p/chromium/issues/detail?id=627037)

## CSS Syntax

```css
/* Keyword values */
background-attachment: scroll;
background-attachment: fixed;
background-attachment: local;

/* Global values */
background-attachment: inherit;
background-attachment: initial;
background-attachment: revert;
background-attachment: revert-layer;
background-attachment: unset;
```

## Code Examples

### Basic Fixed Background

```css
.hero {
  background-image: url('background.jpg');
  background-attachment: fixed;
  background-size: cover;
  height: 100vh;
}
```

### Parallax Scrolling Effect

```css
.parallax-section {
  background-image: url('parallax.jpg');
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 500px;
}
```

### Local Background Scrolling

```css
.scrollable-box {
  background-image: url('pattern.jpg');
  background-attachment: local;
  height: 400px;
  overflow-y: scroll;
}
```

### Multiple Backgrounds

```css
body {
  background-image:
    url('foreground.png'),
    url('background.jpg');
  background-attachment:
    scroll,
    fixed;
  background-position:
    center top,
    center center;
}
```

## Recommendations

### For Maximum Compatibility

1. **Test Fixed Backgrounds on Mobile**: Always test fixed backgrounds on iOS and Android devices due to known limitations and delays
2. **Avoid Combining with Background-Size Cover on iOS**: Consider alternative approaches for iOS Safari if using `background-attachment: fixed`
3. **Avoid Will-Change Conflicts**: Don't use `will-change` on elements with `background-attachment: fixed` in Chrome
4. **Test Textarea Elements in Firefox**: If using fixed/local attachment on textarea elements, test thoroughly in Firefox

### For Optimal Performance

1. **Use Fixed Sparingly on Mobile**: Performance is better on desktop; use fixed backgrounds conservatively on mobile
2. **Consider Feature Queries**: Use CSS feature queries for progressive enhancement
3. **Provide Fallbacks**: Ensure page is functional without fixed background effects
4. **Optimize Images**: Use optimized background images to reduce file size

### For Better UX

1. **Test on Real Devices**: Emulators don't always reflect real mobile performance
2. **Monitor Performance**: Use performance monitoring to track scrolling frame rates
3. **Provide Alternatives**: Consider `scroll` as a fallback for devices that don't support `fixed` well
4. **Document Limitations**: Inform users about known mobile limitations

## Related Links

### Official Resources
- **MDN Web Docs**: [CSS background-attachment](https://developer.mozilla.org/en-US/docs/Web/CSS/background-attachment)
- **W3C Specification**: [CSS Backgrounds and Borders Module Level 3](https://www.w3.org/TR/css3-background/#the-background-attachment)

### Related CSS Properties
- `background-image` - Sets one or more background images
- `background-position` - Sets the initial position of a background image
- `background-size` - Sets the size of background images
- `background-repeat` - Sets how background images are repeated
- `background-clip` - Defines the area within which the background is painted

### Browser Bugs & Issue Trackers
- [WebKit Bug #219324 - Broken support of fixed/local with outer scroll](https://bugs.webkit.org/show_bug.cgi?id=219324)
- [Chromium Issue #627037 - Samsung Internet border-radius limitation](https://bugs.chromium.org/p/chromium/issues/detail?id=627037)
- [StackOverflow - Background-size cover on iOS](https://stackoverflow.com/questions/21476380/background-size-on-ios)

### Browser Documentation
- [Chrome Developers](https://developer.chrome.com/)
- [Mozilla Developer Network](https://developer.mozilla.org/)
- [Safari Release Notes](https://webkit.org/blog/)

## Feature Checklist

| Aspect | Status |
|--------|--------|
| `scroll` value | ✅ Widely supported |
| `fixed` value | ⚠️ Works on desktop, limitations on mobile |
| `local` value | ✅ Widely supported (except specific browsers/versions) |
| Desktop browsers | ✅ Excellent support |
| Mobile browsers | ⚠️ Good support with known limitations |
| Parallax effects | ✅ Recommended on desktop only |
| Performance | ✅ Good on desktop, ⚠️ Variable on mobile |

## Summary

The `background-attachment` property has excellent browser support across desktop browsers (90.74% global usage), with full support since version 4 in Chrome and Safari 5. Mobile support is generally good but has notable limitations and performance considerations, particularly on iOS Safari (especially versions 13-15.3, which have been fixed in 15.4+) and Android devices.

For production use, the property is safe to use widely, but careful testing on mobile devices is recommended, especially when combining `fixed` with other background properties like `background-size: cover`. Alternative approaches should be considered for the small percentage of users on older browsers or devices with known limitations.
