# CSS Resize Property

## Overview

The CSS `resize` property allows developers to enable or disable the ability for users to resize an element. This property provides control over resizing behavior with options to limit the resizing direction (both directions, horizontal only, vertical only, or disabled).

## Description

The `resize` property is a method of allowing an element to be resized by the user, with options to limit to a given direction. This is particularly useful for controlling user interaction with textarea elements and other resizable content areas.

## Specification

- **W3C Status**: Recommendation (REC)
- **Specification URL**: https://www.w3.org/TR/css3-ui/#resize
- **Module**: CSS3 User Interface

## Categories

- CSS3

## Use Cases & Benefits

### Primary Use Cases

1. **Textarea Control**: Manage how users can resize form textarea elements
   - Allow full resizing for better UX
   - Restrict to vertical only to prevent layout breaking
   - Disable resizing for fixed-size form fields

2. **Layout Preservation**: Prevent elements from being accidentally resized and breaking page layout
   - Maintain consistent design dimensions
   - Avoid disrupting responsive layouts

3. **Content Areas**: Enable resizing for dynamic content containers
   - Code editors and IDE-like interfaces
   - Draggable panels and sections
   - Collapsible content areas

### Key Benefits

- **Enhanced User Experience**: Users can adjust elements to their preference when needed
- **Layout Control**: Developers can prevent unintended resizing that breaks designs
- **Accessibility**: Allows users with specific needs to resize content for better readability
- **Flexibility**: Fine-grained control over which directions elements can be resized

## CSS Property Values

```css
resize: auto | both | horizontal | vertical | none | initial | inherit
```

- **auto**: Default value; browser determines resize behavior
- **both**: Element can be resized in both horizontal and vertical directions
- **horizontal**: Element can be resized only horizontally
- **vertical**: Element can be resized only vertically
- **none**: Element cannot be resized by the user

## Browser Support

### Support Legend

- ✅ **Full Support** (y): Feature is fully supported
- ⚠️ **Partial Support** (a): Feature has limited or partial support
- ❌ **No Support** (n): Feature is not supported
- **x**: Prefix required or partial implementation

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | 4+ | ✅ Full | All versions 4 and later |
| **Firefox** | 4+ | ✅ Full | From version 4 (with prefix), version 5+ native |
| **Safari** | 4+ | ✅ Full | All versions 4 and later |
| **Edge (Chromium)** | 79+ | ✅ Full | All versions 79 and later |
| **Opera** | 15+ | ✅ Full | From version 15 (based on Chromium) |
| **Internet Explorer** | ❌ Never | ❌ Not Supported | IE 5.5-11 do not support |

### Mobile Browsers

| Platform | Browser | Support | Notes |
|----------|---------|---------|-------|
| **iOS** | Safari | ❌ Not Supported | All iOS Safari versions lack support |
| **Android** | Chrome | ✅ Full | Android Chrome 142+ fully supported |
| **Android** | Firefox | ✅ Full | Android Firefox 144+ fully supported |
| **Android** | Default Browser | ❌ Limited | Android 2.1-4.4 not supported; 4.4+ via Chrome |
| **Samsung** | Samsung Internet | ✅ Full | Version 5.0+ fully supported |
| **Opera Mobile** | Opera Mobile | ✅ Full | From version 80+ |
| **Opera Mini** | Opera Mini | ❌ Not Supported | All versions lack support |

### Other Browsers

| Browser | Status |
|---------|--------|
| UC Browser (Android) | ✅ Supported (15.5+) |
| QQ Browser (Android) | ✅ Supported (14.9+) |
| Baidu Browser | ✅ Supported (13.52+) |
| KaiOS | ✅ Supported (3.0+) |
| BlackBerry | ❌ Not Supported |

## Implementation Examples

### Basic Usage

```css
/* Allow users to resize textarea */
textarea {
  resize: both;
}

/* Disable resizing */
textarea {
  resize: none;
}

/* Allow only vertical resizing */
textarea {
  resize: vertical;
}

/* Allow only horizontal resizing */
textarea {
  resize: horizontal;
}
```

### Practical Example

```html
<style>
  .expandable-content {
    resize: both;
    border: 1px solid #ccc;
    padding: 10px;
    overflow: auto;
  }

  .fixed-textarea {
    resize: none;
    width: 100%;
    height: 200px;
  }

  .vertical-only {
    resize: vertical;
    min-height: 100px;
  }
</style>

<textarea class="fixed-textarea" placeholder="This cannot be resized"></textarea>
<textarea class="vertical-only" placeholder="This can only be resized vertically"></textarea>
<div class="expandable-content">
  This content area can be resized in both directions
</div>
```

## Important Notes

### UX Considerations

- **Avoid Disabling on Textareas**: Disabling resize on textarea elements (`resize: none`) can negatively impact user experience. Users often need to resize textareas to see their content better.
- **Prefer User Control**: Generally, it's recommended to allow users to resize textareas and other content areas unless there's a specific layout reason to prevent it.
- **Mobile Limitations**: iOS Safari does not support the resize property, limiting its use on iPhone and iPad devices.

### Browser Compatibility

- **Desktop**: Excellent support across all modern browsers (Chrome, Firefox, Safari, Edge, Opera)
- **Mobile**: Variable support - Android browsers support it well, but iOS Safari does not
- **Legacy**: Internet Explorer does not support this feature at all

### Partial Support Note

- **Opera 12.1**: Presto-based Opera 12.10+ currently only supports the resize property for textarea elements

## Global Support Statistics

- **Full Support (y)**: 83.93% of users globally
- **Partial Support (a)**: 0%
- **No Support (n)**: 16.07% of users globally

## Related Links

- [CSS Tricks - Resize Property](https://css-tricks.com/almanac/properties/r/resize/)
- [David Walsh - Textarea Resizing](https://davidwalsh.name/textarea-resize)
- [Catalin Red - Why CSS resize:none is Bad for UX](https://catalin.red/css-resize-none-is-bad-for-ux/)
- [MDN - CSS Resize Property](https://developer.mozilla.org/en-US/docs/Web/CSS/resize)

## Fallback Strategies

For applications requiring consistent resizing behavior across all browsers:

1. **JavaScript Alternative**: Implement custom resizing with JavaScript for unsupported browsers
2. **Feature Detection**: Use feature detection libraries to apply alternative styling
3. **Graceful Degradation**: Default to standard browser behavior when CSS resize is not available

## Summary

The CSS `resize` property is well-supported across modern browsers, with approximately 84% global support. It provides an effective way to control element resizing behavior, particularly for form elements like textareas. However, iOS Safari's lack of support should be considered for mobile-first applications. When implementing this feature, prioritize user experience by allowing resizing when appropriate, and use JavaScript fallbacks for unsupported environments if necessary.
