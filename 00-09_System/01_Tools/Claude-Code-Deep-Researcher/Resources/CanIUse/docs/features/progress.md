# HTML Progress Element

## Overview

The HTML `<progress>` element provides a native, semantic way to indicate the progress of a task, such as file downloads, form submissions, or any long-running operation.

## Description

The `<progress>` element represents the progress of a task. It allows developers to display a visual progress bar in the browser without needing custom JavaScript or third-party libraries. The element is part of the HTML5 specification and provides a standardized, accessible way to communicate task progress to users.

## Specification Status

**Status:** Living Standard (LS)
**Spec URL:** [HTML Living Standard - Progress Element](https://html.spec.whatwg.org/multipage/forms.html#the-progress-element)

## Categories

- HTML5

## Use Cases & Benefits

### Primary Benefits
- **Semantic HTML**: Provides meaningful markup that clearly conveys intent
- **Accessibility**: Built-in ARIA semantics for screen readers and assistive technologies
- **Native Styling**: Default browser styling provides immediate visual feedback
- **User Experience**: Clear indication of task progress improves perceived responsiveness
- **No Dependencies**: No external libraries or complex JavaScript required
- **Cross-Browser Support**: Widely supported across modern browsers

### Ideal Use Cases
- File uploads and downloads
- Form processing and data submissions
- Long-running API requests
- Data processing operations
- Installation or setup wizards
- Video/audio buffering indicators
- Loading screens and progress tracking

## Basic Usage

```html
<!-- Simple progress bar (0-100%) -->
<progress value="70" max="100"></progress>

<!-- File upload example -->
<progress value="45" max="100" aria-label="File upload progress"></progress>

<!-- Indeterminate progress (no specific value) -->
<progress aria-label="Loading..."></progress>
```

### Attributes
- `value` - Current progress (0 to max)
- `max` - Maximum value (default: 1.0)
- `aria-label` - Accessibility label

## Browser Support

| Browser | First Support | Notes |
|---------|---------------|-------|
| **Chrome** | v8+ | Full support across all versions |
| **Edge** | v12+ | Full support across all versions |
| **Firefox** | v6+ | Full support since Firefox 6 |
| **Safari** | v6+ | Full support since Safari 6 |
| **Opera** | v11+ | Full support since Opera 11 |
| **Internet Explorer** | v10+ | Supported from IE 10 onwards |
| **iOS Safari** | v8+ | Partial support in v7.0-7.1 (marked as "a") |
| **Android** | v4.4+ | Full support from Android 4.4 |
| **Samsung Internet** | v4+ | Full support across all versions |
| **Opera Mini** | All versions | Full support |

### Legacy/Limited Support
- **iOS Safari 7.0-7.1**: Partial support (#1) - does not support indeterminate progress elements
- **Internet Explorer 5.5-9**: Not supported
- **Older Android (2.1-4.3)**: Not supported
- **Chrome 4-7**: Not supported
- **Firefox 2-5**: Not supported

## Global Coverage

**Global Usage**: 93.62% of users have browsers that support the progress element

This exceptional coverage makes `<progress>` a safe choice for modern web applications targeting current user bases.

## Important Notes

### Known Limitations
1. **iOS Safari 7.0-7.1** - Does not support indeterminate `<progress>` elements. If you need to show progress without a specific value, use JavaScript-based alternatives or provide fallback styling for affected versions.

### CSS Styling

The `<progress>` element can be styled with CSS, though cross-browser consistency can be challenging:

```css
progress {
  width: 100%;
  height: 20px;
}

progress::-webkit-progress-bar {
  background-color: #f3f3f3;
  border-radius: 5px;
}

progress::-webkit-progress-value {
  background-color: #4CAF50;
  border-radius: 5px;
}

progress::-moz-progress-bar {
  background-color: #4CAF50;
  border-radius: 5px;
}
```

### Accessibility Considerations

- Always provide meaningful context or label for the progress bar
- Use `aria-label` or `aria-labelledby` for additional context
- Include descriptive text nearby to explain what is being loaded
- Consider providing percentage text for better clarity

## Comparison with Alternatives

### Progress vs. Meter Element
The `<progress>` element is often confused with the `<meter>` element:
- **`<progress>`** - Shows task progress from start to completion (0 to max)
- **`<meter>`** - Shows a measurement within a range (e.g., temperature, disk usage)

### Progress vs. Custom Solutions
- **Advantages**: Native, accessible, performant, no dependencies
- **Disadvantages**: Limited styling customization compared to custom solutions

## Related Resources

- [MDN Web Docs - HTML Progress Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress)
- [CSS-Tricks: HTML5 Progress Element](https://css-tricks.com/html5-progress-element/)
- [Dev.Opera: New Form Features in HTML5](https://dev.opera.com/articles/new-form-features-in-html5/#newoutput)
- [Progress and Meter Element Examples](https://peter.sh/examples/?/html/meter-progress.html)
- [Can I Use - Progress Element](https://caniuse.com/progress)

## Implementation Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Progress Element Example</title>
    <style>
        .progress-container {
            margin: 20px 0;
        }

        progress {
            width: 100%;
            height: 20px;
        }
    </style>
</head>
<body>
    <h1>File Upload Progress</h1>

    <div class="progress-container">
        <label for="upload-progress">Upload Progress:</label>
        <progress id="upload-progress" value="65" max="100"></progress>
        <span>65%</span>
    </div>

    <script>
        // Simulate progress update
        let value = 65;
        const progress = document.getElementById('upload-progress');

        const interval = setInterval(() => {
            value += Math.random() * 10;
            if (value >= 100) {
                value = 100;
                clearInterval(interval);
            }
            progress.value = value;
        }, 500);
    </script>
</body>
</html>
```

## Summary

The HTML `<progress>` element is a reliable, well-supported, and accessible way to display task progress in web applications. With 93.62% global browser support and native implementations across all major browsers since the mid-2010s, it's the recommended choice for progress indication in modern web development. For applications requiring compatibility with Internet Explorer 9 or older mobile browsers, fallback solutions should be implemented.
