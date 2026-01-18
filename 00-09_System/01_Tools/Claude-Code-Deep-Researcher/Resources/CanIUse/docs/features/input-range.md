# Range Input Type

## Overview

The **Range input type** (`<input type="range">`) provides an interactive slider widget that allows users to select a value from a continuous or discrete range. This is a fundamental HTML5 form control that enhances user experience by providing an intuitive visual method for value selection.

## Description

Form field type that allows the user to select a value using a slider widget. The range input type represents a numerical value within a specified range. Instead of requiring precise keyboard input, users can interact with a visual slider control to choose their preferred value.

## Specification

- **Status:** Living Standard (ls)
- **Official Spec:** [HTML Living Standard - Range State](https://html.spec.whatwg.org/multipage/forms.html#range-state-(type=range))

## Categories

- HTML5

## Benefits & Use Cases

### Primary Use Cases

- **Media Player Controls:** Volume and playback position sliders
- **Settings & Preferences:** Brightness, contrast, zoom level adjustments
- **Data Visualization:** Interactive filters for numeric ranges (price, age, distance)
- **Accessibility:** Keyboard and touch-friendly value selection
- **Responsive Design:** Native touch support on mobile devices
- **Form Simplification:** Reducing keyboard input errors for numeric values

### Key Benefits

1. **Native HTML5 Support:** No JavaScript required for basic functionality
2. **Semantic HTML:** Provides semantic meaning to form controls
3. **Accessibility:** Built-in ARIA attributes and keyboard navigation
4. **Mobile-Friendly:** Optimized touch interactions on devices
5. **Reduced User Errors:** Visual selection prevents invalid input
6. **Browser Consistency:** Standardized slider appearance across modern browsers
7. **CSS Customization:** Styleable thumb, track, and fill colors

## Browser Support

### Support Legend
- ✅ **Y** = Supported
- ❌ **N** = Not supported
- ⚠️ **A** = Partial support

### Desktop Browsers

| Browser | Support Status | Version Range |
|---------|---|---|
| **Chrome** | ✅ | 4+ (Full support) |
| **Firefox** | ✅ | 23+ (Full support) |
| **Safari** | ✅ | 3.1+ (Full support) |
| **Opera** | ✅ | 9+ (Full support) |
| **Edge** | ✅ | 12+ (Full support) |
| **Internet Explorer** | ⚠️ | 10-11 (Partial support with bugs) |

### Mobile & Tablet Browsers

| Browser | Support Status | Version Range |
|---------|---|---|
| **iOS Safari** | ✅ | 5.0+ (Full support) |
| **Android Browser** | ⚠️ | 2.1+ (Partial - hidden by default, styleable) |
| **Chrome Mobile** | ✅ | All versions (Full support) |
| **Firefox Mobile** | ✅ | All versions (Full support) |
| **Samsung Internet** | ✅ | 4+ (Full support) |
| **Opera Mobile** | ✅ | 10+ (Full support) |
| **UC Browser** | ✅ | 15.5+ (Full support) |
| **Baidu Browser** | ✅ | 13.52+ (Full support) |
| **KaiOS** | ✅ | 2.5+ (Full support) |
| **Opera Mini** | ❌ | Not supported |
| **Blackberry** | ✅ | 7+ (Full support) |
| **Internet Explorer Mobile** | ✅ | 10-11 (Full support) |

### Overall Support Statistics

- **Full Support:** 93.54% of users globally
- **Partial Support:** 0% (Android partial implementations don't degrade)
- **No Support:** 6.46% of users globally

## Implementation Examples

### Basic HTML

```html
<label for="volume">Volume:</label>
<input type="range" id="volume" name="volume" min="0" max="100" value="50">
```

### With JavaScript Interaction

```html
<input type="range" id="slider" min="0" max="100" value="50">
<output id="output">50</output>

<script>
  const slider = document.getElementById('slider');
  const output = document.getElementById('output');

  slider.addEventListener('input', () => {
    output.textContent = slider.value;
  });
</script>
```

### With Custom Styling

```html
<input
  type="range"
  id="styled-slider"
  min="0"
  max="100"
  value="50"
  style="
    width: 300px;
    height: 8px;
    cursor: pointer;
  "
>
```

## Important Notes

### Android Browser Behavior
Currently, all Android browsers with partial support hide the slider input field by default. However, the element [can be styled](https://tiffanybbrown.com/2012/02/input-typerange-and-androids-stock-browser/) to be made visible and usable.

### Known Issues

#### Internet Explorer 10 & 11
1. **Step Value Bug:** IE10 & 11 have [some bugs related to the `step` value](https://stackoverflow.com/questions/20241415/html5-number-input-field-step-attribute-broken-in-internet-explorer-10-and-inter)
2. **Event Firing:** IE10 & 11 [fire the "change" event instead of "input" on mousemove](http://hparra.github.io/html5-input-range/), requiring workarounds for real-time updates

### Workarounds & Polyfills

If you need to support older browsers, several polyfills are available:

- **[html5slider](https://github.com/fryn/html5slider)** - Polyfill for Firefox
- **[fd-slider](https://github.com/freqdec/fd-slider)** - Cross-browser polyfill
- **[rangeslider.js](https://github.com/andreruffert/rangeslider.js)** - Feature-rich polyfill

## Attributes

The range input supports standard HTML5 attributes:

- `min` - Minimum value (default: 0)
- `max` - Maximum value (default: 100)
- `step` - Stepping interval (default: 1)
- `value` - Current selected value
- `list` - Reference to datalist element for tick marks
- `disabled` - Disables the input
- `form` - Associates with a form element
- `name` - Name for form submission
- `required` - Makes the field required

## CSS Properties

Modern browsers support CSS pseudo-elements for styling:

- `::-webkit-slider-thumb` - Chrome/Safari thumb
- `::-moz-range-thumb` - Firefox thumb
- `::-webkit-slider-runnable-track` - Chrome/Safari track
- `::-moz-range-track` - Firefox track

## JavaScript Events

- **`input`** - Fires as user drags the slider (real-time)
- **`change`** - Fires when user releases the slider
- **`oninput`** - Event handler for input events

## Related Resources

### Documentation
- [MDN Web Docs - Input Range](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range)
- [WebPlatform Docs - Input Range](https://webplatform.github.io/docs/html/elements/input/type/range)

### Tutorials
- [TutorialZine - What You Need to Know About HTML5 Range Input](https://tutorialzine.com/2011/12/what-you-need-to-know-html5-range-input)
- [HTML5 Input Range Tutorial](http://tutorialzine.com/2011/12/what-you-need-to-know-html5-range-input/)

### Feature Detection
- [has.js - Input Type Range Test](https://raw.github.com/phiggins42/has.js/master/detect/form.js#input-type-range)

## Recommendations

### When to Use Range Input
- Selecting numeric values in continuous ranges (volume, brightness)
- Filtering data with minimum/maximum bounds
- Adjusting settings or preferences
- Creating interactive demos or visualizations
- Any scenario where keyboard precision is less important than visual feedback

### When to Use Alternatives
- If you need strict value validation, use `<input type="number">` with JavaScript validation
- For multiple discrete options, consider `<select>` or radio buttons
- For very precise numeric input, a text field with validation may be better

### Browser Support Decision
With 93.54% global browser support, range input is safe to use in modern web applications. For IE10/11 support, consider using a polyfill only if your audience includes those browser versions.

## Last Updated
This documentation reflects the latest browser compatibility data and is current as of 2024.
