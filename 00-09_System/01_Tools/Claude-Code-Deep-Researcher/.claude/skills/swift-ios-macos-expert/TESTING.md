# Swift Testing Patterns

Deep reference for Swift Testing framework in iOS 18+/macOS 15+.

## Swift Testing Basics

### Test Declaration

```swift
import Testing

@Test func basicTest() {
    let result = 2 + 2
    #expect(result == 4)
}

@Test("Descriptive test name")
func testWithName() {
    #expect(true)
}
```

### Expectations

```swift
@Test func expectations() {
    // Basic equality
    #expect(value == expected)

    // Boolean
    #expect(condition)
    #expect(!falseCondition)

    // Optional
    #expect(optional != nil)

    // Throws
    #expect(throws: MyError.self) {
        try throwingFunction()
    }

    // Does not throw
    #expect(throws: Never.self) {
        try safeFunction()
    }
}
```

### Required Expectations

```swift
@Test func requiredExpectation() throws {
    // Stops test if fails (like XCTUnwrap)
    let value = try #require(optionalValue)

    // Continue with unwrapped value
    #expect(value.count > 0)
}
```

## Parameterized Tests

### Basic Parameters

```swift
@Test(arguments: ["Alice", "Bob", "Charlie"])
func validateName(_ name: String) {
    #expect(!name.isEmpty)
    #expect(name.count <= 50)
}
```

### Multiple Arguments

```swift
@Test(arguments: [1, 2, 3], ["a", "b"])
func multipleArgs(number: Int, letter: String) {
    #expect(number > 0)
    #expect(!letter.isEmpty)
}
```

### Custom Test Cases

```swift
struct TaskTestCase {
    let title: String
    let isValid: Bool
}

extension TaskTestCase: CustomTestStringConvertible {
    var testDescription: String { "Task: \(title)" }
}

@Test(arguments: [
    TaskTestCase(title: "Valid", isValid: true),
    TaskTestCase(title: "", isValid: false),
    TaskTestCase(title: "   ", isValid: false)
])
func validateTask(_ testCase: TaskTestCase) {
    let task = Task(title: testCase.title)
    #expect(task.isValid == testCase.isValid)
}
```

## Async Testing

### Basic Async

```swift
@Test func asyncTest() async throws {
    let result = try await asyncFunction()
    #expect(result.count > 0)
}
```

### With Timeout

```swift
@Test(.timeLimit(.minutes(1)))
func longRunningTest() async throws {
    let result = try await slowOperation()
    #expect(result != nil)
}
```

### Confirmation (Async Expectations)

```swift
@Test func notificationReceived() async {
    await confirmation("Notification received") { confirm in
        NotificationCenter.default.addObserver(
            forName: .dataDidUpdate,
            object: nil,
            queue: nil
        ) { _ in
            confirm()
        }

        triggerNotification()
    }
}

// Multiple confirmations
@Test func multipleEvents() async {
    await confirmation("Events received", expectedCount: 3) { confirm in
        for _ in 1...3 {
            await sendEvent()
            confirm()
        }
    }
}
```

## Test Organization

### Test Suites

```swift
@Suite("Task Management")
struct TaskTests {
    @Test func creation() { /* ... */ }
    @Test func deletion() { /* ... */ }
}

@Suite("Nested Suites")
struct OuterSuite {
    @Suite struct InnerSuite {
        @Test func nestedTest() { /* ... */ }
    }
}
```

### Tags

```swift
extension Tag {
    @Tag static var model: Self
    @Tag static var viewModel: Self
    @Tag static var integration: Self
}

@Test(.tags(.model))
func modelTest() { /* ... */ }

@Test(.tags(.viewModel, .integration))
func integrationTest() { /* ... */ }
```

### Traits

```swift
// Disabled test
@Test(.disabled("Waiting for API fix"))
func disabledTest() { /* ... */ }

// Bug reference
@Test(.bug("https://github.com/org/repo/issues/123"))
func bugTest() { /* ... */ }

// Conditional
@Test(.enabled(if: ProcessInfo.processInfo.environment["CI"] != nil))
func ciOnlyTest() { /* ... */ }
```

## SwiftData Testing

### In-Memory Container

