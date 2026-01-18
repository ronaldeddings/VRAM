# Implement Plan 9: Web UI for Claude Code Deep Researcher

Execute a quality-focused implementation of the Revolutionary Web UI defined in `implementation/9-web-ui-implementation-plan.md`.

## Pre-Flight Checks

Before starting any phase, verify:

1. **Read the Implementation Plan**
   ```
   Read implementation/9-web-ui-implementation-plan.md
   ```

2. **Check Current Project State**
   - Run `bun test` to ensure existing tests pass
   - Run `bun run typecheck` to verify no type errors
   - Verify existing services are working: `bun run src/cli/conversation-analyzer.ts --help`

3. **Skill Activation** (Auto-activated based on task)
   - **bun-developer**: For Bun.serve, WebSocket, SQLite, testing
   - **caniuse-docs**: For browser compatibility verification
   - **claude-code-expert**: For skills, hooks, and Agent SDK integration

## Quality Gates (Apply to EVERY Change)

### Gate 1: Browser Compatibility Check
Before using any CSS/JS feature, verify support using the caniuse-docs skill:
```
Read Resources/CanIUse/docs/features/{feature-name}.md
```

Required compatibility: Chrome 106+, Safari 16+, iOS Safari 16+, Brave (Chromium)

### Gate 2: Bun Best Practices
For all server code, reference bun-developer skill for:
- Bun.serve patterns with route handlers
- WebSocket implementation
- File I/O with Bun.file/Bun.write
- bun:sqlite for caching

### Gate 3: TypeScript Validation
After every file creation/modification:
```bash
bun run typecheck
```

### Gate 4: Test Coverage
After implementing functionality:
```bash
bun test
```

### Gate 5: Integration Verification
After completing a phase:
```bash
bun run src/web/server.ts
```
Verify the server starts and endpoints respond correctly.

## Implementation Strategy

### Wave 1: Foundation (Phases 1-4)
Priority: Server setup, CSS architecture, basic routing

Execute in order:
1. **Phase 1**: Project Setup & Server Foundation
2. **Phase 2**: CSS Architecture (layers, variables, theming)
3. **Phase 3**: View Transitions
4. **Phase 4**: Dialog Element implementation

### Wave 2: Real-Time (Phases 5-6)
Priority: WebSocket streaming, session cloning

5. **Phase 5**: WebSocket Streaming
6. **Phase 6**: DUPLICATE & CLONE services

### Wave 3: CRUD Operations (Phases 7-9)
Priority: Entry editing, building, fabrication

7. **Phase 7**: MODIFY & EDIT services
8. **Phase 8**: BUILD & CREATE services
9. **Phase 9**: FABRICATE & GENERATE services

### Wave 4: Agent Integration (Phase 10)
Priority: Claude Agent SDK bridge

10. **Phase 10**: Agent SDK Integration

### Wave 5: UI Components (Phases 11-14)
Priority: Main UI, performance optimization

11. **Phase 11**: Main UI Components (OBSERVE)
12. **Phase 12**: HTML Structure
13. **Phase 13**: JavaScript Architecture
14. **Phase 14**: Performance Optimizations

### Wave 6: Polish (Phases 15-17)
Priority: Accessibility, testing, deployment

15. **Phase 15**: Accessibility & Progressive Enhancement
16. **Phase 16**: Testing & Quality Assurance
17. **Phase 17**: Documentation & Deployment

## Phase Execution Template

For each phase, follow this pattern:

```markdown
## Phase N: [Phase Name]

### 1. Read Phase Requirements
Read the specific phase section in the implementation plan.

### 2. Browser Compatibility Check
For any CSS/JS features used, verify:
- Check Resources/CanIUse/docs/features/ for feature support
- Confirm 85%+ browser support threshold
- Plan fallbacks for unsupported features

### 3. Bun.serve Implementation
Reference bun-developer skill for:
- Route handler patterns
- WebSocket upgrade handling
- Static file serving

### 4. Create Files
Use the directory structure from the plan:
src/web/
├── server.ts
├── routes/
├── public/
│   ├── css/
│   └── js/
└── templates/

### 5. Validate
- Run typecheck
- Run tests
- Manual verification

### 6. Mark Complete
Update todo list with completion status
```

## Arguments

- `$ARGUMENTS` - Optional phase number (1-17) or "all" for full implementation

## Quick Commands

- `/implement-plan9 1` - Execute Phase 1 only
- `/implement-plan9 1-4` - Execute Phases 1-4 (Wave 1)
- `/implement-plan9 validate` - Run all quality gates
- `/implement-plan9 status` - Show implementation progress

## Success Criteria

Each phase must meet:
- [ ] All checklist items from plan completed
- [ ] TypeScript compiles without errors
- [ ] Existing tests still pass
- [ ] New functionality has test coverage
- [ ] Browser compatibility verified (Chrome, Safari, iOS, Brave)
- [ ] Lighthouse score targets met (90+ performance, 100 accessibility)

## Related Resources

- **Implementation Plan**: `implementation/9-web-ui-implementation-plan.md`
- **Bun Docs**: Use bun-developer skill
- **Browser Support**: Use caniuse-docs skill
- **Agent SDK**: Use claude-code-expert skill
- **Existing Services**: `src/services/`
- **Existing Types**: `src/types/claude-conversation.ts`
