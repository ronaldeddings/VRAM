# XHTML+SMIL Animation

## Overview

XHTML+SMIL animation is a method of using SMIL (Synchronized Multimedia Integration Language) animation in web pages. It represents an extension of XHTML with SMIL capabilities for creating synchronized, interactive multimedia presentations.

## Description

SMIL (Synchronized Multimedia Integration Language) is an XML-based language developed by the W3C for describing multimedia presentations. XHTML+SMIL combines XHTML markup with SMIL animation capabilities, allowing developers to create rich, animated content through XML-based declarative syntax rather than imperative scripting.

This standard was designed to provide a more structured approach to multimedia animation on the web, particularly for scenarios requiring synchronized animation of multiple elements and complex timing sequences.

## Specification Status

**Status:** Unofficial/Unmaintained
**W3C Specification:** [XHTML+SMIL Specification](https://www.w3.org/TR/XHTMLplusSMIL/)

The XHTML+SMIL specification has largely been superseded by more modern animation and multimedia technologies like CSS animations, CSS transitions, and SVG animations, which are more widely supported and actively maintained.

## Categories

- Other

## Use Cases & Benefits

While XHTML+SMIL is largely historical, it was originally designed for:

- **Synchronized Multimedia Presentations:** Creating presentations where multiple media elements animate in coordinated sequences
- **Declarative Animation:** Defining animations through XML markup rather than JavaScript
- **Interactive Content:** Building interactive multimedia experiences with timing and synchronization controls
- **Rich Media Authoring:** Authoring complex animated sequences without extensive scripting

**Modern Alternatives:**
- CSS Animations and Transitions (recommended)
- SVG Animations
- Web Animations API
- JavaScript animation libraries

## Browser Support

The following table shows support status across major browsers. Support indicators:
- **✅ Supported** (y): Full support
- **⚠️ Partial** (p): Partial or limited support
- **❌ Not Supported** (n): No support
- **⚠️ Alternate** (a): Alternate implementation

### Desktop Browsers

| Browser | Version Range | Status | Notes |
|---------|---|---|---|
| **Internet Explorer** | 5.5 | Not Supported | No support in IE 5.5 |
| | 6-8 | Partial/Alternate | Partial or alternate implementation (HTML+TIME) |
| | 9-11 | Not Supported | No support |
| **Edge** | 12-18 | Not Supported | No support in early versions |
| | 79+ | Partial | Limited partial support in modern versions |
| **Firefox** | 2.0+ | Partial | Partial support across all versions |
| **Chrome** | 4+ | Partial | Partial support across all versions |
| **Safari** | 3.1+ | Partial | Partial support across all versions |
| **Opera** | 9.0+ | Partial | Partial support across all versions |

### Mobile Browsers

| Browser | Version Range | Status |
|---------|---|---|
| **iOS Safari** | 3.2+ | Partial |
| **Android Browser** | 2.1+ | Partial |
| **Opera Mobile** | 10+ | Partial |
| **Opera Mini** | All versions | Partial |
| **IE Mobile** | 10-11 | Not Supported |
| **Samsung Internet** | 4+ | Partial |
| **Chrome Android** | 142+ | Partial |
| **Firefox Android** | 144+ | Partial |
| **UC Browser** | 15.5+ | Partial |
| **Baidu Browser** | 13.52+ | Partial |
| **QQ Browser** | 14.9+ | Partial |
| **KaiOS Browser** | 2.5+ | Partial |
| **BlackBerry** | 7, 10 | Partial |

### Support Summary

- **Global Usage:** ~0.03% of websites (partial support counted)
- **Practical Support:** Extremely limited due to widespread partial/limited implementations
- **Desktop:** Inconsistent partial support across most browsers
- **Mobile:** Generally partial support, with some exceptions (IE Mobile not supported)

## Important Notes

- **Internet Explorer Special Case:** Internet Explorer supports the W3C proposal **HTML+TIME** (Multimedia for Hypertext Markup Language Time-based Structuring Language), which is largely equivalent to XHTML+SMIL, though with some differences in implementation details.

- **Legacy Technology:** This specification is considered historical and is not recommended for new development. Support is inconsistent and partial across all browsers.

- **Partial Support Explanation:** "Partial" support typically indicates limited or non-standard implementations that may not cover the full XHTML+SMIL specification.

- **Modern Alternatives Strongly Recommended:** For animation needs, developers should use:
  - CSS Animations (excellent browser support)
  - CSS Transitions (universal support)
  - SVG Animations (good browser support)
  - Web Animations API (modern standard)

## Compatibility & Implementation

The inconsistent support across browsers means XHTML+SMIL is not suitable for production web applications that require broad browser compatibility. The specification was developed during an era of competing multimedia standards, and modern web technologies have provided more consistent and effective solutions.

A JavaScript library called **FakeSmile** exists to provide polyfill support for XHTML+SMIL animations in environments where native support is lacking or incomplete.

## References & Resources

- **W3C Specification:** [XHTML+SMIL Official Specification](https://www.w3.org/TR/XHTMLplusSMIL/)
- **Wikipedia Article:** [XHTML+SMIL on Wikipedia](https://en.wikipedia.org/wiki/XHTML%2BSMIL)
- **JavaScript Polyfill:** [FakeSmile - JS Library for XHTML+SMIL Support](https://leunen.me/fakesmile/)

## Recommendations

**For New Projects:**
- Use CSS Animations and Transitions for simple animations
- Use SVG with SMIL (SVG Animation) for complex vector animations
- Use the Web Animations API for advanced control
- Consider JavaScript animation libraries (Anime.js, GSAP, Framer Motion) for complex scenarios

**For Legacy Support:**
- If you need to maintain XHTML+SMIL content, consider using the FakeSmile polyfill
- Document the limitation and test thoroughly across target browsers
- Plan for migration to modern animation standards

---

*Documentation generated from CanIUse feature data. Last updated based on feature specification data.*
