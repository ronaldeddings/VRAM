# DOM Parsing and Serialization

## Overview

DOM Parsing and Serialization provides essential APIs for parsing and serializing DOM structures in modern web applications. This feature encompasses a suite of methods that allow developers to work with HTML and XML content dynamically.

## Description

Various DOM parsing and serializing functions, specifically:

- **DOMParser** - Parses HTML and XML strings into DOM trees
- **XMLSerializer** - Serializes DOM nodes back into XML/HTML strings
- **innerHTML** - Gets or sets HTML content of an element
- **outerHTML** - Gets or sets an element including its markup
- **insertAdjacentHTML** - Inserts HTML into a document at a specified position

## Specification Status

- **Status**: Candidate Recommendation (CR)
- **Specification**: [W3C DOM Parsing and Serialization](https://www.w3.org/TR/DOM-Parsing/)

## Categories

- DOM
- JS API

## Use Cases and Benefits

### Primary Use Cases

1. **Dynamic HTML Generation**
   - Creating and inserting HTML content at runtime
   - Template rendering and injection
   - Building dynamic user interfaces

2. **Data Serialization**
   - Converting DOM nodes to string representations
   - Exporting document structures
   - Transmitting DOM data over networks

3. **Content Parsing**
   - Converting HTML/XML strings to DOM objects
   - Server-side template rendering
   - Processing user-provided HTML content

4. **Element Manipulation**
   - Inserting HTML fragments adjacent to elements
   - Modifying complex HTML structures
   - Building rich text editors

### Key Benefits

- **Flexible Content Handling**: Work with both HTML and XML content
- **Performance**: Native APIs optimized by browser engines
- **Simplified DOM Operations**: Cleaner API than manual DOM node creation
- **String-based Integration**: Easy integration with server data and templates
- **Widely Supported**: Available across all modern browsers

## Browser Support

### Support Legend

| Symbol | Meaning |
|--------|---------|
| `y` | Fully supported |
| `a #n` | Partial support (see notes) |
| `u` | Unsupported |

### Desktop Browsers

#### Chrome
- **Versions 4-30**: Partial support (#1)
- **Versions 31+**: Full support

#### Firefox
- **Versions 2-7**: Partial support (#2)
- **Versions 8-10**: Partial support (#3)
- **Versions 11+**: Full support

#### Safari
- **Versions 3.1-7**: Partial support (#1)
- **Versions 7.1+**: Full support

#### Edge
- **Versions 12+**: Full support

#### Internet Explorer
- **Versions 5.5-9**: Partial support (#2)
- **Versions 10-11**: Full support

#### Opera
- **Versions 9-9.6**: Unsupported
- **Versions 10.0-17**: Partial support (#1)
- **Versions 18+**: Full support

### Mobile Browsers

#### iOS Safari
- **Versions 3.2-7.0-7.1**: Partial support (#1)
- **Versions 8+**: Full support

#### Android Browser
- **Versions 2.1-4.3**: Partial support (#1)
- **Versions 4.4+**: Full support

#### Android Chrome
- **Version 142+**: Full support

#### Android Firefox
- **Version 144+**: Full support

#### Samsung Internet
- **Versions 4+**: Full support

#### Opera Mobile
- **Versions 10-12.1**: Partial support (#1)
- **Version 80+**: Full support

#### Opera Mini
- **All versions**: Partial support (#1)

#### IE Mobile
- **Versions 10-11**: Full support

#### Other Mobile Browsers
- **UC Browser 15.5+**: Full support
- **Baidu 13.52+**: Full support
- **QQ Browser 14.9+**: Full support
- **KaiOS 2.5+**: Full support

## Support Coverage

| Support Type | Percentage |
|--------------|-----------|
| Full Support | 93.53% |
| Partial Support | 0.19% |
| **Total Coverage** | **93.72%** |

## Important Notes

### Partial Support Details

**Note #1**: Partial support refers to lacking support for `parseFromString` on the DOMParser.
- Affects early versions of Chrome, Safari, Opera, and mobile browsers
- Methods like `innerHTML`, `outerHTML`, and `insertAdjacentHTML` may be available
- `parseFromString` functionality is missing

**Note #2**: Partial support refers to supporting only `innerHTML`.
- Affects IE versions 5.5-9
- Other methods like `outerHTML`, `insertAdjacentHTML`, and `DOMParser` are not supported

**Note #3**: Partial support refers to supporting only `innerHTML` and `insertAdjacentHTML`.
- Affects Firefox versions 8-10
- `DOMParser` and `XMLSerializer` not fully supported

### Known Issues

1. **Internet Explorer 10-11 Bug**
   - When using `innerText`, `innerHTML`, or `outerHTML` on a `textarea` with a `placeholder` attribute, the returned HTML/text incorrectly includes the placeholder's value as the textarea's actual value
   - Reference: [Microsoft Edge Platform Issue #101525](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/101525/)

2. **Internet Explorer 9 and Below Limitations**
   - `innerHTML`, `insertAdjacentHTML`, and related methods aren't supported or are read-only on the following elements:
     - `col`, `colgroup`
     - `frameset`
     - `html`, `head`
     - `style`
     - `table`, `tbody`, `tfoot`, `thead`
     - `title`
     - `tr`

## Compatibility Recommendations

- **For Modern Applications**: All DOM parsing and serialization methods are safe to use across all modern browsers
- **For Legacy Support (IE9 and below)**: Provide polyfills or use fallback methods for affected elements
- **For Mobile**: Consider that older Android browsers (pre-4.4) have limited support; use feature detection

## References and Further Reading

- [MDN Web Docs - XMLSerializer](https://developer.mozilla.org/en-US/docs/XMLSerializer)
- [Comparing Document Position by John Resig](https://johnresig.com/blog/dom-insertadjacenthtml/)
- [W3C DOM Parsing and Serialization Specification](https://www.w3.org/TR/DOM-Parsing/)

## Related APIs

- [DOM API](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- [HTML Standard](https://html.spec.whatwg.org/)
- [XML Specification](https://www.w3.org/XML/)

---

**Last Updated**: December 2024
**Feature ID**: xml-serializer
**Data Source**: CanIUse
