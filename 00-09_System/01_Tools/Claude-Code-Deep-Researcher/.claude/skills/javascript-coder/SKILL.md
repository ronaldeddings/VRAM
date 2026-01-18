---
name: javascript-coder
description: Write cross-platform JavaScript for macOS and iOS using JavaScriptCore, JXA, and native APIs. Use when creating JS files, hooks, automation scripts, or any JavaScript that must run without Node.js. Covers Claude Code hooks, ObjC bridge patterns, stdin/stdout handling, and shell command execution.
---

# JavaScript for RonOS

Cross-platform JavaScript development for macOS (JXA/JSC) and iOS (Scriptable/a-Shell) without Node.js dependencies.

## Runtime Environments

| Runtime | Platform | Shell Access | Stdin | Output | Detection |
|---------|----------|--------------|-------|--------|-----------|
| **JXA** | macOS | `doShellScript()` | NSFileHandle | `print()` | `typeof Application !== "undefined"` |
| **JSC** | macOS | None | `readline()` | `print()` | `typeof readline === "function" && typeof console === "undefined"` |
| **Scriptable** | iOS | None | Limited | `console.log()` | `typeof Device !== "undefined"` |
| **a-Shell** | iOS | `$command()` | Limited | `print()` | `typeof $command !== "undefined"` |

## Core Pattern: Runtime Detection

```javascript
(function() {
    "use strict";

    var Runtime = (function() {
        var env = {
            platform: "unknown",
            runtime: "unknown",
            canRunShell: false,
            hasReadline: typeof readline === "function"
        };

        if (typeof Application !== "undefined") {
            env.platform = "macos";
            env.runtime = "jxa";
            env.canRunShell = true;
        } else if (typeof readline === "function" && typeof print === "function" && typeof console === "undefined") {
            env.platform = "macos";
            env.runtime = "jsc";
            env.canRunShell = false;
        } else if (typeof Device !== "undefined" && typeof Device.model === "function") {
            env.platform = "ios";
            env.runtime = "scriptable";
            env.canRunShell = false;
        } else if (typeof $command !== "undefined") {
            env.platform = "ios";
            env.runtime = "ashell";
            env.canRunShell = true;
        }

        return env;
    })();

    // Your code here using Runtime.platform, Runtime.runtime, Runtime.canRunShell

    return main();
})();
```

## Shell Command Execution

```javascript
var Shell = {
    run: function(cmd) {
        if (!Runtime.canRunShell) return "";
        try {
            if (Runtime.runtime === "jxa") {
                var app = Application.currentApplication();
                app.includeStandardAdditions = true;
                return app.doShellScript(cmd).trim();
            } else if (Runtime.runtime === "ashell") {
                return $command(cmd).trim();
            }
        } catch (e) {
            return "";
        }
        return "";
    },

    exists: function(cmd) {
        return Shell.run("which " + cmd + " 2>/dev/null").length > 0;
    },

    fileExists: function(path) {
        return Shell.run("test -f " + Shell.quote(path) + " && echo 1 || echo 0") === "1";
    },

    quote: function(str) {
        return "'" + str.replace(/'/g, "'\\''") + "'";
    }
};
```

## Reading Stdin (Claude Code Hooks)

```javascript
var Input = {
    readJSON: function() {
        try {
            if (Runtime.runtime === "jxa") {
                ObjC.import("Foundation");
                ObjC.import("unistd");

                // Prevent blocking on interactive terminal
                if ($.isatty(0)) return {};

                var stdin = $.NSFileHandle.fileHandleWithStandardInput;
                var data = stdin.availableData;
                var str = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
                if (str && str.js) return JSON.parse(str.js);
            } else if (Runtime.hasReadline) {
                var line = readline();
                if (line) return JSON.parse(line);
            }
        } catch (e) {}
        return {};
    }
};
```

## Output

```javascript
var Output = {
    log: function(msg) {
        if (typeof print === "function") {
            print(msg);
        } else if (typeof console !== "undefined" && console.log) {
            console.log(msg);
        }
    }
};
```

**Important**: In JXA, `osascript` automatically prints the return value. For hooks, return the output string directly instead of using `Output.log()`.

## ObjC Bridge (JXA Only)

### Common Imports

```javascript
ObjC.import("Foundation");  // NSString, NSData, NSFileManager, NSFileHandle
ObjC.import("unistd");      // isatty(), POSIX functions
ObjC.import("Cocoa");       // Full AppKit (heavyweight)
```

### File Operations

