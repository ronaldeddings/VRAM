# Bun Test Runner Reference

Complete reference for `bun:test` - Bun's Jest-compatible test runner.

## Running Tests

```bash
# Run all tests
bun test

# Run specific files/directories
bun test src/
bun test src/utils.test.ts

# Filter by test name
bun test --test-name-pattern "should parse"

# Watch mode
bun test --watch

# Coverage
bun test --coverage

# Timeout (milliseconds)
bun test --timeout 30000

# Run only .only tests
bun test --only

# Run .todo tests
bun test --todo

# Bail on first failure
bun test --bail

# Rerun tests multiple times
bun test --rerun-each 3

# Randomize test order
bun test --randomize --seed 12345
```

## Basic Tests

```typescript
import { expect, test, describe } from "bun:test";

test("basic assertion", () => {
  expect(2 + 2).toBe(4);
});

describe("group", () => {
  test("nested test", () => {
    expect("hello").toContain("ell");
  });
});
```

## Async Tests

```typescript
// Async/await
test("async", async () => {
  const result = await Promise.resolve(42);
  expect(result).toBe(42);
});

// Done callback
test("callback", (done) => {
  setTimeout(() => {
    expect(true).toBe(true);
    done();
  }, 100);
});
```

## Test Modifiers

```typescript
// Skip test
test.skip("skipped", () => {});

// Mark as todo
test.todo("not implemented", () => {});

// Only run this test
test.only("focused", () => {});

// Conditional
test.if(condition)("runs if true", () => {});
test.skipIf(condition)("skips if true", () => {});
test.todoIf(condition)("todo if true", () => {});

// Expected to fail
test.failing("known bug", () => {
  expect(1).toBe(2);  // This "passes" because it fails
});
```

## Test Options

```typescript
// Timeout (milliseconds)
test("slow", async () => { ... }, 30000);

// Retry flaky tests
test("flaky", () => { ... }, { retry: 3 });

// Repeat for stability
test("stable", () => { ... }, { repeats: 10 });
```

## Parametrized Tests

```typescript
// test.each with arrays
test.each([
  [1, 2, 3],
  [2, 3, 5],
  [10, 20, 30],
])("add(%i, %i) = %i", (a, b, expected) => {
  expect(a + b).toBe(expected);
});

// test.each with objects
test.each([
  { a: 1, b: 2, sum: 3 },
  { a: 2, b: 3, sum: 5 },
])("add($a, $b) = $sum", ({ a, b, sum }) => {
  expect(a + b).toBe(sum);
});

// describe.each
describe.each([
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
])("User: $name", ({ name, age }) => {
  test("has correct age", () => {
    expect(age).toBeGreaterThan(0);
  });
});
```

### Format Specifiers

| Specifier | Description |
|-----------|-------------|
| `%p` | Pretty format |
| `%s` | String |
| `%d` | Number |
| `%i` | Integer |
| `%f` | Float |
| `%j` | JSON |
| `%o` | Object |
| `%#` | Test index |
| `%%` | Literal % |

## Lifecycle Hooks

```typescript
import { beforeAll, afterAll, beforeEach, afterEach } from "bun:test";

beforeAll(() => {
  // Setup before all tests in file
});

afterAll(() => {
  // Cleanup after all tests in file
});

beforeEach(() => {
  // Setup before each test
});

afterEach(() => {
  // Cleanup after each test
});

// Async hooks
beforeAll(async () => {
  await setupDatabase();
});

// Scoped to describe block
describe("database", () => {
  beforeEach(() => {
    // Only runs for tests in this block
  });
});
```

## Matchers

### Basic Matchers

```typescript
expect(value).toBe(exact);           // === comparison
expect(value).toEqual(deep);         // Deep equality
expect(value).toStrictEqual(deep);   // Strict deep equality
expect(value).not.toBe(x);           // Negation
```

### Truthiness

```typescript
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();
expect(value).toBeNaN();
```

### Numbers

```typescript
expect(n).toBeGreaterThan(x);
expect(n).toBeGreaterThanOrEqual(x);
expect(n).toBeLessThan(x);
expect(n).toBeLessThanOrEqual(x);
expect(n).toBeCloseTo(x, precision);
```

### Strings

```typescript
expect(str).toMatch(/regex/);
expect(str).toContain("substring");
expect(str).toHaveLength(n);
```

### Arrays

```typescript
expect(arr).toContain(item);
expect(arr).toContainEqual(obj);      // Deep equality
expect(arr).toHaveLength(n);
expect.arrayContaining([1, 2]);       // Partial match
```

### Objects

```typescript
expect(obj).toHaveProperty("key");
expect(obj).toHaveProperty("key", value);
expect(obj).toHaveProperty("a.b.c");  // Nested
expect(obj).toMatchObject({ key: value });
expect.objectContaining({ key: value });
```

### Functions and Errors

