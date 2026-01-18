# Bun SQLite Reference

Complete reference for `bun:sqlite` - Bun's high-performance SQLite driver.

## Database Connection

```typescript
import { Database } from "bun:sqlite";

// File-based database
const db = new Database("app.db");

// In-memory database
const db = new Database(":memory:");
const db = new Database();  // Also in-memory

// Options
const db = new Database("app.db", {
  readonly: true,      // Open read-only
  create: true,        // Create if doesn't exist
  readwrite: true,     // Open for reading and writing
  safeIntegers: true,  // Return bigint for large integers
  strict: true,        // Throw on missing params, allow binding without prefix
});
```

### Import Syntax

```typescript
import db from "./app.sqlite" with { type: "sqlite" };
```

### Close Database

```typescript
db.close();       // Allow pending queries to finish
db.close(true);   // Throw if pending queries

// Using statement (auto-close)
{
  using db = new Database("app.db");
  // db is closed when block exits
}
```

## Queries

### Prepare Statement

```typescript
// Cached statement (recommended)
const query = db.query("SELECT * FROM users WHERE id = ?");

// Non-cached statement
const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
```

### Execute and Get Results

```typescript
const query = db.query("SELECT * FROM users WHERE active = ?");

// Get first row as object
const user = query.get(true);
// { id: 1, name: "Alice", active: true }

// Get all rows as array of objects
const users = query.all(true);
// [{ id: 1, ... }, { id: 2, ... }]

// Get all rows as array of arrays
const rows = query.values(true);
// [[1, "Alice", true], [2, "Bob", true]]

// Execute without returning results
const result = query.run(true);
// { lastInsertRowid: 0, changes: 0 }

// Iterate rows (memory efficient)
for (const row of query.iterate(true)) {
  console.log(row);
}
```

### Direct Execution

```typescript
// Run without preparing
db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");
db.exec("INSERT INTO users (name) VALUES ('Alice')");
```

## Parameters

### Positional Parameters

```typescript
const query = db.query("SELECT * FROM users WHERE id = ?1 AND active = ?2");
query.get(1, true);
// or
query.get(1, true);
```

### Named Parameters

```typescript
// Default: include prefix in binding
const query = db.query("SELECT * FROM users WHERE name = $name");
query.get({ $name: "Alice" });

// With strict: true, omit prefix
const db = new Database(":memory:", { strict: true });
const query = db.query("SELECT * FROM users WHERE name = $name");
query.get({ name: "Alice" });  // No $ needed
```

### Supported Prefixes

```typescript
db.query("SELECT $param, :param, @param");
```

## Data Types

| JavaScript | SQLite |
|------------|--------|
| `string` | TEXT |
| `number` | INTEGER or DECIMAL |
| `boolean` | INTEGER (1 or 0) |
| `Uint8Array` | BLOB |
| `Buffer` | BLOB |
| `bigint` | INTEGER |
| `null` | NULL |

### BigInt Support

```typescript
// Default: returns number (may lose precision)
const db = new Database(":memory:");

// Safe: returns bigint for large integers
const db = new Database(":memory:", { safeIntegers: true });
const result = db.query("SELECT 9007199254741093").get();
// { "9007199254741093": 9007199254741093n }
```

## Map Results to Classes

```typescript
class User {
  id!: number;
  name!: string;

  get displayName() {
    return `User #${this.id}: ${this.name}`;
  }

  greet() {
    return `Hello, ${this.name}!`;
  }
}

const query = db.query("SELECT id, name FROM users").as(User);

const users = query.all();
users[0].displayName;  // "User #1: Alice"
users[0].greet();      // "Hello, Alice!"

// Note: Constructor is NOT called
```

## Transactions

```typescript
const insertUser = db.prepare("INSERT INTO users (name) VALUES (?)");

// Create transaction function
const insertMany = db.transaction((names: string[]) => {
  for (const name of names) {
    insertUser.run(name);
  }
  return names.length;
});

// Execute transaction
const count = insertMany(["Alice", "Bob", "Charlie"]);
// Commits on success, rolls back on error

// Transaction modes
insertMany(data);              // BEGIN
insertMany.deferred(data);     // BEGIN DEFERRED
insertMany.immediate(data);    // BEGIN IMMEDIATE
insertMany.exclusive(data);    // BEGIN EXCLUSIVE
```

### Nested Transactions (Savepoints)

```typescript
const outer = db.transaction(() => {
  insertUser.run("Alice");

  const inner = db.transaction(() => {
    insertUser.run("Bob");
    // This becomes a savepoint
  });

  inner();
});

outer();
```

## Statement Metadata

```typescript
const query = db.query("SELECT id, name FROM users");

query.columnNames;    // ["id", "name"]
query.paramsCount;    // Number of parameters

// After calling .get() or .all():
query.columnTypes;    // Based on actual values
query.declaredTypes;  // From CREATE TABLE schema
```

## WAL Mode

Enable Write-Ahead Logging for better concurrent performance:

```typescript
db.run("PRAGMA journal_mode = WAL;");
```

## Extensions

```typescript
// Load SQLite extension
db.loadExtension("./myextension");

// macOS: Use vanilla SQLite for extension support
Database.setCustomSQLite("/opt/homebrew/Cellar/sqlite/<version>/libsqlite3.dylib");
```

## Serialization

```typescript
// Serialize database to Uint8Array
const data = db.serialize();

// Deserialize from Uint8Array
const newDb = Database.deserialize(data);
```

## File Control

```typescript
import { Database, constants } from "bun:sqlite";

const db = new Database("app.db");

// Prevent WAL files from persisting
db.fileControl(constants.SQLITE_FCNTL_PERSIST_WAL, 0);
```

## Statement Methods

```typescript
const stmt = db.query("SELECT * FROM users");

stmt.get(...params);      // First row as object
stmt.all(...params);      // All rows as array
stmt.values(...params);   // All rows as arrays
stmt.run(...params);      // Execute, return metadata
stmt.iterate(...params);  // Iterator over rows

stmt.finalize();          // Free resources
stmt.toString();          // Expanded SQL (for debugging)

// With class mapping
stmt.as(MyClass).all();
```

## Practical Examples

### Create Table

```typescript
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);
```

### CRUD Operations

```typescript
// Create
const insert = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
const result = insert.run("Alice", "alice@example.com");
console.log(result.lastInsertRowid);

// Read
const getById = db.query("SELECT * FROM users WHERE id = ?");
const user = getById.get(1);

const getAll = db.query("SELECT * FROM users");
const users = getAll.all();

// Update
const update = db.prepare("UPDATE users SET name = ? WHERE id = ?");
update.run("Alice Smith", 1);

// Delete
const del = db.prepare("DELETE FROM users WHERE id = ?");
del.run(1);
```

### Bulk Insert with Transaction

```typescript
interface User {
  name: string;
  email: string;
}

const insert = db.prepare("INSERT INTO users (name, email) VALUES ($name, $email)");

const insertUsers = db.transaction((users: User[]) => {
  for (const user of users) {
    insert.run({ $name: user.name, $email: user.email });
  }
});

insertUsers([
  { name: "Alice", email: "alice@example.com" },
  { name: "Bob", email: "bob@example.com" },
]);
```

### Full-Text Search

```typescript
db.run(`
  CREATE VIRTUAL TABLE IF NOT EXISTS posts_fts USING fts5(title, content)
`);

const search = db.query(`
  SELECT * FROM posts_fts WHERE posts_fts MATCH ?
  ORDER BY rank
`);

const results = search.all("bun javascript");
```
