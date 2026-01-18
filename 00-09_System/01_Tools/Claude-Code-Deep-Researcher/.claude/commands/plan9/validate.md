# Plan 9: Quality Validation Command

Run comprehensive quality checks for the Web UI implementation.

## Browser Compatibility Validation

### Required CSS Features

Check each feature using the caniuse-docs skill:

| Feature | Required Support | Check Command |
|---------|-----------------|---------------|
| CSS Container Queries | 85%+ | `Read Resources/CanIUse/docs/features/css-container-queries.md` |
| CSS :has() Selector | 85%+ | `Read Resources/CanIUse/docs/features/css-has.md` |
| View Transitions API | 85%+ | `Read Resources/CanIUse/docs/features/view-transitions.md` |
| CSS Nesting | 85%+ | `Read Resources/CanIUse/docs/features/css-nesting.md` |
| CSS Subgrid | 85%+ | `Read Resources/CanIUse/docs/features/css-subgrid.md` |
| Dialog Element | 90%+ | `Read Resources/CanIUse/docs/features/dialog.md` |
| CSS Cascade Layers | 90%+ | `Read Resources/CanIUse/docs/features/css-cascade-layers.md` |
| Backdrop Filter | 90%+ | `Read Resources/CanIUse/docs/features/backdrop-filter.md` |
| WebSockets | 93%+ | `Read Resources/CanIUse/docs/features/websockets.md` |
| CSS Custom Properties | 93%+ | `Read Resources/CanIUse/docs/features/css-variables.md` |

### Target Browsers

All features must work in:
- Chrome 106+
- Safari 16+
- iOS Safari 16+
- Brave (Chromium-based, follows Chrome support)

## TypeScript Validation

```bash
# Check for TypeScript errors
bun run typecheck

# Expected output: No errors
```

## Test Suite Validation

```bash
# Run all tests
bun test

# Expected: All 66 tests pass
```

## Server Validation

```bash
# Start server and verify endpoints
bun run src/web/server.ts &
SERVER_PID=$!
sleep 2

# Check API endpoints
echo "=== API Validation ==="
curl -s http://localhost:3000/api/sessions | jq .
curl -s http://localhost:3000/api/projects | jq .

# Check static file serving
echo "=== Static File Validation ==="
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/css/theme.css
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/js/app.js

# Check WebSocket upgrade
echo "=== WebSocket Validation ==="
# Manual test required in browser

kill $SERVER_PID
```

## CSS Validation Checklist

### Cascade Layers
- [ ] @layer declarations in correct order
- [ ] All styles within appropriate layers
- [ ] No unlayered styles overriding layered styles

### Design Tokens
- [ ] All colors use oklch() or CSS variables
- [ ] Font sizes use clamp() for fluid typography
- [ ] Spacing uses consistent scale variables
- [ ] Dark/light theme variables defined

### Container Queries
- [ ] container-type: inline-size applied to parents
- [ ] @container queries use named containers
- [ ] Fallback styles for older browsers

### CSS :has()
- [ ] Used for state-based styling
- [ ] Fallback behavior for unsupported browsers
- [ ] No performance-heavy selectors

### View Transitions
- [ ] Feature detection before use
- [ ] Graceful fallback for unsupported browsers
- [ ] view-transition-name applied to animated elements
- [ ] Reduced motion preferences respected

## Performance Validation

### Lighthouse Audit
```
Target Scores:
- Performance: 90+
- Accessibility: 100
- Best Practices: 90+
- SEO: 90+
```

### Core Web Vitals
```
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
```

### Bundle Size
```
- Initial CSS: < 50KB
- Initial JS: < 100KB
- HTML: < 20KB
```

## Accessibility Validation

### Keyboard Navigation
- [ ] All interactive elements focusable
- [ ] Focus order follows visual order
- [ ] Focus styles visible
- [ ] Escape closes dialogs

### ARIA
- [ ] Landmarks defined (nav, main, aside)
- [ ] Labels on all form inputs
- [ ] Live regions for dynamic content
- [ ] Proper heading hierarchy

### Color Contrast
- [ ] Text meets WCAG AA (4.5:1 for normal text)
- [ ] Large text meets 3:1 ratio
- [ ] UI components meet 3:1 ratio

## Bun.serve Validation

Reference bun-developer skill for:
- [ ] Route handlers return proper Response objects
- [ ] WebSocket upgrade handled correctly
- [ ] Static files served with correct MIME types
- [ ] Error handling in place
- [ ] Hot reload works in development

## Integration Validation

### Existing Services
- [ ] JSONLParser works with web routes
- [ ] StepAnalyzer integrates correctly
- [ ] ConversationBuilder functions in web context
- [ ] SessionManager finds session files

### Agent SDK (Phase 10)
- [ ] Claude Agent SDK imported correctly
- [ ] Session start/resume works
- [ ] Streaming functions properly

## Validation Report Template

```markdown
## Plan 9 Validation Report
Date: [DATE]
Phase: [PHASE_NUMBER]

### Browser Compatibility
- [ ] Chrome 106+: PASS/FAIL
- [ ] Safari 16+: PASS/FAIL
- [ ] iOS Safari 16+: PASS/FAIL
- [ ] Brave: PASS/FAIL

### TypeScript
- Errors: [COUNT]
- Warnings: [COUNT]

### Tests
- Passed: [COUNT]
- Failed: [COUNT]
- Skipped: [COUNT]

### Performance
- Lighthouse Performance: [SCORE]
- Lighthouse Accessibility: [SCORE]
- LCP: [TIME]
- FID: [TIME]
- CLS: [SCORE]

### Issues Found
1. [ISSUE]
2. [ISSUE]

### Recommendations
1. [RECOMMENDATION]
2. [RECOMMENDATION]
```

## Quick Validation Commands

```bash
# Full validation suite
/plan9:validate all

# Browser compatibility only
/plan9:validate browser

# TypeScript only
/plan9:validate types

# Tests only
/plan9:validate tests

# Performance only
/plan9:validate perf
```
