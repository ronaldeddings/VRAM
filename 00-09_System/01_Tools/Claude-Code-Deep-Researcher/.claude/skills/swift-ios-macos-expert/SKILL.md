---
name: swift-ios-macos-expert
description: Expert iOS/macOS development with Swift 6, SwiftUI, SwiftData, CloudKit, and modern Apple frameworks. Use when writing Swift code, building iOS/macOS apps, implementing SwiftData models, creating SwiftUI views, handling concurrency, or working with Apple platform APIs. Covers cross-platform patterns, testing, and Xcode workflows.
---

# Swift iOS/macOS Expert

Expert-level guidance for modern Apple platform development targeting iOS 18+/macOS 15+ with Swift 6.

## Cross-Platform First

**Critical Rule**: All features MUST work identically on iOS and macOS. Prefer `horizontalSizeClass` over `#if os()`.

```swift
@Environment(\.horizontalSizeClass) var sizeClass

var body: some View {
    if sizeClass == .compact {
        // iPhone/compact layout
    } else {
        // iPad/Mac/regular layout
    }
}
```

## SwiftData Models

### Basic Model Definition

```swift
@Model
final class Task {
    @Attribute(.unique) var id: UUID
    var title: String
    @Attribute(.spotlight) var content: String  // CoreSpotlight searchable
    var dueDate: Date?

    @Relationship(deleteRule: .nullify, inverse: \Project.tasks)
    var project: Project?

    init(title: String) {
        self.id = UUID()
        self.title = title
    }
}
```

### Relationship Patterns

| Delete Rule | Behavior | Use Case |
|-------------|----------|----------|
| `.cascade` | Deletes related objects | Parent → children |
| `.nullify` | Sets relationship to nil | Optional refs |
| `.deny` | Prevents deletion | Protect integrity |

**Bidirectional**: Set one side, SwiftData updates inverse automatically.

### Query Patterns

```swift
// Basic query with sorting
@Query(sort: \.dueDate) var tasks: [Task]

// Dynamic filtering
init(searchText: String) {
    let predicate = #Predicate<Task> { task in
        searchText.isEmpty || task.title.localizedStandardContains(searchText)
    }
    _tasks = Query(filter: predicate, sort: \.dueDate)
}
```

### Container Setup

```swift
@main
struct App: App {
    var body: some Scene {
        WindowGroup { ContentView() }
            .modelContainer(for: [Organization.self, Project.self, Task.self])
    }
}

// CloudKit sync
let config = ModelConfiguration(
    cloudKitDatabase: .private("iCloud.com.hackervalley.RonOS")
)
```

For advanced patterns: See [SWIFTDATA.md](SWIFTDATA.md)

## SwiftUI Patterns

### NavigationSplitView (3-Column)

```swift
NavigationSplitView {
    Sidebar()          // Column 1
} content: {
    ContentList()      // Column 2
} detail: {
    DetailView()       // Column 3
}
```

### @Bindable for Model Editing

```swift
struct TaskDetail: View {
    @Bindable var task: Task

    var body: some View {
        Form {
            TextField("Title", text: $task.title)
            DatePicker("Due", selection: $task.dueDate)
        }
    }
}
```

### Sheet Pattern

```swift
@State private var newTask: Task?

var body: some View {
    List { /* ... */ }
        .sheet(item: $newTask) { task in
            NavigationStack {
                TaskDetail(task: task, isNew: true)
                    .interactiveDismissDisabled()
            }
        }
}
```

For view patterns: See [SWIFTUI.md](SWIFTUI.md)

## Swift 6 Concurrency

### @MainActor Pattern

```swift
@MainActor
@Observable
final class AppState {
    var selectedDomain: Domain = .personal
    var isLoading = false
}
```

### ModelActor for Background Work

```swift
@ModelActor
actor DataService {
    func fetchTasks() async throws -> [Task] {
        let descriptor = FetchDescriptor<Task>(
            predicate: #Predicate { !$0.completed }
        )
        return try modelContext.fetch(descriptor)
    }
}
```

### Sendable Requirements

```swift
// Make models Sendable-safe
@Model
final class Task: @unchecked Sendable {
    // SwiftData models are implicitly Sendable when used correctly
}
```

For concurrency details: See [CONCURRENCY.md](CONCURRENCY.md)

## Service Layer Patterns

### EventKit (iOS 17+)

```swift
let store = EKEventStore()

// Full access (read/write)
try await store.requestFullAccessToEvents()

// Write-only (calendar creation)
try await store.requestWriteOnlyAccessToEvents()
```

### Contacts (iOS 18+)

```swift
let store = CNContactStore()

switch CNContactStore.authorizationStatus(for: .contacts) {
case .limited:
    // User selected specific contacts only
case .authorized:
    // Full access
case .denied, .notDetermined, .restricted:
    try await store.requestAccess(for: .contacts)
}
```

### UserNotifications

```swift
let center = UNUserNotificationCenter.current()
let settings = await center.notificationSettings()

if settings.authorizationStatus == .notDetermined {
    try await center.requestAuthorization(options: [.alert, .badge, .sound])
}
```

## Testing (Swift Testing)

### Basic Test

```swift
import Testing

@Test func taskCreation() {
    let task = Task(title: "Test")
    #expect(task.title == "Test")
    #expect(task.id != UUID())
}
```

### Parameterized Tests

```swift
@Test(arguments: ["", "  ", "\t"])
func emptyTitleValidation(title: String) {
    let task = Task(title: title)
    #expect(task.isValid == false)
}
```

### Async Testing

```swift
@Test func asyncDataFetch() async throws {
    let service = DataService(modelContainer: testContainer)
    let tasks = try await service.fetchTasks()
    #expect(tasks.isEmpty)
}
```

### SwiftData Test Setup

```swift
@MainActor
@Test func testWithSwiftData() throws {
    let config = ModelConfiguration(isStoredInMemoryOnly: true)
    let container = try ModelContainer(for: Task.self, configurations: [config])
    let context = container.mainContext

    let task = Task(title: "Test")
    context.insert(task)

    #expect(try context.fetch(FetchDescriptor<Task>()).count == 1)
}
```

For testing patterns: See [TESTING.md](TESTING.md)

## Xcode Build Commands

```bash
# macOS build
xcodebuild -scheme RonOS -destination 'platform=macOS'

# iOS Simulator
xcodebuild -scheme RonOS -destination 'platform=iOS Simulator,name=iPhone 16'

# Swift Package
swift build && swift test

# SwiftLint
swift package plugin --allow-writing-to-package-directory swiftlint
```

## Key Conventions

1. **Swift 6 strict concurrency**: `@MainActor`, `Sendable`, `@ModelActor`
2. **Use `@Query`** for data fetching, not manual state
3. **Use `@Bindable`** for model editing in detail views
4. **In-memory containers** for previews and tests
5. **Test on BOTH** iOS Simulator AND macOS before complete
6. **Prefer `horizontalSizeClass`** over `#if os()` for layouts

## Project Identifiers

```
Bundle ID:    com.hackervalley.RonOS
CloudKit:     iCloud.com.hackervalley.RonOS
App Group:    group.com.hackervalley.RonOS
```

## Reference Documentation

Local docs in this project:
- **SwiftData**: `DeveloperDocs/SwiftData/`
- **SwiftUI**: `DeveloperDocs/SwiftUI/`
- **CloudKit**: `DeveloperDocs/CloudKit/`
- **Testing**: `DeveloperDocs/Testing/`
- **Tutorials**: `DeveloperTutorials/`
