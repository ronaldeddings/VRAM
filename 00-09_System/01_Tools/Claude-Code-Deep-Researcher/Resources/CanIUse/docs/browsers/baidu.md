# Baidu Browser

## Overview

**Official Name:** Baidu Browser for Android
**ID:** `baidu`
**Abbreviation:** Baidu
**Browser Type:** Mobile
**Long Name:** Baidu Browser for Android

---

## Browser Specifications

### Type Classification
- **Category:** Mobile Browser
- **Platform:** Android
- **Target Devices:** Android smartphones and tablets
- **Browser Family:** Baidu Corporation's proprietary mobile browser

### Rendering Engine
- **Vendor Prefix:** `-webkit-`
- **Engine Type:** Webkit-based
- **Standards Compliance:** WebKit compatibility layer
- **Base Architecture:** Chromium-based rendering engine with WebKit optimization

---

## Version History

### Current Version Support

| Version | Status | Usage (Global) | Release Information |
|---------|--------|----------------|-------------------|
| 13.52   | Tracked | 0% | Latest tracked version |

### Version Details

**Version 13.52**
- **Status:** Active in Can I Use database
- **Global Usage:** 0% (minimal to negligible market share)
- **Position in Database:** Index 145 (145 versions back from latest)
- **Data Availability:** Version is included in feature compatibility tracking

### Version Notes
- **13.52** is the primary version tracked in the Can I Use compatibility database
- Usage statistics show negligible global market penetration (0% rounded)
- This version represents historical data point for compatibility assessment
- Baidu Browser appears to have minimal presence in the modern web browser landscape

---

## Vendor Prefix Information

### Primary Prefix
- `-webkit-` is the standard vendor prefix for this browser
- Most modern CSS and JavaScript features utilize WebKit compatibility
- Fully aligns with WebKit standard prefixing conventions

### Prefix Exceptions
- **Version 13.52:** Uses `-webkit-` prefix for all features
- No special prefix handling required

### CSS Vendor Prefix Usage Example
```css
/* WebKit prefix for CSS features */
.element {
  -webkit-appearance: none;
  -webkit-transition: all 0.3s ease;
  -webkit-transform: translateZ(0);
}
```

---

## Usage Statistics

### Global Market Share
- **Version 13.52:** 0% of global users (statistically negligible)
- **Total Market Presence:** Effectively discontinued or extremely limited adoption
- **Market Status:** No significant market presence in the global browser statistics

### Market Context
- Baidu Browser historically served the Chinese market
- Market share has declined significantly in recent years
- Minimal presence in current web analytics and usage statistics
- Largely superseded by other mobile browsers in its primary market

### Regional Significance
- **Historical Primary Markets:** China and other Asian regions
- **Current Adoption:** Extremely limited
- **Modern Relevance:** Minimal for web development targeting purposes

---

## Compatibility Notes

### Platform Specifics
- Baidu Browser for Android is built on the WebKit rendering engine
- It inherits WebKit's HTML5 and CSS3 support capabilities
- Most standard web features are supported with webkit-prefixed versions
- Aligns with Chromium/WebKit compatibility standards

### Known Characteristics
- **WebKit Foundation:** Provides solid compatibility with modern web standards
- **Legacy Support:** Maintained in Can I Use for historical compatibility tracking
- **Feature Coverage:** Good support for standard HTML5 and CSS3 features
- **Performance:** Optimized for Chinese market networks and devices

### Browser Capabilities
- Full HTML5 support via WebKit engine
- CSS3 support with webkit prefixes
- ECMAScript 5+ compatibility
- Modern web APIs (with WebKit compatibility considerations)
- Standard DOM manipulation capabilities

---

## Development Considerations

### Testing Recommendations
When developing for Baidu Browser for Android, consider:

1. **Vendor Prefixes:** Use `-webkit-` prefixes for CSS properties requiring them
2. **Feature Testing:** Test critical features but prioritize higher-market-share browsers
3. **Performance:** Modern devices have adequate resources; legacy optimizations may be unnecessary
4. **Network:** No special network compression considerations required

### Feature Support Guidelines
- Most modern CSS3 features are supported via webkit prefixes
- ECMAScript 5+ is generally well-supported
- HTML5 APIs have good coverage
- Experimental features should be tested individually
- Fallback strategies recommended for cutting-edge features

