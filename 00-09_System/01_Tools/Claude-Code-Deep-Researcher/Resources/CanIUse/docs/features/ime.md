# Input Method Editor API

## Overview

The **Input Method Editor (IME) API** provides scripted access to the Input Method Editor, enabling developers to programmatically interact with IME functionality. This is particularly valuable for East Asian language input, where users type Roman characters and select from suggested character combinations.

## Description

An Input Method Editor (IME) is a software component that allows users to input characters from languages that cannot be typed directly with a standard keyboard. This is especially common in East Asian languages such as Chinese, Japanese, and Korean (CJK), where the number of characters far exceeds the available keyboard keys.

The IME API enables web developers to:
- Access information about the active IME state
- Control composition state during text input
- Retrieve composition alternates and candidates
- Improve the input experience for multilingual users

## Specification Status

**Status:** Unofficial (unoff)
**W3C Specification:** [Input Method Editor API - W3C TR](https://www.w3.org/TR/ime-api/)

The IME API remains in unofficial status, meaning it has not reached full standardization across all browsers. This has resulted in limited and inconsistent adoption across browser vendors.

## Category

- **JavaScript API** - DOM and scripting interfaces for browser functionality

## Use Cases & Benefits

The IME API is particularly beneficial for:

### Primary Use Cases
- **East Asian Language Support** - Enhanced input experience for Chinese, Japanese, Korean users
- **Text Editors & Rich Content** - Web-based text editors that need fine-grained input control
- **Form Validation** - Real-time validation of IME composition states
- **Accessibility Tools** - Applications assisting users with language input

### Key Benefits
- **Better UX for CJK Input** - More responsive and intuitive composition handling
- **Programmatic Control** - Fine-grained control over composition state
- **Alternative Candidates** - Access to IME-generated character alternatives
- **Improved Compatibility** - Better support for diverse input methods across platforms

## Browser Support

| Browser | Support | Version | Notes |
|---------|---------|---------|-------|
| **Internet Explorer** | ✗ | No | No support |
| **IE 11** | ✓ | 11 | Prefix: `msGetInputContext()` |
| **Edge (Legacy)** | ✓ | 12-18 | Prefix: `msGetInputContext()` |
| **Edge (Chromium)** | ✗ | 79+ | Not supported |
| **Firefox** | ✗ | All versions | Not supported |
| **Chrome** | ✗ | All versions | Not supported |
| **Safari** | ✗ | All versions | Not supported |
| **Opera** | ✗ | All versions | Not supported |
| **IE Mobile** | ✓ | 11 | Prefix: `msGetInputContext()` |

### Support Summary
- **Supported Browsers:** Internet Explorer 11, Edge Legacy (12-18), IE Mobile 11
- **Global Usage:** 0.33% of users
- **Adoption:** Very limited, primarily legacy Microsoft browsers

## Implementation Notes

### Prefixed Implementation
Browsers with `#1` notation use a prefixed implementation with differences from the modern specification:

1. **Method Name:** Uses `msGetInputContext()` instead of the standard `inputMethodContext` attribute
2. **Alternative Candidates:** Includes support for `getCompositionAlternatives()` from an earlier specification version
3. **Editor API:** Partial support for Editor-related composition features

### Example Usage (Microsoft Browsers)

```javascript
// Check if IME API is available (Microsoft implementation)
if ('msGetInputContext' in window) {
  const inputContext = window.msGetInputContext();

  if (inputContext) {
    // Access composition state
    const compositionRange = inputContext.compositionStartOffset;

    // Get composition alternatives
    if ('getCompositionAlternatives' in inputContext) {
      const alternatives = inputContext.getCompositionAlternatives();
      // Use alternatives for candidate selection
    }
  }
}
```

## Compatibility Considerations

### Key Limitations
- **Limited Browser Support:** Only Internet Explorer 11 and Edge Legacy
- **Vendor Prefix Required:** Uses `ms` prefix indicating Microsoft proprietary implementation
- **Specification Stagnation:** Not progressing toward broader standardization
- **No Modern Browser Support:** Not available in Chrome, Firefox, Safari, or modern Edge

### Migration Strategies
If you need IME interaction in modern browsers:
1. **Composition Events:** Use standard `compositionstart`, `compositionupdate`, and `compositionend` events
2. **TextArea/Input Events:** Monitor `input` and `change` events for IME state
3. **Feature Detection:** Implement graceful degradation for browsers without IME API

## Related Links

- [Building Better Input Experience for East Asian Users with the IME API in IE11](https://web.archive.org/web/20140403042251/http://blogs.msdn.com/b/ie/archive/2014/03/31/building-better-input-experience-for-east-asian-users-with-the-ime-api-in-ie11.aspx) - MSDN Blog (archived)
- [W3C IME API Specification](https://www.w3.org/TR/ime-api/)

## Standards & Related APIs

### Related Web Standards
- **Composition Events** (`compositionstart`, `compositionupdate`, `compositionend`) - Standard way to handle IME input
- **Input Events API** - Standard input handling and validation
- **TextArea/Input Elements** - Native HTML form elements with IME support

### Browser APIs for Text Handling
- `InputEvent`
- `CompositionEvent`
- Selection API (`window.getSelection()`)
- Editing Context

## Notes

- The IME API represents an early attempt at standardizing IME interaction but lacks broad implementation
- Modern applications should rely on composition events and input events for cross-browser compatibility
- The API is primarily of historical interest and legacy application maintenance
- For contemporary East Asian user support, focus on proper IME composition event handling rather than this API

## Technical Details

**Chrome Platform ID:** 6366722080636928
**Keywords:** ime, cjk, input, internationalization, inputMethodContext, candidatewindow, composition
**Usage Percentage (Global):** 0.33% of tracked users

---

*Last Updated: 2025* | *Data Source: Can I Use Feature Database*
