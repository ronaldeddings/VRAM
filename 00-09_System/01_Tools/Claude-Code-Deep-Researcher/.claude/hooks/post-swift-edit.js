// post-swift-edit.js
// Cross-platform JavaScript hook for auto-formatting Swift files after editing
//
// Supported runtimes:
// - macOS: jsc (JavaScriptCore), osascript -l JavaScript
// - iOS: JavaScriptCore (via app), a-Shell (with swift-format)
//
// Reads JSON from stdin with tool_input.file_path, runs formatters if available.

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
            env.platform = "macos";
            env.runtime = "jxa";
            env.canRunShell = true;
        } else if (typeof readline === "function" && typeof print === "function" && typeof console === "undefined") {
            env.platform = "macos";
            env.runtime = "jsc";
            env.canRunShell = false;
        } else if (typeof $command !== "undefined") {
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

    // Shell abstraction
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
        },

        fileExists: function(path) {
            if (!Runtime.canRunShell) return false;
            return Shell.run("test -f " + Shell.quote(path) + " && echo 1 || echo 0") === "1";
        },

        quote: function(str) {
            return "'" + str.replace(/'/g, "'\\''") + "'";
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

    // Read stdin
    var Input = {
        readJSON: function() {
            try {
                if (Runtime.runtime === "jxa") {
                    // JXA uses Objective-C bridge to read stdin
                    ObjC.import("Foundation");
                    var stdin = $.NSFileHandle.fileHandleWithStandardInput;
                    var data = stdin.availableData;
                    var str = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
                    if (str && str.js) return JSON.parse(str.js);
                } else if (Runtime.hasReadline) {
                    // JSC uses readline()
                    var line = readline();
                    if (line) return JSON.parse(line);
                }
            } catch (e) {}
            return {};
        }
    };

    // Main hook logic
    function main() {
        if (!Runtime.canRunShell) {
            // Can't run formatters without shell access
            return "";
        }

        // Read and parse input JSON from Claude Code
        var hookInput = Input.readJSON();
        var toolInput = hookInput.tool_input || {};
        var filePath = toolInput.file_path || "";

        // Only process Swift files
        if (!filePath || !filePath.match(/\.swift$/i)) {
            return "";
        }

        var cwd = hookInput.cwd || ".";
        var formatted = false;

        // Run swiftformat if available and configured
        if (Shell.fileExists(cwd + "/.swiftformat") && Shell.exists("swiftformat")) {
            Shell.run("swiftformat " + Shell.quote(filePath) + " 2>/dev/null");
            formatted = true;
        }

        // Run swiftlint --fix if available and configured
        if (Shell.fileExists(cwd + "/.swiftlint.yml") && Shell.exists("swiftlint")) {
            Shell.run("swiftlint lint --fix " + Shell.quote(filePath) + " 2>/dev/null");
            formatted = true;
        }

        if (formatted) {
            return "✨ Formatted " + filePath.split("/").pop();
        }

        return "";
    }

    return main();
})();
