# Web Animations API

## Overview

The **Web Animations API** is a powerful JavaScript interface that enables you to create, control, and inspect animations directly through the browser. It allows you to programmatically create animations that are run natively in the browser, as well as inspect and manipulate animations created through declarative means like CSS animations and transitions.

## Description

Lets you create animations that are run in the browser, as well as inspect and manipulate animations created through declarative means like CSS.

## Specification

- **Status**: Working Draft (WD)
- **Spec URL**: [W3C Web Animations Specification](https://w3c.github.io/csswg-drafts/web-animations/)

## Categories

- DOM
- JS API

## Key Features & Benefits

### Use Cases

1. **Programmatic Animation Control**
   - Create animations dynamically via JavaScript
   - Control timing, duration, and easing functions

2. **Animation Inspection**
   - Inspect CSS animations and transitions programmatically
   - Access animation properties and state

3. **Advanced Animation Manipulation**
   - Play, pause, reverse, and seek animations
   - Control playback rate and current time
   - Access animation state (playState, startTime, currentTime)

4. **Animation Composition**
   - Chain and synchronize multiple animations
   - Combine animations with different timings

5. **Interactive Animations**
   - Respond to user interactions with real-time animation control
   - Update animations based on dynamic data

### Key Methods & Properties

- `element.animate()` - Create animations on DOM elements
- `play()`, `pause()`, `reverse()`, `finish()` - Playback control
- `currentTime`, `startTime`, `playbackRate` - Animation properties
- `playState` - Check animation state
- Animation timelines and effects

## Browser Support

### Overall Support Status

| Browser | First Full Support | Status |
|---------|-------------------|--------|
| Chrome | 84+ | Full Support |
| Edge | 84+ | Full Support |
| Firefox | 75+ | Full Support |
| Safari | 13.1+ | Full Support (Desktop) |
| Opera | 71+ | Full Support |

### Detailed Browser Support Table

#### Chromium-Based Browsers

| Browser | Support | Version | Notes |
|---------|---------|---------|-------|
| **Chrome** | Full | 84+ | Partial from v36 (basic element.animate) |
| **Edge** | Full | 84+ | Partial from v79 (basic element.animate) |
| **Opera** | Full | 71+ | Partial from v23 (basic element.animate) |

#### Mozilla Firefox

| Browser | Support | Version | Notes |
|---------|---------|---------|-------|
| **Firefox** | Full | 75+ | Partial from v47 (basic element.animate) |
| | | 81+ | Full support (v81 removed limitations) |

#### Apple Safari

| Browser | Support | Version | Notes |
|---------|---------|---------|-------|
| **Safari** | Full | 15+ | Full support, no composite modes from v13.1-v14.1 |
| **iOS Safari** | Full | 13.4+ | Partial support without composite modes |

#### Mobile & Other Platforms

| Browser | Support | Version | Notes |
|---------|---------|---------|-------|
| **Samsung Internet** | Full | 14.0+ | Partial from v4 |
| **Android Chrome** | Full | 142+ | |
| **Android Firefox** | Full | 144+ | |
| **Opera Mobile** | Full | 80+ | |
| **Android UC** | Full | 15.5+ | |
| **KaiOS** | Partial | 3.0+ | Partial from v2.5 |
| **Baidu** | Full | 13.52+ | |
| **IE/IE Mobile** | Not Supported | — | No support in any IE version |
| **Opera Mini** | Not Supported | — | No support |

### Support Legend

- **y** = Full support
- **y #N** = Full support with notes (see Notes section)
- **a** = Partial/Alternative support
- **a #N** = Partial support with notes
- **n** = No support
- **d** = Disabled by default
- **d #N** = Disabled by default with notes

## Implementation Notes

### Partial Support Details

1. **#1** - Basic support refers to basic support of `element.animate()` (Chrome 36-38)
2. **#2** - Partial support refers to basic support of `element.animate()` and [playback control of AnimationPlayer](https://www.chromestatus.com/features/5633748733263872)
3. **#3** - Partial support in Firefox is detailed in [Are we animated yet?](https://birtles.github.io/areweanimatedyet/)
4. **#4** - Can be enabled via the "Experimental Features" developer menu (Safari 11-13)
5. **#5** - Does not support [composite modes](https://drafts.csswg.org/web-animations-1/#effect-composition)

### Feature Completeness

- **Global Support**: 92.3% of browsers have full support (y)
- **Partial Support**: 0.57% of browsers have partial support (a)
- **No Support**: Limited to older browsers and IE/Opera Mini

## Compatibility Considerations

### Recommended Polyfill

For projects requiring support in older browsers:
- [web-animations-js](https://github.com/web-animations/web-animations-js) - Official polyfill

### Known Limitations

- **Composite Modes**: Not supported in Safari 13.1-14.1 and some mobile browsers
- **Firefox**: Earlier versions (before 47) had no support; full support achieved in v81
- **Safari**: Requires iOS 13.4+ for mobile support; desktop Safari 13.1+ required
- **IE**: No support in any Internet Explorer version

## Related Resources

### Documentation & Guides

1. [Chrome Developers - Web Animations element.animate() in Chrome 36](https://developer.chrome.com/blog/web-animations-element-animate-is-now-in-chrome-36/)
2. [Chrome Developers - New Web Animations Engine in Blink](https://developer.chrome.com/blog/new-web-animations-engine-in-blink-drives-css-animations-transitions/)
3. [Firefox Web Animations Status](https://birtles.github.io/areweanimatedyet/)

### Tools & Utilities

- [Polyfill Repository](https://github.com/web-animations/web-animations-js)

## Usage Statistics

- **Usage with full support**: 92.3%
- **Usage with partial support**: 0.57%
- **Global coverage for modern browsers**: Excellent (>99% for current browser versions)

## Keywords

`animate`, `element.animate`, `play`, `pause`, `reverse`, `finish`, `currentTime`, `startTime`, `playbackRate`, `playState`, `WAAPI`

---

*Last Updated: 2025 | Data Source: CanIUse*
