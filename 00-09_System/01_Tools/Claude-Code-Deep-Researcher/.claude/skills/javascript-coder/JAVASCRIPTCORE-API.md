# JavaScriptCore API Reference

Quick reference for JavaScriptCore APIs available in RonOS JavaScript development.

## Core Types

| Type | Purpose |
|------|---------|
| `JSContextRef` | JavaScript execution context |
| `JSGlobalContextRef` | Global context (top-level) |
| `JSContextGroupRef` | Thread-safe context grouping |
| `JSValueRef` | Any JavaScript value |
| `JSObjectRef` | JavaScript object |
| `JSStringRef` | JavaScript string |

## Context Functions

### JSContextGetGlobalContext
Get the global context from any context reference.

**Availability**: iOS 7.0+, macOS 10.7+

### JSContextGetGlobalObject
Access the global object (equivalent to `window` in browsers).

**Availability**: iOS 16.0+, macOS 10.5+

### JSContextGetGroup
Get the context group for thread-safe operations.

**Availability**: iOS 7.0+, macOS 10.6+

## Value Conversion

### JSValueToInt32 / JSValueToInt64
Convert JSValue to signed integer. Returns 0 on exception (ambiguous - always check exception pointer).

**Availability**: iOS 16.4+, macOS 13.3+

### JSValueToUInt32 / JSValueToUInt64
Convert JSValue to unsigned integer.

**Availability**: iOS 16.4+, macOS 13.3+

## BigInt Support (iOS 18+/macOS 15+)

### Creation Functions

```swift
// From Int64
JSBigIntCreateWithInt64(ctx, int64Value, &exception)

// From UInt64
JSBigIntCreateWithUInt64(ctx, uint64Value, &exception)

// From Double (must be integer value)
JSBigIntCreateWithDouble(ctx, doubleValue, &exception)

// From String (arbitrary precision)
JSBigIntCreateWithString(ctx, jsString, &exception)
```

### Type Detection

```swift
JSValueIsBigInt(ctx, jsValue) // Returns Bool
```

### Comparison

```swift
JSValueCompare(ctx, left, right, &exception) // Returns JSRelationCondition
JSValueCompareDouble(ctx, value, doubleValue, &exception)
JSValueCompareInt64(ctx, value, int64Value, &exception)
JSValueCompareUInt64(ctx, value, uint64Value, &exception)
```

## JSExport Protocol

Export Swift/ObjC classes to JavaScript:

```swift
@objc protocol TaskExports: JSExport {
    var title: String { get set }
    var dueDate: Date? { get set }
    var isComplete: Bool { get }

    func markComplete()
    func description() -> String

    init(title: String)
    static func create(title: String) -> Task
}

class Task: NSObject, TaskExports {
    // Implementation
}
```

### Selector Naming

Default conversion: `doX:withY:` becomes `doXWithY`

Custom naming with JSExportAs:
```objc
JSExportAs(doX, - (void)doX:(id)x withY:(id)y);
```

### Property Attributes

| ObjC Attribute | JS Descriptor |
|----------------|---------------|
| `readonly` | `writable: false, enumerable: false, configurable: true` |
| `readwrite` | `writable: true, enumerable: true, configurable: true` |

## Exception Handling Pattern

**Critical**: Always check exception pointer after calls.

```swift
var exception: JSValueRef? = nil
let result = JSValueToInt64(ctx, jsValue, &exception)

// Return value of 0 is ambiguous - must check exception
if exception != nil {
    // Handle error
    return
}

// Safe to use result
```

## Platform Availability Summary

| API | iOS | macOS |
|-----|-----|-------|
| Core Context APIs | 7.0+ | 10.6+ |
| Global Object | 16.0+ | 10.5+ |
| Integer Conversion | 16.4+ | 13.3+ |
| BigInt | 18.0+ | 15.0+ |
| Value Comparison | 18.0+ | 15.0+ |

## JXA-Specific Globals

In JXA (`osascript -l JavaScript`), these are available:

| Global | Purpose |
|--------|---------|
| `Application(name)` | Get application reference |
| `ObjC.import(framework)` | Import ObjC framework |
| `$` | ObjC bridge namespace |
| `$.NSString`, `$.NSData`, etc. | Foundation classes |
| `Automation` | Automation scripting bridge |

## JSC CLI Globals

In JSC command-line (`jsc` command):

| Global | Purpose |
|--------|---------|
| `print(msg)` | Output to stdout |
| `readline()` | Read line from stdin |
| `load(path)` | Load and execute JS file |
| `quit()` | Exit interpreter |
| `gc()` | Force garbage collection |
