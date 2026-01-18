---
name: caniuse-docs
description: Browser compatibility documentation for web features. Use when checking browser support, feature compatibility, CSS/JS/HTML feature availability, or answering "can I use" questions. Covers 569 web features and 19 browsers with version-specific support data. (project)
---

# CanIUse Documentation Skill

Browser compatibility reference for web technologies. Query feature support across Chrome, Firefox, Safari, Edge, and mobile browsers.

## Resource Location

**All documentation is in**: `Resources/CanIUse/docs/`

Read files from this directory to answer compatibility questions. Do NOT load all files at once - read specific files as needed.

## How to Look Up Information

### Feature Lookup

```
Read Resources/CanIUse/docs/features/{feature-name}.md
```

Examples:
- `Resources/CanIUse/docs/features/flexbox.md`
- `Resources/CanIUse/docs/features/css-grid.md`
- `Resources/CanIUse/docs/features/fetch.md`

### Browser Lookup

```
Read Resources/CanIUse/docs/browsers/{browser-id}.md
```

Browser IDs: `chrome`, `firefox`, `safari`, `edge`, `opera`, `ie`, `ios_saf`, `and_chr`, `samsung`

### Browse All Features

```
Read Resources/CanIUse/docs/features/index.md
```

### Browse All Browsers

```
Read Resources/CanIUse/docs/browsers/index.md
```

## Browser Support Codes

| Code | Meaning |
|------|---------|
| `y` | Fully supported |
| `n` | Not supported |
| `a` | Partial support |
| `p` | Polyfill needed |
| `x` | Prefix required |

## Quick Reference

See [QUICK-REFERENCE.md](QUICK-REFERENCE.md) for common features and polyfill recommendations.

## Example Queries

**"Can I use CSS Grid in Safari?"** → Read `Resources/CanIUse/docs/features/css-grid.md`

**"What ES6 features work in IE11?"** → Read `Resources/CanIUse/docs/browsers/ie.md`

**"When did Chrome add WebGL2?"** → Read `Resources/CanIUse/docs/features/webgl2.md`
