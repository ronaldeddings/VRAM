# Document.execCommand()

## Overview

Document.execCommand() is a JavaScript API that allows developers to run commands to manipulate the contents of an editable region in a document that has been switched to `designMode`. This method is essential for building rich text editors and content editable applications where users can apply formatting such as bold, italic, underline, and other text transformations.

## Description

The `execCommand()` method executes a specified command on the currently selected text or element. When a document is in `designMode`, content becomes editable similar to a text editor, and execCommand() enables programmatic modification of that content through standard text formatting and editing commands.

This API provides a straightforward way to implement rich text editing capabilities without needing to manually manipulate the DOM. Commands can include text formatting (bold, italic, underline), list operations (ordered/unordered lists), text alignment, and many other editing operations.

## Specification Status

- **Current Status**: Unofficial/Non-standard
- **Specification URL**: https://w3c.github.io/editing/execCommand.html#execcommand()
- **Note**: While widely supported across browsers, the specification remains unofficial

## Categories

- JavaScript API

## Key Methods and Properties

### execCommand() Syntax

```javascript
document.execCommand(command, showUI, value)
```

- **command** (string): The command to execute (e.g., "bold", "italic", "insertHTML")
- **showUI** (boolean): Whether to display the browser's default UI for the command (optional, defaults to false)
- **value** (string): Additional value required by some commands (optional)

### Common Commands

#### Text Formatting
- `bold` - Make selected text bold
- `italic` - Make selected text italic
- `underline` - Underline selected text
- `strikeThrough` - Strike through selected text
- `superscript` - Make text superscript
- `subscript` - Make text subscript

#### Lists and Indentation
- `insertUnorderedList` - Create or remove an unordered list
- `insertOrderedList` - Create or remove an ordered list
- `indent` - Increase indentation
- `outdent` - Decrease indentation

#### Text Alignment
- `justifyLeft` - Align text left
- `justifyCenter` - Center align text
- `justifyRight` - Align text right
- `justifyFull` - Justify text

#### Content Operations
- `insertHTML` - Insert HTML at cursor position
- `insertText` - Insert plain text
- `delete` - Delete selected content
- `undo` - Undo last action
- `redo` - Redo last action
- `selectAll` - Select all content

### Related Methods

- **queryCommandSupported()**: Check if a command is supported by the browser
- **queryCommandEnabled()**: Check if a command is available for the current selection
- **queryCommandValue()**: Get the current value of a command

## Benefits and Use Cases

### Benefits

1. **Native Browser Support**: No need for external libraries for basic rich text editing
2. **Straightforward API**: Simple method calls for common formatting operations
3. **Wide Browser Compatibility**: Supported across all major browsers
4. **Content Editable**: Works with HTML5 contentEditable attribute and designMode
5. **No Dependencies**: Built into the DOM API, no additional libraries required
6. **Consistent UI**: Browser default UI option available for standard commands
7. **Undo/Redo Support**: Native undo and redo functionality integration

### Use Cases

- **Rich Text Editors**: Building WYSIWYG editors (WordPress, Medium-like editors)
- **Note-Taking Applications**: Web-based note apps with formatting support
- **Email Clients**: Web-based email composition with text formatting
- **Collaborative Documents**: Google Docs-like applications
- **Content Management Systems**: Inline content editing in CMS platforms
- **Document Editors**: Web-based word processors
- **Blog Platforms**: Publishing tools with formatting capabilities
- **Comments and Messaging**: Formatted text input in discussion applications
- **Educational Platforms**: Learning management systems with formatted content
- **Data Entry Forms**: Advanced forms requiring formatted text input

## Browser Support