```swift
@MainActor
@Test func swiftDataTest() throws {
    let config = ModelConfiguration(isStoredInMemoryOnly: true)
    let container = try ModelContainer(
        for: Task.self, Project.self,
        configurations: [config]
    )
    let context = container.mainContext

    // Create test data
    let project = Project(name: "Test")
    context.insert(project)

    let task = Task(title: "Test Task")
    task.project = project
    context.insert(task)

    // Test
    let fetchedTasks = try context.fetch(FetchDescriptor<Task>())
    #expect(fetchedTasks.count == 1)
    #expect(fetchedTasks.first?.project?.name == "Test")
}
```

### Test Helper

```swift
@MainActor
struct TestContainer {
    let container: ModelContainer
    var context: ModelContext { container.mainContext }

    init() throws {
        let config = ModelConfiguration(isStoredInMemoryOnly: true)
        container = try ModelContainer(
            for: Task.self, Project.self, Organization.self,
            configurations: [config]
        )
    }

    func addTask(title: String) -> Task {
        let task = Task(title: title)
        context.insert(task)
        return task
    }
}

@MainActor
@Test func usingHelper() throws {
    let test = try TestContainer()
    let task = test.addTask(title: "Test")

    #expect(task.id != UUID())
    #expect(task.title == "Test")
}
```

## Mocking Patterns

### Protocol-Based Mocking

```swift
protocol DataServiceProtocol {
    func fetchTasks() async throws -> [Task]
}

struct MockDataService: DataServiceProtocol {
    var tasksToReturn: [Task] = []
    var errorToThrow: Error?

    func fetchTasks() async throws -> [Task] {
        if let error = errorToThrow {
            throw error
        }
        return tasksToReturn
    }
}

@Test func viewModelWithMock() async throws {
    var mock = MockDataService()
    mock.tasksToReturn = [Task(title: "Test")]

    let viewModel = TaskViewModel(service: mock)
    await viewModel.load()

    #expect(viewModel.tasks.count == 1)
}
```

### Spy Pattern

```swift
final class SpyDataService: DataServiceProtocol {
    var fetchTasksCalled = false
    var fetchTasksCallCount = 0

    func fetchTasks() async throws -> [Task] {
        fetchTasksCalled = true
        fetchTasksCallCount += 1
        return []
    }
}

@Test func viewModelCallsService() async {
    let spy = SpyDataService()
    let viewModel = TaskViewModel(service: spy)

    await viewModel.load()

    #expect(spy.fetchTasksCalled)
    #expect(spy.fetchTasksCallCount == 1)
}
```

## Migration from XCTest

### Comparison

| XCTest | Swift Testing |
|--------|---------------|
| `XCTestCase` | `@Suite` |
| `func test...()` | `@Test func` |
| `XCTAssertEqual` | `#expect(a == b)` |
| `XCTAssertTrue` | `#expect(condition)` |
| `XCTAssertThrows` | `#expect(throws:)` |
| `XCTUnwrap` | `try #require()` |
| `setUp/tearDown` | `init/deinit` |
| `expectation/wait` | `await confirmation()` |

### XCTest Interop

```swift
// Can mix XCTest and Swift Testing in same target
import XCTest
import Testing

final class LegacyTests: XCTestCase {
    func testOldStyle() {
        XCTAssertEqual(1 + 1, 2)
    }
}

@Test func newStyle() {
    #expect(1 + 1 == 2)
}
```

## Best Practices

### Test Naming

```swift
@Test("Creating a task with empty title should be invalid")
func createTaskEmptyTitle() {
    let task = Task(title: "")
    #expect(!task.isValid)
}
```

### Arrange-Act-Assert

```swift
@Test func completeTask() {
    // Arrange
    let task = Task(title: "Test")

    // Act
    task.complete()

    // Assert
    #expect(task.isCompleted)
    #expect(task.completedDate != nil)
}
```

### Test Isolation

```swift
@Suite struct TaskTests {
    // Each test gets fresh state via init
    let container: TestContainer

    init() throws {
        container = try TestContainer()
    }

    @Test func test1() {
        // Uses fresh container
    }

    @Test func test2() {
        // Uses fresh container
    }
}
```

### Running Tests

```bash
# Run all tests
swift test

# Run specific test
swift test --filter TaskTests

# Xcode
# Cmd+U to run all
# Click diamond next to test to run single test

# Parallel execution (default)
swift test --parallel

# Serial execution
swift test --no-parallel
```