### Compatibility Levels
- **Excellent:** Standard HTML5, CSS3, DOM APIs
- **Good:** Modern JavaScript features, WebGL, Canvas
- **Fair:** Advanced experimental APIs
- **Poor:** Some ES6+ features may require transpilation

### Code Example
```javascript
// Baidu Browser support detection
if (navigator.userAgent.includes('baiduboxapp')) {
  // Baidu Browser specific code
  // Apply fallbacks for experimental features
}

// WebKit prefix handling for features
const hasWebKitSupport = () => {
  return window.webkitRequestAnimationFrame ||
         'webkitAppearance' in document.documentElement.style;
};
```

---

## Market Context

### Current Status
- **Market Position:** Legacy/discontinued browser
- **Active Development:** Minimal to none
- **Industry Relevance:** Low for modern web development

### Historical Significance
- **Peak Years:** Mid-2010s in Chinese market
- **Main User Base:** Chinese Android users
- **Key Features:** Data compression, fast loading
- **Unique Selling Points:** Optimized for Chinese web services

### Regional Differences
- **China:** Primary historical market
- **Asia-Pacific:** Limited presence
- **Europe/Americas:** Negligible to non-existent presence
- **Global:** Minimal measurable market share

### User Demographics
- Historically: Chinese Android users
- Primarily: Budget-conscious device users
- Data priorities: Users on metered or slow connections
- Current status: Largely absent from user base

---

## Implementation Strategy

### Priority Level for Development
**Priority: Very Low** - Baidu Browser should not be a primary target for new web development due to:
- Minimal global market share (0%)
- Declining user base
- Limited active development
- Better-supported alternatives available

### When to Consider Support
1. **Specific Use Case:** Building exclusively for Chinese market (less relevant now)
2. **Analytics Verification:** If analytics show significant Baidu Browser traffic
3. **Graceful Degradation:** Include basic WebKit fallbacks as part of standard practices
4. **Legacy Projects:** Existing applications with historical Baidu Browser support

### Progressive Enhancement Approach
```html
<!-- Basic support through standard WebKit prefixes -->
<style>
  .feature {
    /* Standard property */
    transition: all 0.3s ease;

    /* WebKit fallback for compatibility */
    -webkit-transition: all 0.3s ease;
  }
</style>
```

---

## References

### Data Source
- **Database:** Can I Use (caniuse.com)
- **Data ID:** baidu
- **Database Version:** As of latest caniuse.com update
- **Last Updated:** Latest database snapshot

### Official Resources
- **Can I Use Database Entry:** https://caniuse.com
- **Baidu Official:** https://www.baidu.com/
- **Historical Information:** Archives of Baidu Browser (discontinued)

### Related Browsers
- **QQ Browser** (and_qq) - Similar Chinese market browser
- **UC Browser for Android** (and_uc) - Alternative mobile browser
- **Chrome for Android** (and_chr) - Primary modern alternative

---

## Technical Analysis

### Rendering Architecture
- **Core Engine:** WebKit
- **Development Model:** Proprietary modifications on WebKit
- **Standards Adherence:** Good HTML5/CSS3 support through WebKit base

### Performance Characteristics
- **JavaScript Engine:** WebKit JavaScript engine
- **Rendering Speed:** Adequate for modern web pages
- **Memory Footprint:** Optimized for mobile devices
- **Startup Time:** Rapid startup optimization

### Security Features
- **Built-in Protection:** WebKit security model
- **SSL/TLS Support:** Full modern encryption standards
- **Cookie Handling:** Standard browser security policies
- **Same-Origin Policy:** Full implementation

---

## Maintenance Notes

- This documentation reflects the Baidu Browser entries in the Can I Use database
- Version information and usage statistics are current as of the latest database update
- Baidu Browser is maintained in Can I Use for historical compatibility tracking
- Actual market presence is negligible in 2025
- Not recommended as a primary testing target for new web development
- For the most current usage data, refer to the main Can I Use database
- Baidu Browser's market relevance has significantly diminished since its peak in the mid-2010s

---

**Last Generated:** December 2025
**Browser ID:** baidu
**Documentation Format:** Can I Use Browser Profile
**Status:** Legacy Browser (Minimal Active Support)
