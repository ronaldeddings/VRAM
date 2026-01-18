# Bun Package Manager Reference

Complete reference for Bun's npm-compatible package manager - up to 25x faster than npm.

## Installing Dependencies

```bash
# Install all dependencies
bun install

# Install specific package
bun install react
bun install react@19.1.1      # Specific version
bun install react@latest      # Latest tag

# Add to devDependencies
bun add -d typescript
bun add --dev @types/react

# Add to optionalDependencies
bun add --optional package-name

# Add to peerDependencies
bun add --peer package-name

# Exact version (no ^ range)
bun add --exact lodash

# Global installation
bun install -g cowsay
bun add --global typescript
```

## Removing Dependencies

```bash
bun remove lodash
bun remove -g cowsay  # Global
```

## Production & CI/CD

```bash
# Production mode (skip devDependencies)
bun install --production

# Frozen lockfile (CI/CD - fail if lockfile outdated)
bun install --frozen-lockfile
bun ci                          # Alias for frozen-lockfile

# Dry run (don't actually install)
bun install --dry-run

# Omit specific dependency types
bun install --omit dev
bun install --omit=dev --omit=peer --omit=optional
```

## bunx (npx Alternative)

```bash
# Run package without installing
bunx cowsay "Hello"
bunx create-react-app my-app

# Force Bun runtime for Node CLIs
bunx --bun vite
bunx --bun next dev
```

## Workspaces (Monorepos)

```json
// package.json
{
  "workspaces": ["packages/*", "apps/*"]
}
```

```bash
# Install for specific workspaces
bun install --filter 'pkg-a'
bun install --filter './packages/pkg-a'
bun install --filter '!pkg-c'  # Exclude pkg-c
```

## Lockfile

Bun uses `bun.lock` (text-based since v1.2):

```bash
# Generate lockfile only
bun install --lockfile-only

# Save as text lockfile
bun install --save-text-lockfile

# Generate yarn.lock (v1 format)
bun install --yarn

# Upgrade from binary bun.lockb
bun install --save-text-lockfile --frozen-lockfile --lockfile-only
rm bun.lockb
```

## Installation Strategies

```bash
# Hoisted (traditional npm/Yarn flat structure)
bun install --linker hoisted

# Isolated (pnpm-like strict isolation)
bun install --linker isolated
```

**Defaults**:
- New workspaces/monorepos: `isolated`
- New single-package projects: `hoisted`
- Existing projects: `hoisted`

## Overrides & Resolutions

```json
// package.json
{
  "overrides": {
    "lodash": "4.17.21"
  },
  "resolutions": {
    "react": "18.2.0"
  }
}
```

## Non-npm Dependencies

```json
// package.json
{
  "dependencies": {
    "dayjs": "git+https://github.com/iamkun/dayjs.git",
    "lodash": "git+ssh://github.com/lodash/lodash.git#4.17.21",
    "zod": "github:colinhacks/zod",
    "react": "https://registry.npmjs.org/react/-/react-18.2.0.tgz",
    "bun-types": "npm:@types/bun"
  }
}
```

## Security

### Trusted Dependencies

```json
// package.json - allow lifecycle scripts
{
  "trustedDependencies": ["esbuild", "sharp"]
}
```

### Minimum Release Age

```bash
# Only install packages published 3+ days ago
bun add package --minimum-release-age 259200
```

```toml
# bunfig.toml
[install]
minimumReleaseAge = 259200
minimumReleaseAgeExcludes = ["@types/node", "typescript"]
```

## Cache Management

```bash
# Delete cache
bun pm cache rm
# or
rm -rf ~/.bun/install/cache
```

## Platform-Specific Options

```bash
# Target specific platform
bun install --cpu=x64 --os=linux

# Installation backends
bun install --backend hardlink     # Default on Linux
bun install --backend clonefile    # Default on macOS
bun install --backend copyfile     # Fallback
bun install --backend symlink      # For file: dependencies
```

## Logging & Output

```bash
bun install --verbose    # Debug logging
bun install --silent     # No logging
bun install --no-progress
bun install --no-summary
```

## Configuration (bunfig.toml)

```toml
[install]
# Dependency types
optional = true
dev = true
peer = true
production = false

# Lockfile
frozenLockfile = false
saveTextLockfile = false

# Performance
concurrentScripts = 16    # Lifecycle script parallelism
linker = "hoisted"        # or "isolated"

# Dry run
dryRun = false

# Security
minimumReleaseAge = 259200
minimumReleaseAgeExcludes = ["@types/node"]

[install.cache]
disable = false
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `BUN_CONFIG_REGISTRY` | Default npm registry |
| `BUN_CONFIG_TOKEN` | Auth token |
| `BUN_CONFIG_YARN_LOCKFILE` | Generate yarn.lock |
| `BUN_CONFIG_SKIP_SAVE_LOCKFILE` | Don't save lockfile |
| `BUN_CONFIG_SKIP_LOAD_LOCKFILE` | Don't read lockfile |
| `BUN_CONFIG_SKIP_INSTALL_PACKAGES` | Don't install packages |

## GitHub Actions

```yaml
# .github/workflows/ci.yml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun ci          # Frozen lockfile install
      - run: bun run build
      - run: bun test
```

## CLI Reference

### Dependency Flags

| Flag | Description |
|------|-------------|
| `--dev`, `-d` | Add to devDependencies |
| `--optional` | Add to optionalDependencies |
| `--peer` | Add to peerDependencies |
| `--exact` | Use exact version (no ^) |
| `--global`, `-g` | Install globally |

### Lockfile Flags

| Flag | Description |
|------|-------------|
| `--frozen-lockfile` | Fail if lockfile outdated |
| `--save-text-lockfile` | Text-based lockfile |
| `--lockfile-only` | Only generate lockfile |
| `--yarn` | Generate yarn.lock |
| `--no-save` | Don't update lockfile |

### Installation Flags

| Flag | Description |
|------|-------------|
| `--production` | Skip devDependencies |
| `--omit <type>` | Omit dev/peer/optional |
| `--force` | Reinstall all |
| `--dry-run` | Don't install |
| `--filter <pattern>` | Workspace filter |

### Performance Flags

| Flag | Description |
|------|-------------|
| `--concurrent-scripts <n>` | Max lifecycle script jobs |
| `--network-concurrency <n>` | Max network requests (default: 48) |
| `--backend <type>` | Installation method |
| `--no-cache` | Ignore cache |
| `--cache-dir <path>` | Custom cache directory |

## pnpm Migration

Bun automatically migrates from pnpm when `pnpm-lock.yaml` exists:

```bash
# Auto-migrates pnpm-lock.yaml to bun.lock
bun install

# Safe to remove after migration
rm pnpm-lock.yaml pnpm-workspace.yaml
```

Migrates:
- Lockfile versions and resolutions
- Workspace configuration
- Catalog dependencies
- Overrides and patched dependencies
