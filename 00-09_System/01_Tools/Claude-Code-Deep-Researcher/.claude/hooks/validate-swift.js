#!/usr/bin/env osascript -l JavaScript
/**
 * PostToolUse Hook: Swift File Validation
 *
 * Runs after Edit/Write operations on Swift files.
 * Validates: SwiftLint rules, basic syntax check
 *
 * Input (stdin): JSON with tool_input containing file_path
 * Output (stdout): Validation results for Claude to see
 */

function run(argv) {
    const app = Application.currentApplication();
    app.includeStandardAdditions = true;

    // Read stdin for hook input
    let input;
    try {
        const stdin = $.NSFileHandle.fileHandleWithStandardInput;
        const data = stdin.readDataToEndOfFile;
        const inputStr = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding).js;
        input = JSON.parse(inputStr);
    } catch (e) {
        return "Hook: Unable to parse input";
    }

    // Extract file path from tool input
    const filePath = input?.tool_input?.file_path;
    if (!filePath) {
        return "Hook: No file path in input";
    }

    // Only validate Swift files
    if (!filePath.endsWith('.swift')) {
        return ""; // Silent pass for non-Swift files
    }

    const projectDir = input?.cwd || "/Users/ronaldeddings/RonOS";
    const results = [];

    // Run SwiftLint on the specific file
    try {
        const swiftlintCmd = `cd "${projectDir}" && swift package plugin --allow-writing-to-package-directory swiftlint lint --path "${filePath}" --quiet 2>/dev/null || true`;
        const lintResult = app.doShellScript(swiftlintCmd);

        if (lintResult && lintResult.trim()) {
            results.push("SwiftLint issues:");
            results.push(lintResult.trim());
        } else {
            results.push("SwiftLint: PASS");
        }
    } catch (e) {
        results.push("SwiftLint: Skipped (plugin not available)");
    }

    // Quick syntax check using swiftc -parse
    try {
        const syntaxCmd = `swiftc -parse "${filePath}" 2>&1 || true`;
        const syntaxResult = app.doShellScript(syntaxCmd);

        if (syntaxResult && syntaxResult.includes("error:")) {
            results.push("Syntax errors detected:");
            results.push(syntaxResult.trim());
        } else {
            results.push("Syntax check: PASS");
        }
    } catch (e) {
        results.push("Syntax check: Skipped");
    }

    // Return results
    if (results.length > 0) {
        return "\n" + results.join("\n");
    }

    return "";
}
