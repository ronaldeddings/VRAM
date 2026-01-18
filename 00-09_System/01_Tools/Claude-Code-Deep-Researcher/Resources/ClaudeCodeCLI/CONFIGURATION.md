# Configuration

The Claude Code CLI is highly configurable via Environment Variables and Configuration Files.

## Configuration Files

The following JSON configuration files are recognized by the application:

- `config.json`: Main user configuration.
- `settings.json`: General settings.
- `managed-settings.json`: Likely for enterprise/managed environments.
- `remote-settings.json`: Configuration for remote sessions.
- `keybindings.json`: Custom keyboard shortcuts.
- `hooks.json`: Lifecycle hooks (pre/post command).
- `managed-mcp.json`: Managed Model Context Protocol server config.
- `manifest.json`: Extension/Plugin manifest.
- `marketplace.json`: Extension marketplace data.

## Environment Variables

### Authentication & API
- `ANTHROPIC_API_KEY`: Primary API key for Anthropic services.
- `ANTHROPIC_AUTH_TOKEN`: Alternative authentication token.
- `ANTHROPIC_BASE_URL`: API endpoint (defaulting to Anthropic's API).
- `ANTHROPIC_FOUNDRY_API_KEY` / `ANTHROPIC_FOUNDRY_BASE_URL`: For using internal/foundry models.
- `CLAUDE_CODE_OAUTH_TOKEN`: Token for OAuth-based login.

### Model Configuration
- `ANTHROPIC_MODEL`: Specify the model (e.g., `claude-3-5-sonnet-20241022`).
- `CLAUDE_CODE_SUBAGENT_MODEL`: Model used for sub-agents (planner/executor).
- `CLAUDE_CODE_EFFORT_LEVEL`: "low", "medium", "high" (inferred).
- `CLAUDE_CODE_PLAN_V2_AGENT_COUNT`: Control parallelism for planning agents.

### Features & Toggles
- `CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION`: Enable/disable prompt completion.
- `CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK`: Security toggle.
- `CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING`: Disable saving file history.
- `CLAUDE_CODE_AUTO_CONNECT_IDE`: integration with IDEs.
- `CLAUDE_CODE_ALLOW_MCP_TOOLS_FOR_SUBAGENTS`: Advanced MCP routing.

### Debugging & Telemetry
- `CLAUDE_CODE_DEBUG_LOGS_DIR`: Custom path for debug logs.
- `CLAUDE_CODE_ENABLE_TELEMETRY`: Toggle analytics.
- `DEBUG`: Standard Node.js debug flag (e.g., `DEBUG=*`).
- `SENTRY_DSN`: Error tracking endpoint.

### Remote & Environment
- `CLAUDE_CODE_REMOTE`: Set to '1' or 'true' for remote mode.
- `CLAUDE_CODE_REMOTE_SESSION_ID`: ID for the remote session.
- `CLAUDE_CODE_SHELL`: Override the shell used (bash/zsh/fish).
- `CLAUDE_CODE_GIT_BASH_PATH`: specific path for Git Bash on Windows.

### Third-Party Integrations
The CLI reads credentials for various cloud providers to use their SDKs/tools:
- **AWS**: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_PROFILE`.
- **Azure**: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`.
- **Google Cloud**: `GOOGLE_APPLICATION_CREDENTIALS`, `GCLOUD_PROJECT`, `CLOUD_ML_REGION`.
- **GitHub**: `GITHUB_TOKEN` (implied), `GITHUB_REPOSITORY`.

## Environment Flags

These booleans control specific behaviors (Set to `1` or `true`):
- `CLAUDE_CODE_USE_NATIVE_FILE_SEARCH`: Use internal search instead of `ripgrep` binary?
- `CLAUDE_CODE_FORCE_FULL_LOGO`: UI customization.
- `CLAUDE_CODE_BASH_SANDBOX_SHOW_INDICATOR`: UI feedback for sandboxed commands.
