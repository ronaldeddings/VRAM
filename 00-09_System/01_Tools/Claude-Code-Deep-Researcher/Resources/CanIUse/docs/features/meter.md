# HTML `<meter>` Element

## Overview

The `<meter>` element is an HTML5 semantic element used to display a scalar measurement within a known range, or a fractional value (gauge). It provides a native way to represent measurements such as disk usage, temperature, ratings, or any value on a scale from minimum to maximum.

## Description

The `<meter>` element provides a method of indicating the current level of a gauge. It is particularly useful for displaying scalar measurements that fall within a known range, such as:

- Disk usage percentage
- Temperature readings
- CPU usage
- Ratings or scores
- Progress within a finite range

Unlike the `<progress>` element, which represents work in progress toward completion, the `<meter>` element represents a gauge or measurement at a point in time.

## Specification Status

**Status:** Recommended (LS - Living Standard)

**Official Specification:** [HTML Standard - meter element](https://html.spec.whatwg.org/multipage/forms.html#the-meter-element)

The `<meter>` element is part of the HTML Living Standard maintained by the WHATWG and is widely supported across modern browsers.

## Categories

- HTML5
- Semantic HTML
- Forms & Interactive Elements

## Use Cases & Benefits

### Practical Applications

The `<meter>` element is ideal for displaying:

- **System Metrics:** CPU usage, memory consumption, disk space
- **Environmental Data:** Temperature, humidity levels
- **User Ratings:** Star ratings, satisfaction scores
- **Resource Usage:** Download progress (where the end is known), battery level
- **Quality Indicators:** Signal strength, connection quality
- **Gauge Displays:** Fuel levels, water pressure, any analog measurement

### Key Benefits

- **Semantic Meaning:** Provides clear semantic information to browsers and assistive technologies
- **Native Rendering:** Browsers render the meter with default styling appropriate to the platform
- **Accessibility:** Screen readers can interpret and announce the measurement
- **Simplicity:** Easier to implement than custom gauge components
- **Consistency:** Provides a standardized, recognizable UI pattern

## Browser Support

The `<meter>` element has excellent support across all modern browsers, with nearly universal adoption. Internet Explorer is the only major browser that does not support this element.

### Browser Support Table

| Browser | First Supported Version | Current Status | Notes |
|---------|------------------------|-----------------|-------|
| **Chrome** | 8 | ✅ Supported | Supported in all versions from 8+ |
| **Firefox** | 16 | ✅ Supported | Supported in all versions from 16+ |
| **Safari** | 6 | ✅ Supported | Supported in all versions from 6+ |
| **Edge** | 13 | ✅ Supported | Supported in all versions from 13+ (all Chromium-based) |
| **Opera** | 11 | ✅ Supported | Supported in all versions from 11+ |
| **Internet Explorer** | N/A | ❌ Not Supported | No support in any version (5.5 through 11) |
| **iOS Safari** | 10.3 | ✅ Supported | Supported from 10.3+ |
| **Android Browser** | 4.4 | ✅ Supported | Supported from 4.4+ |
| **Samsung Internet** | 4 | ✅ Supported | Supported in all versions from 4+ |
| **Opera Mini** | All | ✅ Supported | Fully supported |
| **Android Chrome** | 142 | ✅ Supported | Latest versions fully supported |
| **Android Firefox** | 144 | ✅ Supported | Latest versions fully supported |

### Global Usage

- **Global Usage Support:** 93.23% of browsers globally support the `<meter>` element
- The element has near-universal support in modern, actively maintained browsers

### Legacy Browser Considerations

- **Internet Explorer:** No support. Fallback content should be provided for IE users
- **Very Old Mobile Browsers:** Android browsers before version 4.4 and iOS Safari before 10.3 do not support the element

## HTML Syntax

### Basic Syntax

```html
<meter value="6" min="0" max="10"></meter>
```

### With All Attributes

```html
<meter
  value="75"
  min="0"
  max="100"
  low="33"
  high="66"
  optimum="80"
  title="Disk Usage"
>
  75%
</meter>
```

### Attributes

- **`value`** (required): The current measurement value
- **`min`** (optional): The lower bound of the range (default: 0)
- **`max`** (optional): The upper bound of the range (default: 1)
- **`low`** (optional): Threshold for the "low" region
- **`high`** (optional): Threshold for the "high" region
- **`optimum`** (optional): The point that is considered "optimum" within the range

### Fallback Content

The meter element supports fallback content for browsers that don't support it:

```html
<meter value="6" min="0" max="10">
  6 out of 10
</meter>
```

## Important Notes

### Known Issues

The `<meter>` element has one notable limitation:

**⚠️ Undefined Segment Boundaries:** The boundaries between the low/medium/high regions are poorly defined in the specification and are not consistently implemented across different browsers. This means that visual appearance may vary significantly between Chrome, Firefox, and Safari when using the `low`, `high`, and `optimum` attributes.

**Related Issue:** [WHATWG HTML Issue #3520](https://github.com/whatwg/html/issues/3520)

**Workaround:** For critical applications requiring consistent visual appearance:
1. Test extensively across target browsers
2. Consider using CSS-styled custom elements for precise control
3. Use `<meter>` primarily for simple use cases without relying heavily on low/high/optimum styling
4. Provide explicit fallback content or descriptions

## Styling

The `<meter>` element can be styled with CSS, though browser support for pseudo-elements varies:

```css
/* Basic styling */
meter {
  width: 100%;
  height: 20px;
}

/* Webkit browsers (Chrome, Safari) */
meter::-webkit-meter-bar {
  background: #ddd;
  border-radius: 4px;
}

meter::-webkit-meter-optimum-value {
  background: #4caf50;
}

meter::-webkit-meter-suboptimal-value {
  background: #ff9800;
}

meter::-webkit-meter-even-less-good-value {
  background: #f44336;
}

/* Firefox */
meter {
  color: #4caf50;
}
```

## Accessibility

The `<meter>` element is accessible by default:

- **Screen Readers:** Announced with the value and range information
- **Semantic HTML:** Provides clear meaning to assistive technologies
- **Best Practice:** Include descriptive text or labels alongside the meter element

```html
<label for="disk-usage">Disk Usage:</label>
<meter id="disk-usage" value="75" min="0" max="100">
  75% of 100%
</meter>
```

## Examples

### Disk Usage Indicator

```html
<p>Disk usage: <meter value="3" min="0" max="10">3 out of 10</meter></p>
```

### Temperature Display

```html
<p>Temperature: <meter value="25" min="0" max="50" optimum="22">
  25°C
</meter></p>
```

### Rating with Segments

```html
<p>Network Quality:
  <meter value="7" min="0" max="10" low="3" high="7">
    7/10
  </meter>
</p>
```

### CPU Usage

```html
<p>CPU Usage:
  <meter value="65" min="0" max="100" low="33" high="66" optimum="25">
    65%
  </meter>
</p>
```

## Comparison with Similar Elements

### `<meter>` vs `<progress>`

| Feature | `<meter>` | `<progress>` |
|---------|-----------|--------------|
| **Purpose** | Gauge/measurement | Work in progress |
| **Meaning** | Static measurement at a point in time | Progress toward completion |
| **Use Case** | Temperature, CPU, ratings | Download, file upload, task completion |
| **Value Semantics** | Point in range | Progress from 0 to completion |

### `<meter>` vs Custom Gauge

**When to use `<meter>`:**
- Simple measurements that don't need custom styling
- Semantic correctness is important
- Browser defaults are acceptable

**When to use custom solutions:**
- Complex visual requirements
- Need precise cross-browser consistency
- Advanced animations or interactions required

## Related Resources

### Official Documentation
- [MDN Web Docs - meter element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meter)
- [HTML Standard Specification](https://html.spec.whatwg.org/multipage/forms.html#the-meter-element)

### Educational Resources
- [HTML5 Doctor - Measure Up with the Meter Tag](https://html5doctor.com/measure-up-with-the-meter-tag/)
- [Dev.Opera - New Form Features in HTML5](https://dev.opera.com/articles/new-form-features-in-html5/#newoutput)
- [Interactive Examples - progress and meter elements](https://peter.sh/examples/?/html/meter-progress.html)

### Advanced Topics
- [The HTML `<meter>` Element and Its (Undefined) Segment Boundaries](https://www.ctrl.blog/entry/html-meter-segment-boundaries.html)
- [WHATWG HTML Issue - Segment Boundaries](https://github.com/whatwg/html/issues/3520)

## Summary

The `<meter>` element is a mature, well-supported HTML5 feature with 93.23% global usage. It provides a semantic, accessible way to display measurements and gauges. While it has excellent browser support, developers should be aware of the inconsistent rendering of segment boundaries across browsers and may want to test thoroughly or provide fallback solutions for critical applications. For most use cases, `<meter>` is a reliable and standards-compliant choice.