```javascript
ObjC.import("Foundation");
var fm = $.NSFileManager.defaultManager;

// Check existence
var exists = fm.fileExistsAtPath("/path/to/file");

// Read file
var data = $.NSData.dataWithContentsOfFile("/path/to/file");
var str = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
var content = str.js;  // Convert to JS string

// Write file
var nsStr = $.NSString.alloc.initWithUTF8String("content");
nsStr.writeToFileAtomicallyEncodingError("/path", true, $.NSUTF8StringEncoding, null);
```

### Bridge Type Conversions

| ObjC Type | Access JS Value | Create from JS |
|-----------|-----------------|----------------|
| NSString | `.js` property | `$.NSString.alloc.initWithUTF8String(str)` |
| NSArray | `.js` property | `$(jsArray)` |
| NSDictionary | `.js` property | `$(jsObject)` |
| NSNumber | `.js` property | `$(number)` |
| BOOL | direct | `true`/`false` |

## Claude Code Hook Patterns

### Hook Input Structure

```javascript
// SessionStart hook receives:
{
    cwd: "/path/to/project",
    session_id: "abc123..."
}

// PostToolUse hook receives:
{
    cwd: "/path/to/project",
    tool_input: {
        file_path: "/path/to/edited/file.js"
    }
}
```

### Hook Return Values

- Return a **string** for output (osascript prints return value)
- Return `""` for no output/no action
- Multiple lines: join with `\n`

### Complete Hook Template

```javascript
// hook-name.js
(function() {
    "use strict";

    // Runtime detection (see above)
    var Runtime = (function() { /* ... */ })();

    // Shell abstraction (see above)
    var Shell = { /* ... */ };

    // Input handling (see above)
    var Input = { /* ... */ };

    function main() {
        if (!Runtime.canRunShell) return "";

        var hookInput = Input.readJSON();
        var filePath = (hookInput.tool_input || {}).file_path || "";

        // Skip if not relevant file type
        if (!filePath.match(/\.swift$/i)) return "";

        var messages = [];

        // Do work...
        messages.push("( Processed " + filePath.split("/").pop());

        return messages.join("\n");
    }

    return main();
})();
```

### settings.json Hook Configuration

```json
{
  "hooks": {
    "SessionStart": [{
      "hooks": [{
        "type": "command",
        "command": "osascript -l JavaScript \"$CLAUDE_PROJECT_DIR/.claude/hooks/session-start.js\"",
        "timeout": 10
      }]
    }],
    "PostToolUse": [{
      "matcher": "Edit|Write|MultiEdit",
      "hooks": [{
        "type": "command",
        "command": "osascript -l JavaScript \"$CLAUDE_PROJECT_DIR/.claude/hooks/post-edit.js\"",
        "timeout": 30
      }]
    }]
  }
}
```

## Incompatible Node.js Patterns

| Node.js | JXA/JSC Alternative |
|---------|---------------------|
| `require()` | `ObjC.import()` or inline code |
| `module.exports` | Return value from IIFE |
| `process.env` | `doShellScript("echo $VAR")` |
| `process.argv` | Not available; use stdin |
| `__dirname` | `doShellScript("pwd")` |
| `__filename` | Pass as argument or hardcode |
| `Buffer` | `$.NSData` |
| `fs.*` | `$.NSFileManager` or `doShellScript()` |
| `path.*` | String manipulation |
| `console.log` | `print()` (JSC) or return value (JXA) |

## Testing Scripts

```bash
# Test with JXA (primary target)
osascript -l JavaScript script.js

# Test with piped input (simulates Claude Code)
echo '{"cwd":"/path","tool_input":{"file_path":"/path/file.js"}}' | \
    osascript -l JavaScript script.js

# Test with JSC (no shell access)
/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc script.js

# Syntax check only
echo "try { load('script.js'); print('OK'); } catch(e) { print('ERROR: ' + e); }" | jsc
```

## Best Practices

1. **Always wrap in IIFE** with `"use strict"`
2. **Check `Runtime.canRunShell`** before shell operations
3. **Use `$.isatty(0)`** in SessionStart hooks to prevent blocking
4. **Quote shell arguments** with `Shell.quote()` to prevent injection
5. **Return strings** instead of using `Output.log()` in hooks
6. **Handle errors silently** with try-catch and safe defaults
7. **Test both JXA and piped input** scenarios

## Reference Files

- **JavaScriptCore API**: See `DeveloperDocs/JavaScriptCore/`
- **JSExport Protocol**: See `DeveloperDocs/JavaScriptCore/JSExport.md`
- **Claude Code Hooks**: See `ClaudeDocs/docs/agent-sdk/`
- **Existing Hooks**: See `.claude/hooks/` for working examples
