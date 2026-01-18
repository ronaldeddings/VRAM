# Font unicode-range Subsetting

## Overview

The `unicode-range` CSS descriptor is used within `@font-face` rules to define which Unicode code points a particular font file is intended to support. This allows browsers to make intelligent decisions about when to download font resources, improving performance by avoiding unnecessary font downloads for characters that won't be used.

## Description

The `unicode-range` descriptor specifies the set of Unicode code points that may be supported by the font face for which it is declared. The descriptor accepts a comma-delimited list of Unicode range (`<urange>`) values. The union of these ranges serves as a hint for user agents when determining whether to download a font resource for a given text run.

This feature is particularly valuable for:
- **Multi-language support**: Loading only the character sets needed for specific languages
- **Performance optimization**: Reducing font file sizes by subsetting
- **Variable font optimization**: Splitting font variations across multiple files

## Specification Status

**Status**: Candidate Recommendation (CR)

**Specification**: [CSS Fonts Module Level 3 - unicode-range descriptor](https://w3c.github.io/csswg-drafts/css-fonts/#unicode-range-desc)

## Categories

- CSS3
- Fonts
- Performance
- Web Standards

## Benefits and Use Cases

### Performance Optimization
- **Reduces bandwidth**: Download only the font subsets actually needed for rendering
- **Faster page loads**: Avoids downloading unnecessary character glyphs
- **Conditional loading**: Browsers can skip font downloads when characters aren't present

### Multi-language Support
- **Language-specific fonts**: Use different fonts optimized for different languages
- **CJK optimization**: Load separate fonts for Chinese, Japanese, and Korean characters
- **Script-specific rendering**: Use script-appropriate fonts for different writing systems

### Development Flexibility
- **Modular font loading**: Split fonts into logical subsets
- **Fallback chains**: Specify fallback behavior for missing ranges
- **Variable font support**: Optimize loading of variable font axes

### Example Use Cases
```css
/* Latin characters only */
@font-face {
  font-family: 'MyFont';
  src: url('font-latin.woff2') format('woff2');
  unicode-range: U+0020-007E; /* ASCII printable characters */
}

/* Extended Latin */
@font-face {
  font-family: 'MyFont';
  src: url('font-latin-ext.woff2') format('woff2');
  unicode-range: U+0100-017F, U+0180-024F;
}

/* CJK characters */
@font-face {
  font-family: 'MyFont';
  src: url('font-cjk.woff2') format('woff2');
  unicode-range: U+4E00-9FFF; /* CJK Unified Ideographs */
}

/* Emoji and symbols */
@font-face {
  font-family: 'MyFont';
  src: url('font-emoji.woff2') format('woff2');
  unicode-range: U+1F600-1F64F; /* Emoticons */
}
```

## Browser Support

| Browser | Support Status | Version | Notes |
|---------|---|---------|-------|
| **Chrome** | Full | 36+ | |
| **Edge** | Full | 17+ | |
| **Firefox** | Full | 44+ | Earlier versions (36-43) had partial support marked with data flag |
| **Safari** | Full | 10+ | Earlier versions (3.1-9.1) had partial support |
| **Opera** | Full | 23+ | |
| **iOS Safari** | Full | 10+ | |
| **Android Browser** | Full | 142+ | Earlier versions had partial support |
| **Samsung Internet** | Full | 5.0+ | |
| **Opera Mini** | Not Supported | — | Does not support unicode-range |
| **Internet Explorer** | Partial | 9-11 | Case-sensitive: uppercase 'U+' required |
| **UC Browser** | Full | 15.5+ | |

### Support Legend
- **Full (y)**: Complete support for unicode-range descriptor
- **Partial (a)**: Browser supports the descriptor but may download unnecessary code ranges
- **Not Supported (n)**: Browser does not recognize unicode-range

### Partial Support Details

**Partial support** (indicated with "a") means the browser recognizes and respects the `unicode-range` descriptor, but may not optimize font downloads perfectly. Specifically, browsers with partial support may download font files even when the specified character ranges aren't needed. This was more common in older browser versions as font optimization logic improved over time.

See the [Google Sheets browser test matrix](https://docs.google.com/a/chromium.org/spreadsheets/d/18h-1gaosu4-KYxH8JUNL6ZDuOsOKmWfauoai3CS3hPY/edit?pli=1#gid=0) for detailed performance analysis.

## Browser Compatibility Notes

### Firefox
- **Firefox 36-43**: Partial support; the descriptor was ignored and font-face rules applied to the entire range of code points
- **Firefox 44+**: Full support implemented
- **Flag**: Can be enabled in Firefox 36-43 using `layout.css.unicode-range.enabled` preference

### Internet Explorer
- **IE 9-11**: Partial support with a critical caveat
- **Case sensitivity**: IE ignores the `unicode-range` descriptor if 'U' is lowercase (e.g., `u+0061` fails, but `U+0061` works)
- **Uppercase required**: Always use uppercase `U+` prefix for IE compatibility

### Safari & iOS Safari
- **Safari 3.1-9.1**: Partial support
- **Safari 10+**: Full support with proper font download optimization
- **iOS Safari 10+**: Full support

### Older Android Browsers
- **Android 2.1-4.4.4**: Partial support
- **Android 142+**: Full support with modern optimization

## Usage Statistics

- **Full Support (y)**: 93.15% of tracked browsers
- **Partial Support (a)**: 0.4% of tracked browsers
- **Not Supported (n)**: Remaining percentage

## Syntax and Syntax Examples

### Basic Syntax
```css
@font-face {
  font-family: 'FontName';
  src: url('font-file.woff2') format('woff2');
  unicode-range: U+[START]-[END], U+[SPECIFIC];
}
```

### Unicode Range Formats

**Single Code Point**:
```css
unicode-range: U+26;     /* Ampersand character */
```

**Range of Code Points**:
```css
unicode-range: U+0-7F;   /* ASCII characters */
unicode-range: U+0025-00FF;  /* Latin + Extended Latin */
```

**Wildcard Ranges**:
```css
unicode-range: U+4??;    /* U+400 to U+4FF */
unicode-range: U+0-10FFFF;  /* All valid Unicode */
```

**Multiple Ranges** (comma-separated):
```css
unicode-range: U+0025-00FF, U+0131, U+0152-0153, U+0160-0161;
```

### Complete Example with Multiple Subsets

```css
/* Define font family with multiple subsets */

/* Latin subset - Basic Latin + Latin-1 Supplement */
@font-face {
  font-family: 'Noto Sans';
  font-style: normal;
  font-weight: 400;
  src: url('/fonts/NotoSans-Regular-Latin.woff2') format('woff2');
  unicode-range: U+0000-00FF;
}

/* Latin Extended-A */
@font-face {
  font-family: 'Noto Sans';
  font-style: normal;
  font-weight: 400;
  src: url('/fonts/NotoSans-Regular-LatinExt.woff2') format('woff2');
  unicode-range: U+0100-017F;
}

/* Cyrillic */
@font-face {
  font-family: 'Noto Sans';
  font-style: normal;
  font-weight: 400;
  src: url('/fonts/NotoSans-Regular-Cyrillic.woff2') format('woff2');
  unicode-range: U+0400-045F, U+0490-0491;
}

/* Greek */
@font-face {
  font-family: 'Noto Sans';
  font-style: normal;
  font-weight: 400;
  src: url('/fonts/NotoSans-Regular-Greek.woff2') format('woff2');
  unicode-range: U+0370-03FF;
}

/* CJK Unified Ideographs */
@font-face {
  font-family: 'Noto Sans CJK JP';
  font-style: normal;
  font-weight: 400;
  src: url('/fonts/NotoSansCJKjp-Regular.woff2') format('woff2');
  unicode-range: U+4E00-9FFF, U+3040-309F, U+30A0-30FF;
}

body {
  font-family: 'Noto Sans', 'Noto Sans CJK JP', sans-serif;
}
```

## Important Notes and Best Practices

### Best Practices

1. **Use Uppercase 'U+'**: Always use uppercase `U+` prefix for maximum compatibility
   ```css
   /* Good */
   unicode-range: U+0020-007E;

   /* Avoid for IE compatibility */
   unicode-range: u+0020-007e;
   ```

2. **Order Multiple Ranges Logically**: Group related character sets together for readability
   ```css
   unicode-range: U+0020-007E,      /* ASCII */
                  U+0080-00FF,      /* Latin-1 Supplement */
                  U+0100-017F;      /* Latin Extended-A */
   ```

3. **Test Browser Behavior**: Test font loading to ensure expected subsets are downloaded
   ```javascript
   // Monitor font loading with Font Loading API
   document.fonts.ready.then(() => {
     console.log('All fonts loaded');
   });
   ```

4. **Use with Font Loading API**: Enhance control over font loading behavior
   ```javascript
   const fontFace = new FontFace('MyFont', 'url(/font.woff2)', {
     unicodeRange: 'U+0020-007E'
   });
   document.fonts.add(fontFace);
   fontFace.load();
   ```

### Performance Considerations

- **Partial Support Impact**: Browsers with partial support may download the entire font even when only a subset is needed
- **Font Subsetting Tools**: Use tools like [google-webfonts-helper](https://google-webfonts-helper.herokuapp.com/fonts) or [fonttools](https://github.com/fonttools/fonttools) to create properly subsetted font files
- **Fallback Chains**: Provide sensible fallback fonts for older browsers that don't recognize `unicode-range`

### Debugging

Enable browser DevTools:
1. **Network Tab**: Monitor which font files are downloaded
2. **Coverage**: Use DevTools Coverage tab to see which character ranges are actually used
3. **Console**: Check for font loading errors or warnings

## Related Resources

- [MDN Web Docs - CSS unicode-range](https://developer.mozilla.org/en-US/docs/Web/CSS/unicode-range)
- [Safari CSS Reference: unicode-range](https://developer.apple.com/library/safari/documentation/AppleApplications/Reference/SafariCSSRef/Articles/StandardCSSProperties.html#//apple_ref/css/property/unicode-range)
- [Web Platform Docs: unicode-range](https://webplatform.github.io/docs/css/properties/unicode-range)
- [W3C CSS Fonts Module Level 3](https://w3c.github.io/csswg-drafts/css-fonts/)
- [Demo](https://jsbin.com/jeqoguzeye/1/edit?html,output)

## See Also

- [CSS @font-face rule](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face)
- [Font Loading API](https://developer.mozilla.org/en-US/docs/Web/API/FontFace)
- [Web Fonts Best Practices](https://web.dev/font-best-practices/)
- [Variable Fonts](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings)

---

**Last Updated**: 2025-12-13
**Data Source**: CanIUse Feature Database
**Status**: Candidate Recommendation (CR)
