# Advanced JavaScript Patterns

## Structured Shell Results

For operations needing exit codes and error messages:

```javascript
var Shell = {
    run: function(cmd) {
        if (!Runtime.canRunShell) return { output: "", exitCode: -1 };
        try {
            if (Runtime.runtime === "jxa") {
                var app = Application.currentApplication();
                app.includeStandardAdditions = true;
                var output = app.doShellScript(cmd);
                return { output: output.trim(), exitCode: 0 };
            } else if (Runtime.runtime === "ashell") {
                return { output: $command(cmd).trim(), exitCode: 0 };
            }
        } catch (e) {
            return { output: e.message || "", exitCode: 1 };
        }
        return { output: "", exitCode: -1 };
    },

    readFile: function(path) {
        var result = Shell.run("cat " + Shell.quote(path) + " 2>/dev/null");
        return result.exitCode === 0 ? result.output : null;
    }
};
```

## JXA Validator Pattern

For validating JavaScript files for JXA compatibility:

```javascript
var JXAValidator = {
    // Strip strings and comments before pattern matching
    stripStringsAndComments: function(code) {
        code = code.replace(/\/\/.*$/gm, "");           // Single-line comments
        code = code.replace(/\/\*[\s\S]*?\*\//g, "");   // Multi-line comments
        code = code.replace(/"(?:[^"\\]|\\.)*"/g, '""'); // Double-quoted strings
        code = code.replace(/'(?:[^'\\]|\\.)*'/g, "''"); // Single-quoted strings
        code = code.replace(/`(?:[^`\\]|\\.)*`/g, "``"); // Template literals
        return code;
    },

    nodePatterns: [
        { pattern: /\brequire\s*\(/, name: "require()", fix: "Use ObjC.import() or inline code" },
        { pattern: /\bmodule\.exports\b/, name: "module.exports", fix: "Use return value from IIFE" },
        { pattern: /\bprocess\.(env|argv|cwd|exit)\b/, name: "process.*", fix: "Use doShellScript()" },
        { pattern: /\b__dirname\b/, name: "__dirname", fix: "Use doShellScript('pwd')" },
        { pattern: /\b__filename\b/, name: "__filename", fix: "Pass path as argument" },
        { pattern: /\bBuffer\s*[.(]/, name: "Buffer", fix: "Use $.NSData" },
        { pattern: /\bfs\.(read|write|exists)/, name: "fs module", fix: "Use $.NSFileManager" }
    ],

    jxaPatterns: [
        { pattern: /ObjC\.import\s*\(/, name: "ObjC.import()" },
        { pattern: /\$\.\w+/, name: "ObjC bridge ($.*)" },
        { pattern: /Application\s*\(/, name: "Application()" },
        { pattern: /\breadline\s*\(/, name: "readline()" },
        { pattern: /\bprint\s*\(/, name: "print()" }
    ],

    validate: function(content) {
        var issues = [];
        var strippedContent = this.stripStringsAndComments(content);
        var hasJXAPatterns = false;

        this.nodePatterns.forEach(function(p) {
            if (p.pattern.test(strippedContent)) {
                issues.push({ message: p.name, fix: p.fix });
            }
        });

        this.jxaPatterns.forEach(function(p) {
            if (p.pattern.test(strippedContent)) {
                hasJXAPatterns = true;
            }
        });

        return { issues: issues, hasJXAPatterns: hasJXAPatterns };
    }
};
```

## JSC Syntax Checking

Validate JavaScript syntax using JSC:

```javascript
function checkSyntax(filePath) {
    var jscPath = "/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc";
    var checkScript = "try { load(" + JSON.stringify(filePath) + "); print('OK'); } catch(e) { print('ERROR: ' + e.message); }";
    var result = Shell.run("echo " + Shell.quote(checkScript) + " | " + jscPath + " 2>&1");

    if (result.output.indexOf("ERROR:") === 0) {
        return {
            valid: false,
            error: result.output.replace("ERROR: ", "").replace(/undefined/g, "").trim()
        };
    }
    return { valid: true };
}
```

## BigInt Support (iOS 18+/macOS 15+)

JavaScriptCore provides native BigInt:

```javascript
// In Swift/ObjC context:
// JSBigIntCreateWithInt64(ctx, int64Value, &exception)
// JSBigIntCreateWithString(ctx, jsString, &exception)
// JSValueIsBigInt(ctx, jsValue) -> Bool

// In JavaScript:
var big = BigInt("9007199254740993");
var fromNumber = BigInt(Number.MAX_SAFE_INTEGER);
```

## Context and Global Object Access

For advanced JSContext manipulation:

```javascript
// These are C API functions used from Swift/ObjC:
// JSContextGetGlobalContext(ctx) -> JSGlobalContextRef
// JSContextGetGlobalObject(ctx) -> JSObjectRef (the 'window' equivalent)
// JSContextGetGroup(ctx) -> JSContextGroupRef (for thread-safe context management)
// JSValueCompare(ctx, left, right, &exception) -> JSRelationCondition
```

## Claude Agent SDK Integration

### Tool Definition Pattern

```typescript
// TypeScript SDK pattern (for reference)
const myTool = tool(
  'tool_name',
  'Tool description',
  z.object({
    param: z.string().describe('Parameter description')
  }),
  async (args) => {
    return {
      content: [{ type: 'text', text: 'Result' }]
    };
  }
);
```

### Session Management

```typescript
// Capture session ID for resumption
let sessionId: string | undefined;

for await (const message of query({ prompt: "..." })) {
  if (message.type === 'system' && message.subtype === 'init') {
    sessionId = message.session_id;
  }
}

// Resume later
query({ prompt: "...", options: { resume: sessionId } });
```

### Permission Modes

| Mode | Behavior |
|------|----------|
| `default` | Normal permission checks |
| `acceptEdits` | Auto-approve file operations |
| `bypassPermissions` | Skip all checks (use carefully) |

### Hook Lifecycle

```
PreToolUse Hook → Deny Rules → Allow Rules → Ask Rules →
Permission Mode Check → canUseTool Callback → PostToolUse Hook
```

## Error Handling Patterns

### Silent Failure with Defaults

```javascript
function safeOperation() {
    try {
        return riskyOperation();
    } catch (e) {
        return defaultValue;
    }
}
```

### Structured Error Returns

```javascript
function operation() {
    try {
        var result = doWork();
        return { success: true, data: result };
    } catch (e) {
        return { success: false, error: e.message };
    }
}
```

## Performance Considerations

1. **Minimize ObjC imports** - Each import has overhead
2. **Cache Application reference** - Don't recreate for each shell call
3. **Batch shell commands** - Use `&&` to chain when possible
4. **Avoid large string operations** - NSString operations are faster for large text