| Browser | Minimum Version | Status | Notes |
|---------|-----------------|--------|-------|
| **Internet Explorer** | 5.5 | Supported | Full support from IE 5.5 onwards |
| **Edge** | 12 | Supported | All modern versions fully supported |
| **Firefox** | 9 | Supported | Versions 2-8: Not supported; Version 9+: Full support |
| **Chrome** | 4 | Supported | Full support since Chrome 4 |
| **Safari** | 6 | Supported | Versions 3.1-5.1: Partial support (u)<br>Version 6+: Full support |
| **Opera** | 10.0 | Supported | Versions 9-9.6: Partial support (u)<br>Version 10.0+: Full support |
| **iOS Safari** | 7.0 | Supported | Versions 3.2-6.1: Not supported or partial<br>Version 7.0+: Full support |
| **Android Browser** | 4.1 | Supported | Versions 2.1-4.0: Not supported<br>Version 4.1+: Full support |
| **Chrome for Android** | 142 | Supported | Full support |
| **Firefox for Android** | 144 | Supported | Full support |
| **Samsung Internet** | 4 | Supported | Full support |
| **UC Browser** | 15.5 | Supported | Full support |
| **Opera Mobile** | 10 | Supported | Full support |
| **Opera Mini** | All | Not Supported | No support for any version |
| **BlackBerry** | 10 | Supported | Full support |
| **IE Mobile** | 11 | Supported | IE Mobile 10: Not supported; Version 11: Full support |
| **Baidu Browser** | 13.52 | Supported | Full support |
| **KaiOS** | 2.5 | Supported | Full support |

### Global Support Statistics

- **Full Support**: 93.67% of global users
- **No Support**: Minimal (less than 0.1%)
- **Partial Support**: Negligible

## Usage Example

### Basic Rich Text Editor

```html
<!DOCTYPE html>
<html>
<head>
    <title>Simple Rich Text Editor</title>
</head>
<body>
    <div id="editor" contenteditable="true"
         style="border: 1px solid #ccc; padding: 10px; min-height: 200px;">
        Type or paste your content here...
    </div>

    <button onclick="makeBold()">Bold</button>
    <button onclick="makeItalic()">Italic</button>
    <button onclick="makeUnderline()">Underline</button>
    <button onclick="insertLink()">Insert Link</button>

    <script>
        function makeBold() {
            document.execCommand('bold', false, null);
        }

        function makeItalic() {
            document.execCommand('italic', false, null);
        }

        function makeUnderline() {
            document.execCommand('underline', false, null);
        }

        function insertLink() {
            const url = prompt('Enter the URL:');
            if (url) {
                document.execCommand('createLink', false, url);
            }
        }
    </script>
</body>
</html>
```

### Checking Command Support

```javascript
// Check if a command is supported
if (document.queryCommandSupported('bold')) {
    document.execCommand('bold', false, null);
}

// Check if a command is currently enabled
if (document.queryCommandEnabled('insertUnorderedList')) {
    document.execCommand('insertUnorderedList', false, null);
}

// Get the current value of a command
const fontSize = document.queryCommandValue('fontSize');
console.log('Current font size:', fontSize);
```

## Compatibility Notes

### Full Support Requirements

The execCommand() API has excellent support across modern browsers. Most browsers support the core functionality from very early versions:

- **IE**: Supported since version 5.5
- **Chrome**: Supported since version 4
- **Firefox**: Supported since version 9
- **Safari**: Supported since version 6
- **Opera**: Supported since version 10.0

### Partial Support (Legacy)

Some older browser versions show partial support (marked as "u"):
- Safari 3.1-5.1: Limited implementation
- Opera 9-9.6: Limited implementation
- iOS Safari 4.2-6.1: Partial or no support in early versions

### Command Consistency Notes

While the basic API is widely supported, individual command support may vary slightly between browsers. Use `queryCommandSupported()` to verify command availability before executing.

## Important Notes

- To determine which specific commands are supported in a browser, use `Document.queryCommandSupported()` to check before executing a command
- The `designMode` document attribute must be set to "on" for the full editing functionality
- Alternatively, elements can use the `contentEditable="true"` attribute for inline editing
- The showUI parameter shows browser-specific default UI and may not be fully supported across all browsers
- Modern alternatives to execCommand() are being developed (Content Editable API)
- Some commands may have different behavior across browsers

## Relevant Links

- [MDN Web Docs - Document.execCommand()](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand)
- [execCommand and queryCommandSupported Demo](https://codepen.io/netsi1964/pen/QbLLGW)
- [W3C Specification - execCommand](https://w3c.github.io/editing/execCommand.html#execcommand())

## Related APIs

- [contentEditable API](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Editable_content)
- [Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection)
- [Range API](https://developer.mozilla.org/en-US/docs/Web/API/Range)
