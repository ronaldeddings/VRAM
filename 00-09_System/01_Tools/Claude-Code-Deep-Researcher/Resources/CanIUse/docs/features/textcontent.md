# Node.textContent

## Overview

`Node.textContent` is a DOM property that represents the concatenated text content of a node and all of its descendants. It provides a way to get or set the plain text content of an element while automatically stripping all HTML markup.

## Description

The `textContent` property returns or sets the text content of a node. When getting the value, it concatenates the text content of all child nodes, ignoring any HTML tags. When setting the value, it replaces the entire content with plain text, effectively removing all child nodes and replacing them with a single text node.

**Specification Status:** Living Standard (LS)

**Specification URL:** [dom.spec.whatwg.org/#dom-node-textcontent](https://dom.spec.whatwg.org/#dom-node-textcontent)

## Categories

- **DOM** - Document Object Model

## Use Cases & Benefits

### Common Use Cases

1. **Extracting Text Content** - Get plain text from an element without HTML markup
   ```javascript
   const element = document.querySelector('#article');
   const text = element.textContent; // Returns only text, no HTML
   ```

2. **Setting Plain Text Content** - Safely set text without risk of HTML injection
   ```javascript
   element.textContent = 'Hello World'; // Safe alternative to innerHTML
   ```

3. **Text Manipulation** - Quickly strip HTML and work with raw text
   ```javascript
   const html = '<p>Hello <strong>World</strong></p>';
   const element = document.createElement('div');
   element.innerHTML = html;
   const plainText = element.textContent; // "Hello World"
   ```

4. **Dynamic Content Updates** - Update text content without affecting HTML structure
   ```javascript
   document.getElementById('status').textContent = 'Loading...';
   ```

5. **Accessibility** - Ensure text content is properly set for screen readers

### Key Benefits

- **Security** - Prevents HTML/XSS injection when setting content
- **Simplicity** - Simple API for plain text operations
- **Performance** - Faster than parsing HTML when only text is needed
- **Consistency** - Returns all text content regardless of HTML structure
- **Widespread Support** - Works across virtually all modern browsers

## Important Differences from `innerText`

The `textContent` property differs from `HTMLElement.innerText`:

| Aspect | textContent | innerText |
|--------|-------------|-----------|
| **Performance** | Faster | Slower (triggers reflow) |
| **Hidden Elements** | Returns text from hidden elements | Ignores hidden elements |
| **Script/Style Tags** | Includes their text content | Omits script/style content |
| **Whitespace** | Preserves all whitespace | Normalized whitespace |
| **Availability** | Node interface | HTMLElement interface only |

## Browser Support

### Support Legend

- **y** - Supported
- **n** - Not supported
- **u** - Unknown or partial support

### Desktop Browsers

| Browser | Minimum Version | Latest Versions |
|---------|-----------------|-----------------|
| **Chrome** | 4+ | 146+ |
| **Edge** | 12+ | 143+ |
| **Firefox** | 2+ | 148+ |
| **Safari** | 3.2+ | 18.5+ |
| **Opera** | 9.5-9.6+ | 122+ |
| **Internet Explorer** | 9+ | 11 |

### Mobile & Tablet Browsers

| Browser | Minimum Version | Latest Versions |
|---------|-----------------|-----------------|
| **iOS Safari** | 4.0-4.1+ | 26.1+ |
| **Android Chrome** | 2.3+ | 142+ |
| **Android Browser** | 2.3+ | 142+ |
| **Opera Mini** | All versions | All versions (✓) |
| **Samsung Internet** | 4+ | 29+ |
| **Opera Mobile** | 10+ | 80+ |

### Global Browser Usage Coverage

**93.69%** of worldwide browser usage supports `Node.textContent` (as of last data update)

## Detailed Support Table

### Legend
- Modern browsers (Chrome 4+, Firefox 2+, Safari 3.2+, Edge 12+) have full support
- Internet Explorer support starts from version 9
- Safari 3.1 shows unknown ("u") status; full support begins at 3.2
- Opera shows unknown ("u") status until version 9.5-9.6

### Notable Support Milestones

- **Firefox 2** - One of the earliest full implementations
- **Chrome 4** - Full support from very early versions
- **Internet Explorer 9** - First version with support (IE 5.5-8 not supported)
- **Safari 3.2** - Full support (3.1 was uncertain)
- **Opera 9.5** - Full support from this version onward

### Mobile Platform Status

- **iOS Safari 4.0+** - Full support
- **Android 2.3+** - Full support
- **Opera Mini** - Full support across all versions
- **Android UC Browser 15.5+** - Supported
- **Baidu Browser 13.52+** - Supported
- **KaiOS 2.5+** - Supported

## Usage Examples

### Reading Text Content

```javascript
// Get all text from an element
const element = document.getElementById('content');
const text = element.textContent;

// Works with nested elements
const html = '<div><p>Hello</p><p>World</p></div>';
const container = document.createElement('div');
container.innerHTML = html;
console.log(container.textContent); // "HelloWorld"
```

### Setting Text Content

```javascript
// Safe way to set text content
const button = document.querySelector('button');
button.textContent = 'Click Me'; // No HTML interpretation

// Clear an element's content
element.textContent = ''; // Removes all child nodes

// Set text with line breaks (using escaped newlines)
element.textContent = 'Line 1\nLine 2\nLine 3';
```

### Security Comparison

```javascript
// UNSAFE - Vulnerable to XSS
element.innerHTML = userInput; // Could execute scripts!

// SAFE - No HTML parsing
element.textContent = userInput; // Treats as plain text only
```

### Whitespace Handling

```javascript
const element = document.createElement('div');
element.innerHTML = '  <p>  Text with   spaces  </p>  ';

// textContent preserves all whitespace
console.log(element.textContent);
// Output: "  \n  Text with   spaces  \n  "

// Compare to innerText which normalizes it
console.log(element.innerText);
// Output: "Text with spaces"
```

## Browser Compatibility Notes

### Legacy Browser Considerations

- **IE 8 and earlier** - Not supported; use alternative approaches
- **Safari 3.1** - Support status was uncertain; use 3.2+ for guaranteed compatibility
- **Opera 9** - Uncertain support; Opera 9.5+ guarantees full support

### Modern Browser Coverage

All modern browsers released in the last 10+ years provide full support. For any production application supporting modern browsers, `textContent` is reliably available.

## Related Features

- [Node.innerText](https://caniuse.com/#feat=innertext) - Similar but HTMLElement-specific property
- [Node.innerHTML](https://caniuse.com/#feat=innerhtml) - For HTML content manipulation
- [Node.textContent vs innerText](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) - Detailed comparison

## Specification Details

- **Living Standard** - Part of the DOM Living Standard maintained by WHATWG
- **Last Update** - Continuously maintained as part of the DOM specification
- **Stability** - Stable feature with no pending changes
- **Browser Implementation** - Consistently implemented across all modern browsers

## Resources

### Official Documentation

- [MDN Web Docs - Node.textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)
- [WHATWG DOM Specification](https://dom.spec.whatwg.org/#dom-node-textcontent)

### Related Articles

- Performance comparison between textContent and innerHTML
- Security best practices for DOM manipulation
- Text content extraction patterns and techniques

## Notes

`Node.textContent` is a well-established, widely-supported DOM API that has been available since the early 2000s in modern browsers. It remains the recommended approach for reading and setting plain text content due to its performance characteristics and security benefits compared to working with raw HTML.

The main distinction to remember is that `textContent` includes content from all text nodes, including whitespace, while `innerText` respects CSS display properties and normalizes whitespace. For most use cases requiring plain text manipulation, `textContent` is the preferred choice.
