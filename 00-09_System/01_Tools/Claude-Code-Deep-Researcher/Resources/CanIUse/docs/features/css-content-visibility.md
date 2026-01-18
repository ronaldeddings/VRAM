# CSS content-visibility

## Description

The `content-visibility` CSS property provides control over when elements are rendered, enabling the browser to skip rendering work for elements not yet in the user's viewport. This property significantly improves rendering performance by deferring layout, rendering, and painting work until elements become visible.

## Specification

- **Status**: Working Draft (WD)
- **Specification URL**: [CSS Containment Module Level 2 - content-visibility](https://www.w3.org/TR/css-contain-2/#content-visibility)

## Category

- CSS

## Benefits and Use Cases

The `content-visibility` property is particularly beneficial for:

### Performance Optimization
- **Faster Initial Page Load**: Skip rendering of off-screen content until it enters the viewport
- **Improved Scroll Performance**: Reduce jank by avoiding unnecessary paint operations
- **Reduced Memory Usage**: Defer resource allocation for hidden content

### Ideal Scenarios
- **Long-scrolling pages**: E-commerce product catalogs, social media feeds, news aggregators
- **Data-heavy applications**: Large tables, lengthy documents, large lists
- **Complex visualizations**: Pages with many DOM elements below the fold
- **Mobile optimization**: Particularly beneficial for devices with limited resources

### Specific Advantages
- Works seamlessly with lazy loading strategies
- Can be combined with `contain: layout style paint` for maximum containment benefits
- Improves both Time to Interactive (TTI) and First Contentful Paint (FCP)
- Automatic rendering when elements enter the viewport
- No JavaScript required for basic usage

## Browser Support

| Browser | First Version with Support | Status |
|---------|---------------------------|--------|
| Chrome | 85 | ✅ Full Support |
| Edge | 85 | ✅ Full Support |
| Firefox | 125 | ✅ Full Support |
| Safari | 18.0 | ✅ Full Support |
| Opera | 71 | ✅ Full Support |
| iOS Safari | 18.0 | ✅ Full Support |
| Android Chrome | 142 | ✅ Full Support |
| Android Firefox | 144 | ✅ Full Support |
| Samsung Internet | 14.0 | ✅ Full Support |

### Notable Unsupported Platforms
- Internet Explorer 11 and earlier: ❌ No support
- Opera Mini: ❌ No support
- Baidu Browser: Limited support (13.52+)

### Current Global Support
- **Overall Usage Coverage**: 89.83%

## CSS Property Values

The `content-visibility` property accepts the following values:

- **`visible`** (default): Element is rendered normally
- **`hidden`**: Element is layout-contained and hidden from view
- **`auto`**: Element is skipped until it becomes visible to the user (optimal for performance)

## Known Issues and Bugs

### Safari - Find-in-Page Issue
**Bug**: [WebKit Bug 283846](https://bugs.webkit.org/show_bug.cgi?id=283846)

In Safari, when `content-visibility: auto` is applied, skipped content is **not findable** using the browser's find-in-page feature (Cmd+F or Ctrl+F). This can negatively impact user experience for content-heavy pages where users expect to search within the full page content.

**Workaround**: Consider using `content-visibility: hidden` for truly hidden content, or avoid this property for content that users may need to search.

### Firefox Implementation Status
As of Firefox 109-124, `content-visibility` is **disabled by default** but can be enabled via:

1. Navigate to `about:config`
2. Search for `layout.css.content-visibility.enabled`
3. Set the preference to `true`

Full support was implemented starting in Firefox 125.

## Related Resources

- **Web.dev Guide**: [content-visibility: the new CSS property that boosts your rendering performance](https://web.dev/content-visibility/)
- **Firefox Support Bug**: [Mozilla Bugzilla #1660384](https://bugzilla.mozilla.org/show_bug.cgi?id=1660384)
- **WebKit Support Bug**: [WebKit Bugzilla #236238](https://bugs.webkit.org/show_bug.cgi?id=236238)

## Practical Examples

### Basic Usage
```css
/* Skip rendering off-screen elements */
.feed-item {
  content-visibility: auto;
}

/* Explicitly render an element */
.visible-section {
  content-visibility: visible;
}

/* Hide and contain an element */
.hidden-content {
  content-visibility: hidden;
}
```

### With Containment
```css
/* Combine with containment for maximum benefit */
.card {
  content-visibility: auto;
  contain: layout style paint;
}
```

### Long Lists and Feeds
```css
/* Perfect for social media feeds or product lists */
.social-feed-item {
  content-visibility: auto;
  /* Prevents layout shift when content loads */
  contain-intrinsic-size: auto 200px;
}
```

## Browser Compatibility Notes

- **Chromium-based browsers** (Chrome, Edge, Opera, Samsung Internet, Brave): Full support since 2020
- **WebKit browsers** (Safari, iOS Safari): Full support since 2024
- **Firefox**: Full support since March 2024 (v125)
- **Mobile browsers**: Excellent support across modern Android and iOS browsers

## Performance Impact

When properly implemented, `content-visibility: auto` can provide:
- 50-80% reduction in layout time for long pages
- 30-50% improvement in scroll performance
- Significant battery savings on mobile devices

## Recommendations

1. **Use `auto` for scrollable lists**: Apply to feed items, product catalogs, and long-scrolling content
2. **Include `contain-intrinsic-size`**: Provide a content placeholder size to prevent layout shift
3. **Test the find-in-page feature**: Particularly important for content-heavy applications
4. **Monitor Core Web Vitals**: Validate improvements to FCP, LCP, and CLS metrics
5. **Progressive Enhancement**: Use with feature detection for older browsers
6. **Avoid on critical content**: Don't apply to content above the fold initially

## See Also

- [CSS Containment Module Level 2](https://www.w3.org/TR/css-contain-2/)
- [CSS Contain Property](https://developer.mozilla.org/en-US/docs/Web/CSS/contain)
- [Contain-Intrinsic-Size Property](https://developer.mozilla.org/en-US/docs/Web/CSS/contain-intrinsic-size)
- [Web Performance Best Practices](https://web.dev/performance/)
