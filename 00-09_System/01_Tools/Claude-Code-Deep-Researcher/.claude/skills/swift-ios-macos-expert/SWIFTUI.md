# SwiftUI Advanced Patterns

Deep reference for SwiftUI patterns in iOS 18+/macOS 15+.

## Navigation Patterns

### NavigationSplitView (Multi-Column)

```swift
struct ContentView: View {
    @State private var selectedOrg: Organization?
    @State private var selectedProject: Project?

    var body: some View {
        NavigationSplitView {
            // Sidebar (Column 1)
            OrganizationList(selection: $selectedOrg)
        } content: {
            // Content (Column 2)
            if let org = selectedOrg {
                ProjectList(organization: org, selection: $selectedProject)
            } else {
                ContentUnavailableView("Select Organization", systemImage: "building.2")
            }
        } detail: {
            // Detail (Column 3)
            if let project = selectedProject {
                ProjectDetail(project: project)
            } else {
                ContentUnavailableView("Select Project", systemImage: "folder")
            }
        }
        .navigationSplitViewStyle(.balanced)
    }
}
```

### NavigationStack with Path

```swift
struct TaskNavigationView: View {
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            TaskList()
                .navigationDestination(for: Task.self) { task in
                    TaskDetail(task: task)
                }
                .navigationDestination(for: Project.self) { project in
                    ProjectDetail(project: project)
                }
        }
    }
}
```

## State Management

### @State (Value Types)

```swift
@State private var searchText = ""
@State private var isShowingSheet = false
@State private var selectedItems: Set<UUID> = []
```

### @Binding (Two-Way)

```swift
struct SearchBar: View {
    @Binding var text: String

    var body: some View {
        TextField("Search", text: $text)
    }
}

// Parent passes binding
SearchBar(text: $searchText)
```

### @Bindable (SwiftData Models)

```swift
struct TaskDetail: View {
    @Bindable var task: Task  // Creates bindings to model properties

    var body: some View {
        Form {
            TextField("Title", text: $task.title)
            Toggle("Completed", isOn: $task.completed)
        }
    }
}
```

### @Observable Pattern

```swift
@Observable
final class AppState {
    var selectedDomain: Domain = .personal
    var isLoading = false

    // Computed property (auto-tracked)
    var canSave: Bool { !isLoading }
}

struct ContentView: View {
    @State private var appState = AppState()

    var body: some View {
        // Pass to child views
        ChildView()
            .environment(appState)
    }
}

struct ChildView: View {
    @Environment(AppState.self) private var appState

    var body: some View {
        if appState.isLoading {
            ProgressView()
        }
    }
}
```

## List Patterns

### Swipe Actions

```swift
List {
    ForEach(tasks) { task in
        TaskRow(task: task)
            .swipeActions(edge: .trailing, allowsFullSwipe: true) {
                Button(role: .destructive) {
                    modelContext.delete(task)
                } label: {
                    Label("Delete", systemImage: "trash")
                }
            }
            .swipeActions(edge: .leading) {
                Button {
                    task.completed.toggle()
                } label: {
                    Label(task.completed ? "Incomplete" : "Complete",
                          systemImage: task.completed ? "circle" : "checkmark.circle")
                }
                .tint(task.completed ? .orange : .green)
            }
    }
}
```

### Selection

```swift
@State private var selection: Set<Task.ID> = []

List(selection: $selection) {
    ForEach(tasks) { task in
        TaskRow(task: task)
            .tag(task.id)
    }
}
.toolbar {
    EditButton()
}
```

### Sections

```swift
List {
    ForEach(groupedTasks.keys.sorted(), id: \.self) { date in
        Section(date.formatted(.dateTime.month().day())) {
            ForEach(groupedTasks[date] ?? []) { task in
                TaskRow(task: task)
            }
        }
    }
}
```

## Form Patterns

### Pickers

```swift
Form {
    Picker("Domain", selection: $task.domain) {
        ForEach(Domain.allCases, id: \.self) { domain in
            Text(domain.rawValue).tag(domain)
        }
    }

    // Optional relationship picker
    Picker("Project", selection: $task.project) {
        Text("None").tag(nil as Project?)
        ForEach(projects) { project in
            Text(project.name).tag(project as Project?)
        }
    }
}
```