```typescript
expect(fn).toThrow();
expect(fn).toThrow("message");
expect(fn).toThrow(/regex/);
expect(fn).toThrow(ErrorClass);

expect(obj).toBeInstanceOf(Class);
```

### Promises

```typescript
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow("error");
```

### Mock Functions

```typescript
expect(mock).toHaveBeenCalled();
expect(mock).toHaveBeenCalledTimes(n);
expect(mock).toHaveBeenCalledWith(arg1, arg2);
expect(mock).toHaveBeenLastCalledWith(arg);
expect(mock).toHaveBeenNthCalledWith(n, arg);
expect(mock).toHaveReturned();
expect(mock).toHaveReturnedWith(value);
```

### Snapshots

```typescript
expect(value).toMatchSnapshot();
expect(value).toMatchInlineSnapshot(`"expected"`);
expect(fn).toThrowErrorMatchingSnapshot();
```

### Asymmetric Matchers

```typescript
expect(value).toEqual(expect.anything());
expect(value).toEqual(expect.any(Number));
expect(str).toEqual(expect.stringContaining("sub"));
expect(str).toEqual(expect.stringMatching(/regex/));
expect(arr).toEqual(expect.arrayContaining([1, 2]));
expect(obj).toEqual(expect.objectContaining({ key: value }));
```

## Assertion Counting

```typescript
test("must have assertions", () => {
  expect.hasAssertions();  // At least one
  expect.assertions(3);    // Exactly 3

  expect(1).toBe(1);
  expect(2).toBe(2);
  expect(3).toBe(3);
});
```

## Mocking

### Mock Functions

```typescript
import { mock, spyOn } from "bun:test";

const fn = mock(() => 42);

fn();
fn.mock.calls;        // [[]]
fn.mock.results;      // [{ type: "return", value: 42 }]
fn.mockReturnValue(100);
fn.mockImplementation(() => 200);
fn.mockClear();       // Clear history
fn.mockReset();       // Clear + reset implementation
```

### Spy on Methods

```typescript
const obj = { greet: () => "hello" };
const spy = spyOn(obj, "greet");

obj.greet();
expect(spy).toHaveBeenCalled();

spy.mockRestore();  // Restore original
```

### Mock Modules

```typescript
import { mock } from "bun:test";

mock.module("./api", () => ({
  fetchData: () => Promise.resolve({ data: "mocked" }),
}));
```

## Type Testing

```typescript
import { expectTypeOf } from "bun:test";

// Type assertions (checked by TypeScript, not at runtime)
expectTypeOf<string>().toEqualTypeOf<string>();
expectTypeOf(123).toBeNumber();
expectTypeOf("hello").toBeString();
expectTypeOf({ a: 1 }).toMatchObjectType<{ a: number }>();

// Function types
expectTypeOf(fn).toBeFunction();
expectTypeOf(fn).parameters.toEqualTypeOf<[string, number]>();
expectTypeOf(fn).returns.toEqualTypeOf<boolean>();

// Run type checking: bunx tsc --noEmit
```

## Configuration (bunfig.toml)

```toml
[test]
root = "./__tests__"
preload = ["./test-setup.ts"]
smol = true

# Coverage
coverage = true
coverageThreshold = 0.8
coverageThreshold = { line = 0.7, function = 0.8 }
coverageSkipTestFiles = true
coveragePathIgnorePatterns = ["**/*.spec.ts"]
coverageReporter = ["text", "lcov"]
coverageDir = "coverage"

# Test execution
randomize = true
seed = 12345
rerunEach = 3
concurrentTestGlob = "**/concurrent-*.test.ts"

# Reporter
[test.reporter]
dots = true
junit = "test-results.xml"
```

## Preload Scripts

```toml
# bunfig.toml
[test]
preload = ["./test-setup.ts"]
```

```typescript
// test-setup.ts
import { beforeAll } from "bun:test";

beforeAll(() => {
  globalThis.testDatabase = createTestDatabase();
});
```

## DOM Testing

```typescript
import { test, expect } from "bun:test";

test("DOM manipulation", () => {
  document.body.innerHTML = '<div id="app">Hello</div>';
  const app = document.getElementById("app");
  expect(app?.textContent).toBe("Hello");
});
```

Requires `happy-dom` or `jsdom`:

```bash
bun add -d happy-dom
```

```toml
# bunfig.toml
[test]
preload = ["happy-dom/global-register"]
```

## Code Coverage

```bash
bun test --coverage
```

```toml
# bunfig.toml
[test]
coverage = true
coverageReporter = ["text", "lcov"]
coverageDir = "coverage"
```

## Custom Matchers

```typescript
import { expect } from "bun:test";

expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be within range ${floor} - ${ceiling}`
          : `expected ${received} to be within range ${floor} - ${ceiling}`,
    };
  },
});

// Usage
expect(100).toBeWithinRange(90, 110);
```
