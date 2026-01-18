// session-start.js
// Cross-platform JavaScript hook for Claude Code (macOS & iOS)
//
// Supported runtimes:
// - macOS: jsc (JavaScriptCore), osascript -l JavaScript
// - iOS: JavaScriptCore (via app), Scriptable, a-Shell
//
// Run with: jsc session-start.js
//           osascript -l JavaScript session-start.js

(function() {
    "use strict";

    // Runtime detection
    var Runtime = (function() {
        var env = {
            platform: "unknown",
            runtime: "unknown",
            canRunShell: false,
            hasReadline: typeof readline === "function"
        };

        if (typeof Application !== "undefined") {
            // macOS JXA (osascript -l JavaScript)
            env.platform = "macos";
            env.runtime = "jxa";
            env.canRunShell = true;
        } else if (typeof readline === "function" && typeof print === "function" && typeof console === "undefined") {
            // JSC (JavaScriptCore CLI) - has readline() and print()
            env.platform = "macos";
            env.runtime = "jsc";
            env.canRunShell = false;
        } else if (typeof Device !== "undefined" && typeof Device.model === "function") {
            // Scriptable (iOS)
            env.platform = "ios";
            env.runtime = "scriptable";
            env.canRunShell = false;
        } else if (typeof $command !== "undefined") {
            // a-Shell (iOS)
            env.platform = "ios";
            env.runtime = "ashell";
            env.canRunShell = true;
        } else {
            env.platform = "unknown";
            env.runtime = "generic";
            env.canRunShell = false;
        }

        return env;
    })();

    // Shell command execution (for runtimes that support it)
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
            if (!Runtime.canRunShell) return false;
            return Shell.run("which " + cmd + " 2>/dev/null").length > 0;
        }
    };

    // Output abstraction
    var Output = {
        log: function(msg) {
            if (typeof print === "function") {
                print(msg);
            } else if (typeof console !== "undefined" && console.log) {
                console.log(msg);
            }
        }
    };

    // Read stdin (for hook input)
    // Note: For SessionStart, stdin reading can block on TTY if run manually.
    // We use NSFileHandle with a workaround to detect if stdin is a pipe.
    var Input = {
        readJSON: function() {
            try {
                if (Runtime.runtime === "jxa") {
                    ObjC.import("Foundation");
                    ObjC.import("unistd");  // For isatty

                    // Check if stdin is a TTY (interactive terminal)
                    // If it is, skip reading to avoid blocking
                    var stdinFd = 0;  // STDIN_FILENO
                    var isTTY = $.isatty(stdinFd);

                    if (isTTY) {
                        // Running interactively, no piped input
                        return {};
                    }

                    // Stdin is a pipe, safe to read
                    var stdin = $.NSFileHandle.fileHandleWithStandardInput;
                    var data = stdin.availableData;
                    var str = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
                    if (str && str.js) return JSON.parse(str.js);
                } else if (Runtime.hasReadline) {
                    // JSC uses readline()
                    var line = readline();
                    if (line) return JSON.parse(line);
                }
            } catch (e) {
                // Invalid JSON, no input, or isatty not available
            }
            return {};
        }
    };

    // Main hook logic
    function main() {
        // Read hook input (contains session info)
        var hookInput = Input.readJSON();
        var cwd = hookInput.cwd || "";
        var projectName = cwd ? cwd.split("/").pop() : "RonOS";

        var messages = [];
        messages.push("🚀 Starting " + projectName + " session");

        if (Runtime.canRunShell) {
            // Get Swift version
            var swiftOutput = Shell.run("swift --version 2>/dev/null | head -1");
            var swiftMatch = swiftOutput.match(/\d+\.\d+/);
            var swiftVersion = swiftMatch ? swiftMatch[0] : null;

            // Get Xcode version (macOS only)
            var xcodeVersion = null;
            if (Runtime.platform === "macos") {
                xcodeVersion = Shell.run("xcodebuild -version 2>/dev/null | head -1");
            }

            if (swiftVersion && xcodeVersion) {
                messages.push("📱 Swift " + swiftVersion + " | " + xcodeVersion);
            } else if (swiftVersion) {
                messages.push("📱 Swift " + swiftVersion);
            }

            // Git branch
            var branch = Shell.run("git -C " + (cwd || ".") + " branch --show-current 2>/dev/null");
            if (branch) {
                messages.push("🌿 Branch: " + branch);
            }

            // List available skills
            var skillsDir = (cwd || Shell.run("pwd")) + "/.claude/skills";
            var skillsList = Shell.run("ls -1 '" + skillsDir + "' 2>/dev/null");
            if (skillsList) {
                var skills = skillsList.split(/[\r\n]+/).filter(function(s) { return s.trim().length > 0; });
                if (skills.length > 0) {
                    messages.push("🎯 Skills: " + skills.join(", "));
                }
            }
        } else {
            // Limited info without shell
            messages.push("📱 Platform: " + Runtime.platform + " (" + Runtime.runtime + ")");
            if (hookInput.session_id) {
                messages.push("🔑 Session: " + hookInput.session_id.substring(0, 8) + "...");
            }
        }

        // Return joined string (osascript automatically prints return value)
        return messages.join("\n");
    }

    return main();
})();