### Date Picker

```swift
DatePicker("Due Date", selection: $dueDate, displayedComponents: [.date, .hourAndMinute])
    .datePickerStyle(.graphical)
```

### Toggle Styles

```swift
Toggle("Enabled", isOn: $isEnabled)
    .toggleStyle(.switch)  // Default
    .toggleStyle(.button)  // Button style
```

## Sheet & Alert Patterns

### Sheet with Item Binding

```swift
@State private var taskToEdit: Task?

var body: some View {
    List(tasks) { task in
        TaskRow(task: task)
            .onTapGesture { taskToEdit = task }
    }
    .sheet(item: $taskToEdit) { task in
        NavigationStack {
            TaskDetail(task: task)
        }
    }
}
```

### Confirmation Dialog

```swift
@State private var showDeleteConfirmation = false
@State private var taskToDelete: Task?

var body: some View {
    List { /* ... */ }
        .confirmationDialog(
            "Delete Task?",
            isPresented: $showDeleteConfirmation,
            presenting: taskToDelete
        ) { task in
            Button("Delete", role: .destructive) {
                modelContext.delete(task)
            }
        } message: { task in
            Text("Delete '\(task.title)'? This cannot be undone.")
        }
}
```

### Alert

```swift
@State private var showError = false
@State private var errorMessage = ""

var body: some View {
    ContentView()
        .alert("Error", isPresented: $showError) {
            Button("OK") { }
        } message: {
            Text(errorMessage)
        }
}
```

## Layout Patterns

### Adaptive Grids

```swift
let columns = [GridItem(.adaptive(minimum: 150, maximum: 300))]

LazyVGrid(columns: columns, spacing: 16) {
    ForEach(projects) { project in
        ProjectCard(project: project)
    }
}
```

### ViewThatFits

```swift
ViewThatFits {
    HStack {
        Image(systemName: "folder")
        Text(project.name)
        Spacer()
        Text(project.taskCount, format: .number)
    }

    VStack {
        Image(systemName: "folder")
        Text(project.name)
    }
}
```

### Size Classes

```swift
@Environment(\.horizontalSizeClass) var sizeClass

var body: some View {
    if sizeClass == .compact {
        // iPhone portrait
        TabView { /* ... */ }
    } else {
        // iPad/Mac
        NavigationSplitView { /* ... */ }
    }
}
```

## Toolbar Patterns

```swift
.toolbar {
    ToolbarItem(placement: .primaryAction) {
        Button("Add", systemImage: "plus") { addTask() }
    }

    ToolbarItem(placement: .cancellationAction) {
        Button("Cancel") { dismiss() }
    }

    ToolbarItem(placement: .confirmationAction) {
        Button("Save") { save() }
    }

    ToolbarItemGroup(placement: .bottomBar) {
        Spacer()
        Text("\(tasks.count) tasks")
        Spacer()
    }
}
```

## Search

```swift
@State private var searchText = ""
@Query var tasks: [Task]

var filteredTasks: [Task] {
    guard !searchText.isEmpty else { return tasks }
    return tasks.filter { $0.title.localizedCaseInsensitiveContains(searchText) }
}

var body: some View {
    List(filteredTasks) { task in
        TaskRow(task: task)
    }
    .searchable(text: $searchText, prompt: "Search tasks")
}
```

## Focus State

```swift
@FocusState private var isTitleFocused: Bool

var body: some View {
    Form {
        TextField("Title", text: $title)
            .focused($isTitleFocused)
    }
    .onAppear {
        isTitleFocused = true  // Auto-focus
    }
}
```

## Animation

```swift
Button("Toggle") {
    withAnimation(.spring(duration: 0.3)) {
        isExpanded.toggle()
    }
}

// Implicit animation
Text(task.title)
    .animation(.default, value: task.completed)
```

## Empty States

```swift
Group {
    if tasks.isEmpty {
        ContentUnavailableView {
            Label("No Tasks", systemImage: "checklist")
        } description: {
            Text("Add your first task to get started.")
        } actions: {
            Button("Add Task") { addTask() }
        }
    } else {
        List(tasks) { /* ... */ }
    }
}
```
