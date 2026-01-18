# Appendix: Observed Frequencies (This Machine)

Scan time (UTC): `2025-12-14T00:57:58Z`

Projects root: `~/.claude/projects`

Files scanned: `2,738`
Lines scanned: `62,372`
JSON parse errors (skipped lines): `4`

This appendix summarizes what was observed while scanning `~/.claude/projects/**/*.jsonl` on this machine. It contains **counts and key names only** (no prompt/output text).

## Record types (top-level `type`)

- `assistant`: 35,689
- `user`: 21,650
- `queue-operation`: 2,162
- `file-history-snapshot`: 1,591
- `summary`: 830
- `system`: 446

## Most common top-level keys

- `type`: 62,368
- `sessionId`: 60,064
- `timestamp`: 59,947
- `uuid`: 57,785
- `parentUuid`: 57,771
- `isSidechain`: 57,749
- `userType`: 57,749
- `cwd`: 57,749
- `version`: 57,749
- `gitBranch`: 57,739
- `message`: 57,353
- `requestId`: 35,168
- `slug`: 32,782
- `toolUseResult`: 19,360
- `agentId`: 18,155
- `operation`: 2,162
- `messageId`: 1,591
- `snapshot`: 1,591
- `isSnapshotUpdate`: 1,591
- `content`: 1,304
- `summary`: 830
- `leafUuid`: 830
- `thinkingMetadata`: 751
- `todos`: 464
- `subtype`: 432
- `level`: 432
- `isMeta`: 311
- `error`: 192
- `isVisibleInTranscriptOnly`: 187
- `isCompactSummary`: 180
- `logicalParentUuid`: 176
- `compactMetadata`: 176
- `retryInMs`: 172
- `retryAttempt`: 172
- `maxRetries`: 172
- `optimizedFrom`: 101
- `optimizationStrategy`: 101
- `cause`: 86
- `isApiErrorMessage`: 54
- `sourceToolUseID`: 30

## Message content block types (`message.content[].type`)

- `tool_result`: 19,361
- `tool_use`: 19,079
- `text`: 11,709
- `thinking`: 5,709
- `image`: 25

## Models (assistant messages)

- `claude-opus-4-5-20251101`: 15,913
- `claude-sonnet-4-5-20250929`: 13,303
- `claude-haiku-4-5-20251001`: 6,392
- `<synthetic>`: 64
- `claude-opus-4-20250514`: 6

## Tool names (`tool_use.name`) — top 80

- `Bash`: 7,996
- `Read`: 3,666
- `Write`: 1,392
- `TodoWrite`: 1,155
- `Task`: 918
- `Edit`: 916
- `Grep`: 634
- `Glob`: 609
- `BashOutput`: 257
- `mcp__context7__get-library-docs`: 168
- `WebSearch`: 157
- `mcp__chrome-devtools__navigate_page`: 148
- `mcp__chrome-devtools__take_screenshot`: 142
- `mcp__chrome-devtools__take_snapshot`: 139
- `mcp__chrome-devtools__click`: 122
- `WebFetch`: 93
- `mcp__context7__resolve-library-id`: 80
- `KillShell`: 41
- `mcp__chrome-devtools__fill`: 38
- `mcp__chrome-devtools__list_console_messages`: 37
- `Skill`: 35
- `TaskOutput`: 31
- `mcp__chrome-devtools__evaluate_script`: 25
- `mcp__XcodeBuildMCP__build_macos`: 24
- `mcp__chrome-devtools__list_pages`: 21
- `AgentOutputTool`: 19
- `mcp__XcodeBuildMCP__screenshot`: 17
- `mcp__chrome-devtools__list_network_requests`: 16
- `mcp__XcodeBuildMCP__build_run_macos`: 15
- `mcp__XcodeBuildMCP__build_run_sim`: 13
- `AskUserQuestion`: 13
- `mcp__browser__tabs_context`: 12
- `mcp__chrome-devtools__new_page`: 11
- `mcp__XcodeBuildMCP__build_sim`: 10
- `mcp__browser__navigate`: 10
- `mcp__chrome-devtools__get_network_request`: 9
- `mcp__chrome-devtools__wait_for`: 8
- `mcp__playwright__browser_navigate`: 7
- `mcp__XcodeBuildMCP__tap`: 6
- `mcp__playwright__browser_take_screenshot`: 6
- `mcp__XcodeBuildMCP__get_mac_app_path`: 5
- `mcp__chrome-devtools__press_key`: 5
- `mcp__chrome-devtools__fill_form`: 5
- `mcp__chrome-devtools__get_console_message`: 4
- `mcp__XcodeBuildMCP__describe_ui`: 3
- `mcp__chrome-devtools__select_page`: 3
- `mcp__mastra-tools__odinListVulnerabilitiesTool`: 3
- `mcp__XcodeBuildMCP__launch_app_sim`: 2
- `mcp__XcodeBuildMCP__launch_app_logs_sim`: 2
- `mcp__XcodeBuildMCP__stop_sim_log_cap`: 2
- `mcp__XcodeBuildMCP__clean`: 2
- `mcp__XcodeBuildMCP__stop_mac_app`: 2
- `mcp__XcodeBuildMCP__list_sims`: 2
- `mcp__XcodeBuildMCP__open_sim`: 2
- `mcp__playwright__browser_run_code`: 2
- `mcp__playwright__browser_click`: 2
- `mcp__mastra-tools__odinGetTaxonomiesTool`: 2
- `mcp__XcodeBuildMCP__launch_mac_app`: 1
- `mcp__XcodeBuildMCP__stop_app_sim`: 1
- `mcp__XcodeBuildMCP__boot_sim`: 1
- `mcp__XcodeBuildMCP__install_app_sim`: 1
- `mcp__playwright__browser_snapshot`: 1
- `mcp__playwright__browser_wait_for`: 1
- `mcp__chrome-devtools__browser_console_messages`: 1
- `mcp__chrome-devtools__type`: 1
- `mcp__chrome-devtools__close_page`: 1
- `mcp__mastra-tools__odinListModelsTool`: 1
- `mcp__mastra-tools__odinGetVulnerabilityTool`: 1
- `LS`: 1
- `ListMcpResourcesTool`: 1
- `mcp__chrome-devtools__gesture`: 1
- `mcp__chrome-devtools__tap`: 1

