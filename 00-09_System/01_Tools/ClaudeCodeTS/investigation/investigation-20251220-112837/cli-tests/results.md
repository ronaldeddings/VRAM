# CLI Execution Test Results

Timestamp: Sat Dec 20 11:28:40 CST 2025

## Test Commands

### `bun run cli --help`

```
investigate.sh: line 220: timeout: command not found
```

**Result:** ❌ FAIL (exit code: 127)

---

### `bun run cli --version`

```
investigate.sh: line 220: timeout: command not found
```

**Result:** ❌ FAIL (exit code: 127)

---

### `bun run cli -p 'say hello'`

```
investigate.sh: line 220: timeout: command not found
```

**Result:** ❌ FAIL (exit code: 127)

---

### `bun run cli --dangerously-skip-permissions -p 'echo test'`

```
investigate.sh: line 220: timeout: command not found
```

**Result:** ❌ FAIL (exit code: 127)

---

### `bun run typecheck`

```
investigate.sh: line 220: timeout: command not found
```

**Result:** ❌ FAIL (exit code: 127)

---

### `bun test`

```
investigate.sh: line 220: timeout: command not found
```

**Result:** ❌ FAIL (exit code: 127)

---

## Package.json Scripts Found

```
"cli": "bun src/cli.ts"
"start": "bun src/cli.ts"
"test": "bun test"
"claude-ts": "dist/cli.js"
```

