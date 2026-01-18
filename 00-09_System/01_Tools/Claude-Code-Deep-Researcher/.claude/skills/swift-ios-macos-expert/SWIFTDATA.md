# SwiftData Advanced Patterns

Deep reference for SwiftData patterns in iOS 18+/macOS 15+.

## Model Attributes

```swift
@Model
final class Task {
    @Attribute(.unique) var id: UUID              // Enforces uniqueness, enables upsert
    @Attribute(.spotlight) var title: String      // CoreSpotlight searchable
    @Attribute(.transient) var tempValue: Int     // Never persisted
    @Attribute(.externalStorage) var image: Data? // Large data stored externally
    @Attribute(.indexed) var projectID: UUID      // Database index for fast queries
    @Attribute(.originalName("old_name")) var newName: String  // Migration support
}
```

## Relationship Types

### One-to-Many

```swift
@Model
final class Project {
    var name: String
    @Relationship(deleteRule: .cascade, inverse: \Task.project)
    var tasks: [Task] = []
}

@Model
final class Task {
    var title: String
    @Relationship(deleteRule: .nullify, inverse: \Project.tasks)
    var project: Project?
}
```

### Many-to-Many

```swift
@Model
final class Tag {
    var name: String
    @Relationship(deleteRule: .none, inverse: \Task.tags)
    var tasks: [Task] = []
}

@Model
final class Task {
    var title: String
    @Relationship(deleteRule: .none, inverse: \Tag.tasks)
    var tags: [Tag] = []
}
```

### Relationship Constraints

```swift
@Relationship(
    deleteRule: .cascade,
    minimumModelCount: 1,  // Must have at least 1 related
    maximumModelCount: 10, // Cannot exceed 10 related
    inverse: \Project.tasks
)
var tasks: [Task]
```

## Advanced Queries

### Dynamic Predicate Construction

```swift
struct FilteredList: View {
    @Query var items: [Task]

    init(domain: Domain, showCompleted: Bool) {
        let predicate = #Predicate<Task> { task in
            task.domain == domain &&
            (showCompleted || !task.completed)
        }
        _items = Query(filter: predicate, sort: [
            SortDescriptor(\.priority, order: .reverse),
            SortDescriptor(\.dueDate)
        ])
    }
}
```

### Compound Predicates

```swift
let searchPredicate = #Predicate<Task> { task in
    let matchesSearch = searchText.isEmpty ||
        task.title.localizedStandardContains(searchText) ||
        task.notes.localizedStandardContains(searchText)

    let matchesDomain = selectedDomain == nil || task.domain == selectedDomain

    let matchesPriority = minimumPriority == 0 || task.priority >= minimumPriority

    return matchesSearch && matchesDomain && matchesPriority
}
```

### Fetch Descriptors (Programmatic)

```swift
func fetchUpcomingTasks() throws -> [Task] {
    let now = Date.now
    let nextWeek = Calendar.current.date(byAdding: .day, value: 7, to: now)!

    var descriptor = FetchDescriptor<Task>(
        predicate: #Predicate { task in
            task.dueDate != nil &&
            task.dueDate! >= now &&
            task.dueDate! <= nextWeek
        },
        sortBy: [SortDescriptor(\.dueDate)]
    )
    descriptor.fetchLimit = 20
    descriptor.propertiesToFetch = [\.title, \.dueDate]  // Partial fetch

    return try modelContext.fetch(descriptor)
}
```

## ModelContext Operations

### Insert with Upsert

```swift
// @Attribute(.unique) enables automatic upsert
let task = Task(id: serverID, title: "From Server")
modelContext.insert(task)  // Updates if exists, inserts if new
```

### Batch Operations

```swift
func markAllComplete(in project: Project) throws {
    for task in project.tasks {
        task.completed = true
    }
    try modelContext.save()
}
```

### Rollback

```swift
do {
    // Make changes
    task.title = "New Title"
    try modelContext.save()
} catch {
    modelContext.rollback()  // Revert all pending changes
}
```

## Migration Strategies

### Lightweight (Automatic)

Most changes are lightweight:
- Adding new properties with defaults
- Adding new relationships
- Renaming with `@Attribute(.originalName)`

### Custom Migration

```swift
enum SchemaMigrationPlan: VersionedSchemaMigrationPlan {
    static var schemas: [any VersionedSchema.Type] = [
        SchemaV1.self,
        SchemaV2.self,
        SchemaV3.self
    ]

    static var stages: [MigrationStage] = [
        .lightweight(fromVersion: SchemaV1.self, toVersion: SchemaV2.self),
        .custom(
            fromVersion: SchemaV2.self,
            toVersion: SchemaV3.self,
            willMigrate: { context in
                // Pre-migration cleanup
            },
            didMigrate: { context in
                // Post-migration data transformation
                let tasks = try context.fetch(FetchDescriptor<Task>())
                for task in tasks {
                    task.priority = calculateNewPriority(task)
                }
                try context.save()
            }
        )
    ]
}
```

## CloudKit Integration

### Basic Setup

```swift
let config = ModelConfiguration(
    cloudKitDatabase: .private("iCloud.com.hackervalley.RonOS")
)
let container = try ModelContainer(
    for: [Organization.self, Project.self, Task.self],
    configurations: [config]
)
```

### Unique IDs for Sync

```swift
@Model
final class ServerEntity {
    @Attribute(.unique) var serverID: String  // Server-assigned ID
    var localID: UUID = UUID()
    var title: String

    // Insert auto-upserts based on serverID
}
```

## Sample Data Pattern

```swift
@MainActor
final class SampleData {
    static let shared = SampleData()

    let modelContainer: ModelContainer

    var context: ModelContext { modelContainer.mainContext }

    private init() {
        let schema = Schema([Organization.self, Project.self, Task.self])
        let config = ModelConfiguration(isStoredInMemoryOnly: true)

        do {
            modelContainer = try ModelContainer(for: schema, configurations: [config])
            insertSampleData()
        } catch {
            fatalError("Failed: \(error)")
        }
    }

    private func insertSampleData() {
        let org = Organization(name: "Hacker Valley")
        context.insert(org)

        let project = Project(name: "Podcast", organization: org)
        context.insert(project)

        try? context.save()
    }
}

// Preview usage
#Preview {
    ContentView()
        .modelContainer(SampleData.shared.modelContainer)
}
```

## Performance Tips

1. **Use `@Attribute(.indexed)`** on frequently filtered properties
2. **Use `fetchLimit`** for large datasets
3. **Use `propertiesToFetch`** for partial fetches
4. **Batch saves** instead of saving after each change
5. **Sort in `@Query`** rather than in-memory
6. **Use relationships** instead of manual ID lookups
