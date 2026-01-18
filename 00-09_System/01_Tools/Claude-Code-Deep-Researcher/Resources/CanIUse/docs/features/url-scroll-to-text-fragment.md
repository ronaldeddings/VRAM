# URL Scroll-To-Text Fragment

## Overview

URL scroll-to-text fragments enable developers to create hyperlinks that automatically scroll to and highlight a specific piece of text on a web page. This is accomplished using the special `:~:text=` URL fragment syntax.

## Description

This feature allows you to define a piece of text in a URL fragment that will be automatically scrolled into view and visually highlighted when the page loads. Instead of manually scrolling or using page-wide identifiers, you can link directly to any text content on a page using the syntax:

```
https://example.com/page#:~:text=specific text content
```

## Specification

- **Official Specification**: [WICG Scroll To Text Fragment](https://wicg.github.io/ScrollToTextFragment/)
- **Status**: Unofficial/Under Development
- **Standards Body**: Web Incubator Community Group (WICG)

## Categories

- **Type**: Other
- **Scope**: URL Fragments, Navigation, User Experience

## Benefits & Use Cases

### Key Benefits

1. **Direct Text Linking**: Share links that point to specific passages within long documents
2. **Improved Accessibility**: Help users quickly find relevant content without manual searching
3. **Enhanced Documentation**: Create precise references to specific sections in technical docs
4. **Search Integration**: Highlight search results directly in the source page
5. **Better Sharing**: Enable meaningful quote sharing with automatic highlighting

### Common Use Cases

- Highlighting search results in long documents
- Sharing specific text passages across web pages
- Creating precise references in technical documentation
- Improving accessibility for users with visual or cognitive disabilities
- Enabling search engines to highlight query matches on landing pages

## Browser Support

### Support Status Legend
- ✅ **Yes (y)**: Feature fully supported
- ⚠️ **Partial (d)**: Feature in development/experimental
- ❌ **No (n)**: Feature not supported

### Desktop Browsers

| Browser | Support Since | Current Status | Notes |
|---------|--------------|----------------|-------|
| **Chrome** | v81 | ✅ Full Support (v81+) | Experimental from v74-v80 |
| **Edge** | v83 | ✅ Full Support (v83+) | Experimental from v79-v81 |
| **Firefox** | v131 | ✅ Full Support (v131+) | Has open issues to resolve |
| **Safari** | v16.1 | ✅ Full Support (v16.1+) | Not supported before v16.0 |
| **Opera** | v68 | ✅ Full Support (v68+) | Experimental from v66-v67 |
| **Internet Explorer** | — | ❌ Not Supported | No support in any version |

### Mobile Browsers

| Browser | Support Since | Current Status |
|---------|--------------|----------------|
| **iOS Safari** | v16.1 | ✅ Full Support (v16.1+) |
| **Android Chrome** | v142 | ✅ Full Support (v142+) |
| **Android Firefox** | v144 | ✅ Full Support (v144+) |
| **Samsung Internet** | v13.0 | ✅ Full Support (v13.0+) |
| **Opera Mini** | — | ❌ Not Supported |
| **UC Browser** | — | ❌ Not Supported |
| **Android UC** | — | ❌ Not Supported |
| **Opera Mobile** | v80 | ✅ Full Support (v80+) |
| **Baidu** | v13.52 | ✅ Full Support (v13.52+) |

### Global Browser Support Coverage

- **Desktop Usage**: ~90.92% of users have browsers with support
- **Mobile Usage**: Varies by region and browser mix
- **Overall Coverage**: Excellent coverage in modern browser versions

## Syntax

### Basic Syntax

```
#:~:text=search text
```

### Advanced Syntax Examples

```
# Highlight specific text
https://example.com/article#:~:text=Hello world

# Match partial text
https://example.com/article#:~:text=Hello

# Context-aware matching (prefix, target, suffix)
https://example.com/article#:~:text=prefix,target,suffix

# URL-encoded special characters
https://example.com/article#:~:text=Text%20with%20spaces

# Multiple text fragments (separated by &)
https://example.com/article#:~:text=first%20phrase&text=second%20phrase
```

## Technical Details

### Fragment Syntax

The scroll-to-text fragment uses the `:~:` prefix to distinguish it from regular URL fragments. The syntax is:

```
:~:text=<string>[&text=<string>]*
```

### How It Works

1. Browser parses the `:~:text=` fragment
2. Text content is searched and matched on the page
3. Matching text is scrolled into view
4. Visual highlight is applied to the matched text
5. Browser provides visual feedback to the user

### Important Considerations

- Text matching is case-sensitive
- Whitespace and line breaks are considered
- Special characters may need URL encoding
- Multiple fragments can be specified with `&text=`
- If text is not found, the page loads normally without highlighting

## Security & Privacy Notes

### Privacy Concerns

The feature includes privacy protections:

- Fragments are only effective when the user explicitly navigates to the link
- Fragment information is **not sent to the server** (standard URL fragment behavior)
- Users can disable the feature if desired
- No automatic content sharing or analytics tracking

### Implementation Details

- Links must be user-initiated (cross-origin restrictions may apply)
- Content must be accessible and visible in the DOM
- Works with dynamically loaded content considerations
- Respects user preferences and accessibility settings

## Browser-Specific Notes

### Firefox

Firefox has basic support for this feature but maintains a number of open issues related to its implementation. Users should monitor the [Firefox bug tracker](https://bugzilla.mozilla.org/show_bug.cgi?id=1753933) for ongoing development.

### Safari

Support was added in Safari 16.1, making the feature available to most modern iOS and macOS users.

### Chrome & Edge

Both Chromium-based browsers have had full support since early 2020 (after an experimental phase), providing the most comprehensive implementation of the feature.

## Related Resources

### Articles & References

- [Jim Nielsen's Article: Why the `:~:` Syntax?](https://blog.jim-nielsen.com/2022/scroll-to-text-fragments/)

### Keywords

- URL Fragments
- Scroll To Text
- Text Fragments
- `#:~:text=`
- `textTarget`
- Web Navigation

## Implementation Tips

### Creating Links

Use a URL-encoded format for text containing special characters:

```html
<!-- Simple example -->
<a href="https://example.com#:~:text=important">
  Link to important text
</a>

<!-- With encoding -->
<a href="https://example.com#:~:text=Hello%20World">
  Link to "Hello World"
</a>
```

### Fallback Handling

Since not all browsers support this feature, consider:

1. Providing both fragment and traditional anchor links
2. Testing links in target browsers before sharing
3. Using feature detection in JavaScript if needed
4. Providing alternative navigation methods

### Best Practices

- Keep search text concise and unique
- Avoid matching very common phrases
- Use context (prefix/suffix) for disambiguation
- Test in target browsers before sharing
- Consider the permanence of content being linked

## Specification Status

- **Standardization**: Under development by WICG
- **Implementation Level**: Wide adoption in major browsers
- **Maturity**: Stable in implementations, some edge cases remain
- **Future**: Expected to become a W3C standard

## See Also

- [WICG Specification](https://wicg.github.io/ScrollToTextFragment/)
- [Can I Use: URL Scroll-To-Text Fragment](https://caniuse.com/url-scroll-to-text-fragment)
- [MDN Web Docs](https://developer.mozilla.org/)

---

*Last Updated: 2024*
*Based on CanIUse data*
*Status: Unofficial - Under WICG Development*
