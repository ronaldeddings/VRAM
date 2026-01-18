# Swift 6 Concurrency Patterns

Deep reference for Swift 6 strict concurrency in iOS 18+/macOS 15+.

## Core Concepts

### Actors

Actors provide data race safety by isolating their mutable state.

```swift
actor DataService {
    private var cache: [String: Data] = [:]

    func getData(for key: String) async -> Data? {
        if let cached = cache[key] { return cached }

        let data = await fetchFromServer(key)
        cache[key] = data
        return data
    }
}

// Usage - always async
let service = DataService()
let data = await service.getData(for: "user-123")
```

### @MainActor

Isolates code to the main thread for UI updates.

```swift
@MainActor
@Observable
final class AppState {
    var isLoading = false
    var errorMessage: String?

    func loadData() async {
        isLoading = true
        defer { isLoading = false }

        do {
            // Async work
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
```

### Sendable

Types that can safely cross actor boundaries.

```swift
// Value types are implicitly Sendable
struct TaskData: Sendable {
    let id: UUID
    let title: String
}

// Reference types need explicit conformance
final class Configuration: Sendable {
    let apiKey: String  // Only immutable properties allowed

    init(apiKey: String) {
        self.apiKey = apiKey
    }
}

// Unchecked Sendable (use carefully)
final class UnsafeWrapper: @unchecked Sendable {
    var mutableValue: Int = 0  // You must ensure thread safety manually
}
```

## SwiftData Concurrency

### ModelActor Pattern

```swift
@ModelActor
actor DataService {
    // modelContext is provided automatically and isolated to this actor

    func createTask(title: String) throws -> PersistentIdentifier {
        let task = Task(title: title)
        modelContext.insert(task)
        try modelContext.save()
        return task.persistentModelID
    }

    func fetchTasks(matching predicate: Predicate<Task>) throws -> [Task] {
        let descriptor = FetchDescriptor<Task>(predicate: predicate)
        return try modelContext.fetch(descriptor)
    }

    func updateTask(id: PersistentIdentifier, title: String) throws {
        guard let task = modelContext[id, as: Task.self] else { return }
        task.title = title
        try modelContext.save()
    }
}

// Usage
let service = DataService(modelContainer: container)
let taskID = try await service.createTask(title: "New Task")
```

### Crossing Actor Boundaries

```swift
@ModelActor
actor BackgroundService {
    func processTask(id: PersistentIdentifier) async throws -> TaskData {
        guard let task = modelContext[id, as: Task.self] else {
            throw ServiceError.notFound
        }

        // Return Sendable data, not the model itself
        return TaskData(id: task.id, title: task.title)
    }
}

@MainActor
class ViewModel {
    func loadTask(id: PersistentIdentifier) async throws {
        let service = BackgroundService(modelContainer: container)
        let taskData = try await service.processTask(id: id)
        // Update UI with taskData
    }
}
```

## Task Patterns

### Structured Concurrency

```swift
func loadAllData() async throws {
    // Parallel execution
    async let users = fetchUsers()
    async let projects = fetchProjects()
    async let tasks = fetchTasks()

    let (u, p, t) = try await (users, projects, tasks)
}
```

### TaskGroup

```swift
func fetchAllImages(urls: [URL]) async throws -> [UIImage] {
    try await withThrowingTaskGroup(of: UIImage.self) { group in
        for url in urls {
            group.addTask {
                let (data, _) = try await URLSession.shared.data(from: url)
                guard let image = UIImage(data: data) else {
                    throw ImageError.invalidData
                }
                return image
            }
        }

        var images: [UIImage] = []
        for try await image in group {
            images.append(image)
        }
        return images
    }
}
```

### Task Cancellation

```swift
func loadData() async throws {
    for url in urls {
        // Check for cancellation
        try Task.checkCancellation()

        // Or handle gracefully
        if Task.isCancelled { break }

        await processURL(url)
    }
}

// Cancel from outside
let task = Task {
    try await loadData()
}
task.cancel()
```

### Detached Tasks

```swift
// Fire-and-forget background work
Task.detached(priority: .background) {
    await cleanupOldData()
}

// Don't inherit actor context
@MainActor
func startBackgroundWork() {
    Task.detached {
        // Not on main actor
        await heavyProcessing()
    }
}
```

## AsyncSequence

### For-await-in

```swift
let stream = AsyncStream<Int> { continuation in
    for i in 1...10 {
        continuation.yield(i)
    }
    continuation.finish()
}

for await value in stream {
    print(value)
}
```

### Notification Center

```swift
for await notification in NotificationCenter.default.notifications(named: .dataDidChange) {
    await handleDataChange(notification)
}
```

## Isolation Patterns

### nonisolated

```swift
actor DataManager {
    let configuration: Configuration  // Immutable

    // Can be called synchronously
    nonisolated var configName: String {
        configuration.name
    }

    // Async required for mutable state
    func getData() async -> Data { /* ... */ }
}
```

### Isolated Parameters

```swift
func process(data: isolated DataManager) async {
    // Can access DataManager's isolated state synchronously
    let result = data.internalState
}
```

## Common Patterns

### ViewModel with @MainActor

```swift
@MainActor
@Observable
final class TaskListViewModel {
    private let service: DataService

    var tasks: [Task] = []
    var isLoading = false
    var error: Error?

    init(service: DataService) {
        self.service = service
    }

    func load() async {
        isLoading = true
        defer { isLoading = false }

        do {
            tasks = try await service.fetchTasks()
        } catch {
            self.error = error
        }
    }
}
```

### SwiftUI Task Modifier

```swift
struct TaskListView: View {
    @State private var viewModel = TaskListViewModel()

    var body: some View {
        List(viewModel.tasks) { task in
            TaskRow(task: task)
        }
        .task {
            await viewModel.load()
        }
        .refreshable {
            await viewModel.load()
        }
    }
}
```

### Debouncing

```swift
@MainActor
class SearchViewModel {
    private var searchTask: Task<Void, Never>?

    func search(query: String) {
        searchTask?.cancel()

        searchTask = Task {
            try? await Task.sleep(for: .milliseconds(300))

            guard !Task.isCancelled else { return }

            await performSearch(query)
        }
    }
}
```

## Migration Tips

### From Combine

```swift
// Before (Combine)
cancellable = publisher
    .sink { value in
        self.handleValue(value)
    }

// After (async/await)
Task {
    for await value in asyncSequence {
        handleValue(value)
    }
}
```

### From Completion Handlers

```swift
// Before
func fetchData(completion: @escaping (Result<Data, Error>) -> Void) {
    // ...
}

// After
func fetchData() async throws -> Data {
    // ...
}

// Bridging old APIs
func fetchData() async throws -> Data {
    try await withCheckedThrowingContinuation { continuation in
        oldFetchData { result in
            continuation.resume(with: result)
        }
    }
}
```

## Error Handling

### Throwing vs Non-Throwing

```swift
// Throwing
func loadData() async throws -> Data {
    let (data, _) = try await URLSession.shared.data(from: url)
    return data
}

// Non-throwing (handles errors internally)
func loadDataSafely() async -> Data? {
    try? await loadData()
}
```

### Error Propagation

```swift
func processAllTasks() async throws {
    try await withThrowingTaskGroup(of: Void.self) { group in
        for task in tasks {
            group.addTask {
                try await process(task)  // Throws propagate to caller
            }
        }
        try await group.waitForAll()
    }
}
```