## `toolUseResult` kinds by tool (top 50 tools, attributed by `tool_use_id`)

- `Bash`: 7,988 (dict:7,676, string:312)
- `Read`: 3,659 (dict:type=text:3,278, string:262, dict:type=image:119)
- `Write`: 1,391 (dict:type=create:1,272, dict:type=update:86, string:33)
- `TodoWrite`: 1,154 (dict:1,154)
- `Edit`: 916 (dict:899, string:17)
- `Task`: 867 (dict:865, string:2)
- `Grep`: 634 (dict:629, string:5)
- `Glob`: 609 (dict:608, string:1)
- `BashOutput`: 257 (dict:256, string:1)
- `mcp__context7__get-library-docs`: 168 (list:168)
- `WebSearch`: 157 (dict:157)
- `mcp__chrome-devtools__navigate_page`: 148 (list:146, string:2)
- `mcp__chrome-devtools__take_screenshot`: 142 (list:140, string:2)
- `mcp__chrome-devtools__take_snapshot`: 139 (list:137, string:2)
- `mcp__chrome-devtools__click`: 122 (list:110, string:12)
- `WebFetch`: 93 (dict:72, string:21)
- `mcp__context7__resolve-library-id`: 80 (list:80)
- `KillShell`: 41 (dict:22, string:19)
- `mcp__chrome-devtools__fill`: 38 (list:36, string:2)
- `mcp__chrome-devtools__list_console_messages`: 37 (list:37)
- `Skill`: 35 (dict:35)
- `TaskOutput`: 31 (dict:31)
- `mcp__chrome-devtools__evaluate_script`: 25 (list:24, string:1)
- `mcp__XcodeBuildMCP__build_macos`: 24 (list:13, string:11)
- `mcp__chrome-devtools__list_pages`: 21 (list:19, string:2)
- `AgentOutputTool`: 19 (dict:19)
- `mcp__XcodeBuildMCP__screenshot`: 17 (list:17)
- `mcp__chrome-devtools__list_network_requests`: 16 (list:16)
- `mcp__XcodeBuildMCP__build_run_macos`: 15 (list:15)
- `mcp__XcodeBuildMCP__build_run_sim`: 13 (list:8, string:5)
- `AskUserQuestion`: 12 (dict:12)
- `mcp__browser__tabs_context`: 12 (string:11, list:1)
- `mcp__chrome-devtools__new_page`: 11 (list:9, string:2)
- `mcp__XcodeBuildMCP__build_sim`: 10 (list:7, string:3)
- `mcp__browser__navigate`: 9 (string:8, list:1)
- `mcp__chrome-devtools__get_network_request`: 9 (list:9)
- `mcp__chrome-devtools__wait_for`: 8 (string:5, list:3)
- `mcp__playwright__browser_navigate`: 7 (string:4, list:3)
- `mcp__XcodeBuildMCP__tap`: 6 (list:6)
- `mcp__playwright__browser_take_screenshot`: 6 (list:6)
- `mcp__XcodeBuildMCP__get_mac_app_path`: 5 (list:5)
- `mcp__chrome-devtools__press_key`: 5 (list:5)
- `mcp__chrome-devtools__fill_form`: 5 (list:4, string:1)
- `mcp__chrome-devtools__get_console_message`: 4 (list:4)
- `mcp__XcodeBuildMCP__describe_ui`: 3 (list:3)
- `mcp__chrome-devtools__select_page`: 3 (list:3)
- `mcp__mastra-tools__odinListVulnerabilitiesTool`: 3 (string:3)
- `mcp__XcodeBuildMCP__launch_app_sim`: 2 (list:2)
- `mcp__XcodeBuildMCP__launch_app_logs_sim`: 2 (list:2)
- `mcp__XcodeBuildMCP__stop_sim_log_cap`: 2 (list:2)
