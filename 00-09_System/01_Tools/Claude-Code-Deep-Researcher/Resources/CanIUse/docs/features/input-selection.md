# Selection Controls for Input & Textarea

## Overview

This feature provides JavaScript APIs for controlling and reading text selection within `<input>` and `<textarea>` elements. Developers can programmatically set, get, and manipulate selected text ranges using standardized DOM methods and properties.

## Description

Controls for setting and getting text selection via the following APIs:
- `setSelectionRange()` - Method to select a range of text
- `selectionStart` - Property for getting/setting the start position of selection
- `selectionEnd` - Property for getting/setting the end position of selection

These APIs allow developers to:
- Highlight specific portions of user input
- Retrieve the currently selected text range
- Implement custom text selection behaviors
- Create enhanced text editor interfaces
- Build accessibility features that require text manipulation

## Specification Status

**Status:** Living Standard (ls)

**Specification URL:** [HTML Living Standard - Form Control Infrastructure](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#dom-textarea/input-setselectionrange)

## Categories

- HTML5
- JavaScript API

## Benefits & Use Cases

### User Interface Enhancements
- **Text Formatting Tools**: Build in-browser text editors with selection-aware formatting options
- **Search Highlighting**: Highlight and select search results within input fields
- **Auto-completion**: Automatically select suggested text completions
- **Text Validation Feedback**: Select problematic portions of user input to draw attention

### Accessibility Features
- **Screen Reader Support**: Provide programmatic text selection for assistive technologies
- **Keyboard Navigation**: Enable arrow-key based text selection and manipulation
- **Voice Input**: Programmatically select and replace spoken text portions

### Data Entry Optimization
- **Input Masking**: Select and replace specific input segments
- **Form Pre-population**: Select default values to encourage user replacement
- **Multi-field Navigation**: Automatically select text in the next field after submission

### Rich Text Features
- **Code Editors**: Implement syntax-aware selection and highlighting
- **Rich Text Editors**: Build custom formatting tools that require selection manipulation
- **Document Annotation**: Allow users to select and annotate specific text portions

## Browser Support

| Browser | Minimum Version | Support Status | Latest Support |
|---------|-----------------|----------------|-----------------|
| **Chrome** | 4+ | Full Support | 146+ |
| **Firefox** | 2+ | Full Support | 148+ |
| **Safari** | 4 | Full Support | 18.5-18.6+ |
| **Edge** | 12+ | Full Support | 143+ |
| **Opera** | 10.6+ | Full Support | 122+ |
| **IE** | 9+ | Full Support* | 11 |
| **iOS Safari** | 4.0+ | Full Support | 18.5-18.7+ |
| **Android Browser** | 2.1+ | Full Support | 142+ |
| **Opera Mini** | All | **Not Supported** | n/a |

### Support Notes

- **IE 5.5-8**: Not supported
- **Safari 3.1-3.2**: Unknown/Partial support (marked as "u")
- **Opera 9-10.5**: Unknown/Partial support (marked as "u")
- **iOS Safari 3.2**: Unknown/Partial support (marked as "u")
- **Opera Mini**: Completely unsupported across all versions

### Modern Browser Coverage
**93.65%** of global web traffic supports this feature according to caniuse data, making it safe to use without fallbacks in most modern web applications.

## API Reference

### setSelectionRange()

```javascript
inputElement.setSelectionRange(selectionStart, selectionEnd, [selectionDirection]);
```

**Parameters:**
- `selectionStart` (number): The index of the first selected character
- `selectionEnd` (number): The index of the character after the last selected character
- `selectionDirection` (string, optional): "forward", "backward", or "none"

**Example:**
```javascript
const input = document.getElementById('myInput');
input.value = 'Hello World';

// Select "World" (characters 6-11)
input.setSelectionRange(6, 11);
```

### selectionStart Property

```javascript
// Get the selection start position
const start = inputElement.selectionStart;

// Set the selection start position
inputElement.selectionStart = 5;
```

**Returns:** The index of the first selected character, or the position of the text cursor if nothing is selected.

### selectionEnd Property

```javascript
// Get the selection end position
const end = inputElement.selectionEnd;

// Set the selection end position
inputElement.selectionEnd = 10;
```

**Returns:** The index of the character after the last selected character.

## Practical Examples

### Example 1: Select All Text on Focus

```javascript
const input = document.getElementById('email');
input.addEventListener('focus', () => {
  input.setSelectionRange(0, input.value.length);
});
```

### Example 2: Highlight Search Results

```javascript
function highlightSearchMatch(input, searchTerm) {
  const text = input.value;
  const startIndex = text.indexOf(searchTerm);

  if (startIndex !== -1) {
    input.setSelectionRange(startIndex, startIndex + searchTerm.length);
    input.focus();
  }
}
```

### Example 3: Auto-Select Suggested Text

```javascript
function applySuggestion(input, suggestion) {
  input.value = suggestion;
  input.setSelectionRange(0, suggestion.length);
}
```

### Example 4: Get Current Selection

```javascript
const input = document.getElementById('textInput');
const selectedText = input.value.substring(
  input.selectionStart,
  input.selectionEnd
);

console.log('Selected text:', selectedText);
```

### Example 5: Replace Selected Text

```javascript
function replaceSelection(input, replacement) {
  const start = input.selectionStart;
  const end = input.selectionEnd;

  input.value =
    input.value.substring(0, start) +
    replacement +
    input.value.substring(end);

  // Move cursor after inserted text
  input.setSelectionRange(start + replacement.length, start + replacement.length);
}
```

## Compatibility Considerations

### Historical Note on IE Support

Internet Explorer 5.5 through version 8 did not support `setSelectionRange()`. However, IE provided equivalent functionality through:
- `TextRange` objects
- `createTextRange()` method
- `select()` and `collapse()` methods

If you need to support ancient IE versions, you would need to feature-detect and provide a fallback implementation.

### Mobile Considerations

- **Touch Devices**: Selection behavior may differ on mobile browsers due to touch-based text selection patterns
- **iOS Safari**: Full support since version 4
- **Android**: Full support since version 2.1
- **Opera Mini**: Not supported due to its proxy-based rendering model

## Browser-Specific Behaviors

### Firefox
- Full support since version 2
- Reliable and consistent implementation

### Webkit/Safari/Edge
- Full support across all modern versions
- Consistent with HTML specification

### Chrome/Chromium-based
- Full support since version 4
- Fully compatible with standard specification

## Notes

- No known bugs or issues in modern browsers
- This is a mature, well-established API with excellent cross-browser support
- Safe to use without polyfills or fallbacks for modern web applications
- Selection is cleared when the element loses focus on most browsers

## Additional Resources

### Official Documentation
- [MDN: HTMLInputElement.setSelectionRange()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setSelectionRange)

### Related APIs
- `HTMLTextAreaElement.setSelectionRange()` - Equivalent for textarea elements
- `HTMLInputElement.selectionStart` - Read/write selection start position
- `HTMLInputElement.selectionEnd` - Read/write selection end position
- `Document.getSelection()` - Get user's current text selection across entire document

### Specifications
- [WHATWG HTML Standard - Form Control Infrastructure](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html)
- [W3C HTML Standard](https://www.w3.org/TR/html/)

## Summary

The Selection Controls API is a stable, well-supported feature available across all modern browsers with nearly universal support (93.65% global coverage). It provides essential functionality for building advanced text input interfaces and should be considered safe for production use without fallbacks in modern web applications.
