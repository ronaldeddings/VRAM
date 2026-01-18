# Bun Shell Reference

Complete reference for `$` - Bun's cross-platform shell scripting API.

## Getting Started

```typescript
import { $ } from "bun";

// Basic command
await $`echo "Hello World!"`;

// Capture output
const output = await $`echo "Hello"`.text();

// Quiet mode (no stdout)
await $`echo "Hello"`.quiet();

// Get stdout/stderr as buffers
const { stdout, stderr } = await $`echo "Hello"`.quiet();
```

## Reading Output

```typescript
// As string
const text = await $`echo "Hello"`.text();

// As JSON
const data = await $`echo '{"key": "value"}'`.json();

// As Blob
const blob = await $`echo "Hello"`.blob();

// Line by line (streaming)
for await (const line of $`cat file.txt`.lines()) {
  console.log(line);
}

// Raw buffers
const { stdout, stderr } = await $`command`.quiet();
stdout.toString();  // Convert buffer to string
```

## Error Handling

```typescript
// Default: throws on non-zero exit
try {
  await $`failing-command`.text();
} catch (err) {
  console.log(err.exitCode);
  console.log(err.stdout.toString());
  console.log(err.stderr.toString());
}

// Don't throw on errors
const { exitCode, stdout, stderr } = await $`maybe-fails`.nothrow().quiet();
if (exitCode !== 0) {
  console.log("Command failed");
}

// Global configuration
$.nothrow();       // Disable throwing globally
$.throws(true);    // Re-enable throwing
$.throws(false);   // Same as $.nothrow()
```

## Piping

```typescript
// Pipe between commands
await $`echo "Hello World!" | wc -w`;

// Chain multiple pipes
await $`cat file.txt | grep "pattern" | sort | uniq`;

// Pipe from JavaScript objects
const response = new Response("hello");
await $`cat < ${response} | wc -w`;
```

## Redirection

### Output Redirection

```typescript
// Redirect stdout to file
await $`echo "content" > output.txt`;

// Append to file
await $`echo "more" >> output.txt`;

// Redirect stderr to file
await $`command 2> errors.txt`;

// Redirect both stdout and stderr
await $`command &> all-output.txt`;
await $`command &>> all-output.txt`;  // Append

// Redirect stdout to stderr
await $`echo "error" 1>&2`;

// Redirect stderr to stdout
await $`command 2>&1`;
```

### Input Redirection

```typescript
// From file
await $`cat < input.txt`;

// From JavaScript objects
const buffer = Buffer.from("data");
await $`cat < ${buffer}`;

const response = new Response("body");
await $`cat < ${response}`;

const file = Bun.file("data.txt");
await $`cat < ${file}`;
```

### Redirect to JavaScript Objects

```typescript
// Write to Buffer
const buffer = Buffer.alloc(100);
await $`echo "Hello" > ${buffer}`;

// Write to Bun.file
await $`echo "Hello" > ${Bun.file("output.txt")}`;
```

## Environment Variables

```typescript
// Inline environment variable
await $`FOO=bar bun -e 'console.log(process.env.FOO)'`;

// String interpolation (safely escaped)
const value = "bar123";
await $`FOO=${value} printenv FOO`;

// Per-command environment
await $`echo $FOO`.env({ ...process.env, FOO: "bar" });

// Global environment
$.env({ FOO: "bar" });
await $`echo $FOO`;  // bar

// Reset environment
$.env(undefined);
```

## Working Directory

```typescript
// Per-command directory
await $`pwd`.cwd("/tmp");  // /tmp

// Global default
$.cwd("/app");
await $`pwd`;  // /app

// Override global
await $`pwd`.cwd("/");  // /
```

## Command Substitution

```typescript
// Use $(command) syntax
await $`echo "Hash: $(git rev-parse HEAD)"`;

// Declare shell variables
await $`
  REV=$(git rev-parse HEAD)
  docker build -t myapp:$REV .
  echo "Built myapp:$REV"
`;
```

## Builtin Commands

Cross-platform commands implemented natively:

| Command | Description |
|---------|-------------|
| `cd` | Change directory |
| `ls` | List files |
| `rm` | Remove files/directories |
| `echo` | Print text |
| `pwd` | Print working directory |
| `cat` | Concatenate files |
| `touch` | Create empty file |
| `mkdir` | Create directory |
| `mv` | Move/rename files |
| `which` | Locate command |
| `exit` | Exit shell |
| `true` | Return success |
| `false` | Return failure |
| `yes` | Output string repeatedly |
| `seq` | Print sequence of numbers |
| `dirname` | Strip filename from path |
| `basename` | Strip directory from path |
| `bun` | Run bun in bun |

## Utilities

### Brace Expansion

```typescript
const commands = await $.braces(`echo {1,2,3}`);
// ["echo 1", "echo 2", "echo 3"]
```

### Escape Strings

```typescript
console.log($.escape('$(foo) `bar` "baz"'));
// \$(foo) \`bar\` \"baz\"
```

### Raw Strings (No Escaping)

```typescript
// Bypass escaping with raw object
await $`echo ${{ raw: '$(whoami)' }}`;
```

## Shell Script Files

Run `.sh` files with Bun Shell (cross-platform):

```bash
# script.sh
echo "Hello World! pwd=$(pwd)"
```

```bash
bun ./script.sh
# Works on macOS, Linux, and Windows
```

## Security

### Command Injection Protection

Bun Shell automatically escapes interpolated variables:

```typescript
const userInput = "file.txt; rm -rf /";

// SAFE: userInput is treated as single quoted string
await $`ls ${userInput}`;
// Tries to ls "file.txt; rm -rf /" as one filename
```

### Security Considerations

```typescript
// UNSAFE: Spawning a new shell bypasses protection
const input = "world; touch /tmp/pwned";
await $`bash -c "echo ${input}"`;  // Don't do this!

// UNSAFE: Argument injection (Bun can't control external programs)
const branch = "--upload-pack=echo pwned";
await $`git ls-remote origin ${branch}`;
// Always sanitize user input before passing to external commands
```

## Glob Patterns

```typescript
// Native glob support
await $`ls *.txt`;
await $`rm **/*.log`;
await $`cat {src,lib}/**/*.ts`;
```

## Concurrent Execution

Unlike bash, Bun Shell runs operations concurrently where possible for better performance.

## Features Summary

- **Cross-platform**: Works on Windows, Linux, macOS
- **Bash-like syntax**: Familiar redirects, pipes, environment variables
- **Native globs**: `**`, `*`, `{expansion}`
- **Template literals**: Easy variable interpolation
- **Auto-escaping**: Prevents command injection by default
- **JavaScript interop**: Use Response, Buffer, Blob, Bun.file as stdin/stdout
- **Concurrent execution**: Parallel operations where possible
