# CSS caret-color

## Description

The `caret-color` CSS property allows developers to set the color of the caret (text insertion pointer/cursor) in editable text areas such as `<input>`, `<textarea>`, or elements with the `contenteditable` attribute. This property enables customization of the blinking text cursor to match custom design systems and improve visual hierarchy in forms and content editing interfaces.

## Specification

- **Status**: Recommendation (REC)
- **Specification**: [CSS UI Module Level 3 - caret-color](https://www.w3.org/TR/css-ui-3/#caret-color)

## Categories

- CSS

## Benefits and Use Cases

### Visual Design Integration
Customize the caret color to match your application's design system, ensuring consistency between form elements and the overall visual theme.

### Improved Form Accessibility
Increase caret visibility by choosing colors with better contrast against input backgrounds, especially beneficial for users with low vision.

### Brand Customization
Align the text cursor color with brand guidelines and custom color schemes for a cohesive user interface.

### Enhanced User Experience
Make the caret more visible or less distracting depending on the context by selecting appropriate colors for different input scenarios.

### Themed Interfaces
Support dark mode and light mode interfaces by dynamically adjusting caret color to match theme variables.

## Browser Support

| Browser | First Full Support | Status |
|---------|-------------------|--------|
| Chrome | 57 | Full Support |
| Edge | 79 | Full Support |
| Firefox | 53 | Full Support |
| Opera | 44 | Full Support |
| Safari | 11.1 | Full Support |
| iOS Safari | 11.3+ | Full Support |
| Android Chrome | 142 | Full Support |
| Android Firefox | 144 | Full Support |

### Overall Support Coverage

- **Global Usage**: 92.75% of users worldwide
- **Supported**: Modern browsers (Chrome 57+, Firefox 53+, Safari 11.1+, Edge 79+)
- **Not Supported**: Internet Explorer (all versions), Opera Mini, older mobile browsers

### Legacy Browser Support

- **Internet Explorer**: No support (versions 5.5-11)
- **Opera (pre-44)**: No support
- **Safari (pre-11.1)**: No support
- **Android (pre-4.4.3)**: No support

## Implementation

### Basic Usage

```css
/* Set caret color to red */
input {
  caret-color: red;
}

/* Use hex color */
textarea {
  caret-color: #ff0000;
}

/* Use RGB color */
.custom-input {
  caret-color: rgb(255, 0, 0);
}

/* Inherit caret color from text color */
input {
  color: blue;
  caret-color: currentColor; /* Will be blue */
}

/* Use CSS variables for theming */
:root {
  --caret-color: #3498db;
}

input {
  caret-color: var(--caret-color);
}
```

### Dark Mode Support

```css
/* Light mode */
input {
  background-color: white;
  color: black;
  caret-color: black;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  input {
    background-color: #1e1e1e;
    color: white;
    caret-color: white;
  }
}
```

### Form Styling Example

```css
.form-group input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  caret-color: #3498db;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
  caret-color: #2980b9;
}

.form-group input[type="search"] {
  caret-color: #e74c3c;
}

.form-group textarea {
  caret-color: #27ae60;
}
```

## Browser Compatibility Table (Detailed)

### Desktop Browsers

| Version | Chrome | Firefox | Safari | Edge | Opera |
|---------|--------|---------|--------|------|-------|
| Latest | ✓ | ✓ | ✓ | ✓ | ✓ |
| -2 Versions | ✓ | ✓ | ✓ | ✓ | ✓ |
| -5 Versions | ✓ | ✓ | ✓ | ✓ | ✓ |
| -10 Versions | ✓ | ✓ | ✓ | ✓ | ✓ |

### Mobile Browsers

| Platform | Browser | First Supported |
|----------|---------|-----------------|
| iOS | Safari 11.3+ | ✓ |
| iOS | Safari 12.0+ | ✓ |
| Android | Chrome 142+ | ✓ |
| Android | Firefox 144+ | ✓ |
| Android | Opera 80+ | ✓ |
| Samsung | Internet 7.2+ | ✓ |

### Not Supported

- Internet Explorer (all versions)
- Opera Mini (all versions)
- Older Android versions (< 4.4)
- Legacy iOS Safari (< 11.3)

## Known Issues and Limitations

### Platform Inconsistencies

Some browsers may render the caret slightly differently:
- Caret width may vary between browsers
- Animation behavior (blinking) timing may differ
- Color rendering might have slight variations based on system settings

### Fallback Behavior

In older browsers that don't support `caret-color`, the caret will render in the default color (typically matching text color or system settings). This is not a breaking change—the interface remains fully functional.

### WebKit/Safari Considerations

- See [WebKit Bug #166572](https://bugs.webkit.org/show_bug.cgi?id=166572) for any platform-specific issues
- Safari on macOS and iOS fully supports the property

## Related Features

### CSS Properties

- [`color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color) - Text color
- [`background-color`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color) - Background color for contrast
- [`outline`](https://developer.mozilla.org/en-US/docs/Web/CSS/outline) - Focus outline style
- [`border`](https://developer.mozilla.org/en-US/docs/Web/CSS/border) - Input border styling

### HTML Elements

- `<input>` - Text input fields
- `<textarea>` - Multi-line text input
- `contenteditable` - Editable content areas
- `<select>` - Selection dropdown (may not show caret)

### Related CSS Features

- [`::placeholder`](https://developer.mozilla.org/en-US/docs/Web/CSS/::placeholder) - Placeholder text styling
- [`::selection`](https://developer.mozilla.org/en-US/docs/Web/CSS/::selection) - Selection color
- [`accent-color`](https://developer.mozilla.org/en-US/docs/Web/CSS/accent-color) - Interactive form controls color
- `@media (prefers-color-scheme)` - Dark mode detection

## Resources and References

### Official Documentation
- [W3C CSS UI Specification](https://www.w3.org/TR/css-ui-3/#caret-color)
- [MDN Web Docs - caret-color](https://developer.mozilla.org/en-US/docs/Web/CSS/caret-color)

### Issue Tracking
- [WebKit Support Bug](https://bugs.webkit.org/show_bug.cgi?id=166572)

### Related Articles
- [Customizing Form Elements with CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Forms)
- [Form Styling Best Practices](https://www.w3.org/WAI/tutorials/forms/styling/)
- [Accessible Form Design](https://www.accessibility-developer-guide.com/knowledge/forms/)

## Test Your Browser Support

You can test `caret-color` support in your browser using the following test:

```html
<style>
  .test-input {
    caret-color: red;
  }
</style>

<input class="test-input" type="text" placeholder="If the cursor is red, your browser supports caret-color" />
```

## Summary

The `caret-color` property is well-supported across modern browsers (92.75% global usage), making it safe to use in production applications targeting contemporary users. It provides a simple but effective way to customize the visual appearance of text input cursors, enhancing both aesthetics and user experience in form-heavy applications.

For applications needing to support older browsers, the property degrades gracefully—users will simply see the default caret color without breaking functionality.
