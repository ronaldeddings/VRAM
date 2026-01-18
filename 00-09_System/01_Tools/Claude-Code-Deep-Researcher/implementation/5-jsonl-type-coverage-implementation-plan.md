# JSONL Type Coverage Implementation Plan

## Executive Summary

This plan addresses comprehensive type coverage for Claude Code JSONL conversation files. Analysis of 100+ log files revealed **6 new fields and 2 new system subtypes** that are missing from our current TypeScript type definitions.

### Discovered Types
- **Event Types**: 6 types (user, assistant, system, summary, file-history-snapshot, queue-operation)
- **System Subtypes**: 4 subtypes (compact_boundary, informational, init, **local_command** ← NEW)
- **New Fields**: 7 fields missing from current types

---

## Gap Analysis

### ✅ Already Implemented (Current Coverage)
- [x] Base entry types: user, assistant, system, summary
- [x] System subtypes: compact_boundary, informational, init
- [x] Core fields: uuid, timestamp, parentUuid, isSidechain, userType, cwd, sessionId, version, gitBranch
- [x] Message content types: text, tool_use, tool_result
- [x] Tool input structures: TodoWrite, Bash, Read, Write, Edit, MultiEdit, Grep, Glob, WebSearch, WebFetch
- [x] Result entry type with usage metrics
- [x] File history snapshot structure (partial)

### ❌ Missing Types & Fields

#### 1. **NEW Event Type: `queue-operation`**
```typescript
interface QueueOperationEntry {
  type: "queue-operation";
  operation: "enqueue" | string; // May have other operations
  timestamp: string;
  content: string; // Task content being queued
  sessionId: string;
}
```

**Sample Data:**
```json
{
  "type": "queue-operation",
  "operation": "enqueue",
  "timestamp": "2025-11-01T14:27:24.926Z",
  "content": "My goal is to integrate...",
  "sessionId": "074b8683-9b28-4ffb-bb52-5cc462e3f876"
}
```

#### 2. **NEW System Subtype: `local_command`**
```typescript
interface SystemMessageEntry {
  type: "system";
  subtype: "compact_boundary" | "informational" | "init" | "local_command"; // ← ADD
  // ... existing fields
}
```

**Sample Data:**
```json
{
  "type": "system",
  "subtype": "local_command",
  "content": "<command-name>/memory</command-name>\n...",
  "level": "info",
  // ... other base fields
}
```

#### 3. **NEW Optional Field: `agentId`**
- **Where**: User and Assistant message entries
- **Type**: `string`
- **Purpose**: Identifies the agent in multi-agent scenarios

```typescript
interface BaseConversationEntry {
  // ... existing fields
  agentId?: string; // ← ADD
}
```

#### 4. **NEW Optional Field: `logicalParentUuid`**
- **Already in types but needs documentation**
- Used in compact boundaries to track pre-compaction relationships

#### 5. **NEW Optional Field: `compactMetadata`**
```typescript
interface SystemMessageEntry {
  type: "system";
  // ... existing fields
  compactMetadata?: { // ← UPDATE (was compact_metadata with underscore)
    trigger: "auto" | "manual";
    preTokens?: number; // ← ADD (inconsistent with old pre_tokens)
  };
}
```

**Data shows both `pre_tokens` and `preTokens` in use!**

#### 6. **NEW Optional Field: `thinkingMetadata`**
```typescript
interface UserMessageEntry {
  // ... existing fields
  thinkingMetadata?: { // ← ADD
    level: "high" | "medium" | "low" | string;
    disabled: boolean;
    triggers: string[];
  };
}
```

#### 7. **NEW Optional Fields for Summary**
```typescript
interface SummaryEntry {
  type: "summary";
  summary: string;
  leafUuid: string;
  sessionId?: string; // ← ADD (missing in current type)
  isVisibleInTranscriptOnly?: boolean; // ← ALREADY EXISTS
}
```

#### 8. **NEW Optional Fields for User Messages**
```typescript
interface UserMessageEntry {
  // ... existing fields
  isCompactSummary?: boolean; // ← ADD
  isVisibleInTranscriptOnly?: boolean; // ← ADD
}
```

#### 9. **NEW Optional Field: `isApiErrorMessage`**
```typescript
interface AssistantMessageEntry {
  // ... existing fields
  isApiErrorMessage?: boolean; // ← ADD
}
```

**Sample Data (synthetic error message):**
```json
{
  "type": "assistant",
  "model": "<synthetic>",
  "isApiErrorMessage": true,
  "message": {
    "content": [{"type": "text", "text": "Prompt is too long"}],
    "usage": {"input_tokens": 0, "output_tokens": 0, ...}
  }
}
```

#### 10. **File History Snapshot - Enhanced Structure**
```typescript
interface FileHistorySnapshotEntry {
  type: "file-history-snapshot";
  messageId: string;
  snapshot: {
    messageId: string;
    trackedFileBackups: Record<string, {
      backupFileName: string | null;
      version: number;
      backupTime: string;
    }>;
    timestamp: string;
  };
  isSnapshotUpdate: boolean;
}
```

**Sample Data (with file backups):**
```json
{
  "type": "file-history-snapshot",
  "messageId": "00d03d5a-3f97-4f44-8f6b-f8d0e4fb2234",
  "snapshot": {
    "messageId": "cce1af72-774c-47ab-92e1-d3b0f724a749",
    "trackedFileBackups": {
      "test-gemini-sdk.mjs": {
        "backupFileName": null,
        "version": 1,
        "backupTime": "2025-11-01T15:21:19.033Z"
      }
    },
    "timestamp": "2025-11-01T15:17:29.674Z"
  },
  "isSnapshotUpdate": true
}
```

---

## Implementation Checklist

### Phase 1: Type Definition Updates ✓ Critical

#### 1.1 Update Base Types
- [x] Add `agentId?: string` to `BaseConversationEntry`
- [x] Document `logicalParentUuid` field usage (already exists)
- [x] Add comprehensive JSDoc comments explaining new fields

#### 1.2 Create QueueOperationEntry Type
- [x] Define `QueueOperationEntry` interface
- [x] Add to `ConversationEntry` discriminated union
- [x] Create type guard `isQueueOperation()`
- [x] Document queue operation semantics

#### 1.3 Update SystemMessageEntry
- [x] Add `"local_command"` to subtype union
- [x] Fix `compactMetadata` naming inconsistency:
  - Rename `compact_metadata` → `compactMetadata` (camelCase)
  - Support both `pre_tokens` and `preTokens` for backward compatibility
- [x] Add JSDoc for `local_command` subtype usage

#### 1.4 Update UserMessageEntry
- [x] Add `thinkingMetadata?: { level: string; disabled: boolean; triggers: string[] }`
- [x] Add `isCompactSummary?: boolean`
- [x] Add `isVisibleInTranscriptOnly?: boolean`
- [x] Document thinking metadata purpose and usage

#### 1.5 Update AssistantMessageEntry
- [x] Add `isApiErrorMessage?: boolean`
- [x] Document synthetic error messages (model: "<synthetic>")
- [x] Add examples of API error scenarios

#### 1.6 Update SummaryEntry
- [x] Add `sessionId?: string` field
- [x] Verify `isVisibleInTranscriptOnly` already exists
- [x] Document when sessionId is present vs absent

#### 1.7 Update FileHistorySnapshotEntry
- [x] Enhance `trackedFileBackups` type definition
- [x] Add file backup metadata structure
- [x] Document snapshot vs snapshot-update semantics
- [x] Add examples of tracked files

---

### Phase 2: Parser Implementation Updates ✓ Critical

#### 2.1 Update JSONL Parser (`src/services/jsonl-parser.ts`)
- [x] Add parsing logic for `queue-operation` type
- [x] Handle `local_command` system subtype
- [x] Add validation for new optional fields
- [x] Ensure backward compatibility with old field names (`compact_metadata` vs `compactMetadata`)

#### 2.2 Type Guards Implementation
- [x] Implement `isQueueOperation()` type guard
- [x] Update `isSystemMessage()` to handle `local_command`
- [x] Add guards for new optional fields:
  - `hasAgentId()`
  - `hasThinkingMetadata()`
  - `isApiErrorMessage()`
  - `isCompactSummary()`

---

### Phase 3: Validator Updates ✓ Critical

#### 3.1 Schema Validator (`src/validators/schema-validator.ts`)
- [x] Add schema validation for `QueueOperationEntry`
- [x] Validate `queue-operation` required fields: type, operation, timestamp, content, sessionId
- [x] Update system message validation for `local_command` subtype
- [x] Add validation for `thinkingMetadata` structure
- [x] Validate `compactMetadata` with both naming variations
- [x] Add validation for file history snapshot enhanced structure

#### 3.2 Relationship Validator (`src/validators/relationship-validator.ts`)
- [x] Handle queue operations in parent-child relationships
- [x] Validate `logicalParentUuid` relationships for compact summaries
- [x] Ensure agent ID consistency across related messages

#### 3.3 Completeness Checker (`src/validators/completeness-checker.ts`)
- [x] Add checks for queue operation data completeness
- [x] Validate thinking metadata completeness
- [x] Check compact metadata consistency

---

### Phase 4: Test Implementation ✓ Critical

#### 4.1 Create Test Data Samples (`src/tests/fixtures/`)
- [x] Create `queue-operation-samples.jsonl` with:
  - Basic enqueue operation
  - Edge cases (very long content, special characters)
  - Multiple operations in sequence
- [x] Create `local-command-samples.jsonl` with:
  - `/memory` command
  - Command output (stdout)
  - Various command types
- [x] Create `agent-id-samples.jsonl` with:
  - User messages with agentId
  - Assistant messages with agentId
  - Multi-agent conversation flow
- [x] Create `thinking-metadata-samples.jsonl` with:
  - High/medium/low thinking levels
  - Disabled thinking
  - Various trigger patterns
- [x] Create `compact-summary-samples.jsonl` with:
  - Compact boundary with logicalParentUuid
  - Compact summary with full context
  - compactMetadata variations
- [x] Create `api-error-samples.jsonl` with:
  - Synthetic error messages
  - Various error types
- [x] Create `file-snapshot-samples.jsonl` with:
  - Empty snapshot
  - Snapshot with tracked files
  - Snapshot updates

#### 4.2 Unit Tests (`src/tests/type-coverage.test.ts`)
- [ ] **Test: Queue Operation Parsing**
  - Parse queue-operation entries correctly
  - Extract operation type and content
  - Validate sessionId mapping
  - Handle missing optional fields gracefully

- [ ] **Test: Local Command System Messages**
  - Parse local_command subtype
  - Extract command name and args from content
  - Parse command stdout/stderr
  - Validate system message structure

- [ ] **Test: Agent ID Field**
  - Parse agentId from user messages
  - Parse agentId from assistant messages
  - Validate agentId consistency in conversations
  - Handle missing agentId gracefully

- [ ] **Test: Thinking Metadata**
  - Parse thinkingMetadata structure
  - Validate level, disabled, triggers fields
  - Handle various thinking levels
  - Test empty triggers array

- [ ] **Test: Compact Metadata**
  - Parse both `compact_metadata` and `compactMetadata`
  - Handle `pre_tokens` vs `preTokens` variations
  - Validate trigger types (auto/manual)
  - Test logicalParentUuid linkage

- [ ] **Test: API Error Messages**
  - Identify synthetic error messages
  - Parse error content correctly
  - Validate zero token usage
  - Handle isApiErrorMessage flag

- [ ] **Test: File History Snapshots**
  - Parse empty snapshots
  - Parse snapshots with tracked files
  - Validate file backup metadata structure
  - Test snapshot vs update flag

- [ ] **Test: Compact Summaries**
  - Parse isCompactSummary flag
  - Validate isVisibleInTranscriptOnly
  - Extract summary content
  - Test relationship to compact boundary

#### 4.3 Integration Tests (`src/tests/integration/`)
- [ ] **Test: Full Conversation with Queue Operations**
  - Load conversation with enqueued tasks
  - Validate queue operation ordering
  - Test session continuity

- [ ] **Test: Multi-Agent Conversation**
  - Parse conversation with multiple agentIds
  - Track agent-specific message flows
  - Validate agent handoffs

- [ ] **Test: Compaction Workflow**
  - Parse compact boundary
  - Follow logicalParentUuid chain
  - Validate compact summary generation
  - Test token count before/after

- [ ] **Test: File Tracking Across Messages**
  - Parse file snapshots
  - Track file versions
  - Validate backup timing
  - Test snapshot updates

- [ ] **Test: Error Recovery Flow**
  - Parse API error messages
  - Validate error message placement
  - Test conversation continuation after errors

#### 4.4 End-to-End Validation (`src/tests/e2e/`)
- [ ] **Test: Parse All ClaudeLogs Samples**
  - Select 10 diverse JSONL files from `resources/ClaudeLogs/`
  - Copy to `src/tests/fixtures/e2e-samples/`
  - Parse each file completely
  - Validate all entries have recognized types
  - Report any unknown fields or types
  - Ensure 100% type coverage

- [ ] **Test: Type Coverage Metrics**
  - Count total entries by type
  - Verify all 6 types are recognized
  - Calculate field coverage percentage
  - Generate coverage report

- [ ] **Test: Backward Compatibility**
  - Test old naming conventions (`compact_metadata`)
  - Validate mixed-version conversations
  - Ensure no regressions in existing types

---

### Phase 5: Documentation & Examples ✓ Important

#### 5.1 Update Type Documentation
- [ ] Add comprehensive JSDoc comments for all new types
- [ ] Document queue operation semantics
- [ ] Explain thinking metadata usage patterns
- [ ] Document compaction workflow with examples
- [ ] Add agent ID usage scenarios

#### 5.2 Create Usage Examples
- [ ] Example: Parsing queue operations
- [ ] Example: Tracking multi-agent conversations
- [ ] Example: Analyzing thinking metadata
- [ ] Example: Processing compact summaries
- [ ] Example: Handling API errors
- [ ] Example: File history tracking

#### 5.3 Update README
- [ ] Document new type coverage (6/6 types)
- [ ] Add migration guide for compact_metadata rename
- [ ] List all supported system subtypes
- [ ] Update feature matrix

---

## Testing Strategy

### Test Data Sources

1. **Primary**: Use actual samples from `resources/ClaudeLogs/`
   - Select representative files covering all types
   - Copy samples to `src/tests/fixtures/`
   - DO NOT test against original `resources/` folder

2. **Coverage Requirements**:
   - ✅ All 6 event types must be tested
   - ✅ All 4 system subtypes must be tested
   - ✅ All 10+ new optional fields must be tested
   - ✅ Both naming conventions (old/new) must be tested

3. **Test File Organization**:
   ```
   src/tests/fixtures/
   ├── queue-operation-samples.jsonl
   ├── local-command-samples.jsonl
   ├── agent-id-samples.jsonl
   ├── thinking-metadata-samples.jsonl
   ├── compact-summary-samples.jsonl
   ├── api-error-samples.jsonl
   ├── file-snapshot-samples.jsonl
   └── e2e-samples/
       ├── sample-01.jsonl
       ├── sample-02.jsonl
       └── ... (10 diverse files)
   ```

### Test Execution Plan

#### Unit Tests
```bash
npm test -- src/tests/type-coverage.test.ts
```
**Expected**: All new types parse correctly with proper type guards

#### Integration Tests
```bash
npm test -- src/tests/integration/
```
**Expected**: Complex workflows (compaction, multi-agent, file tracking) work end-to-end

#### E2E Validation
```bash
npm test -- src/tests/e2e/
```
**Expected**: 100% type coverage on real-world samples, no unknown types

#### Coverage Report
```bash
npm test -- --coverage
```
**Expected**: >95% code coverage on new type handling logic

---

## Success Criteria

### ✅ Definition of Done

1. **Type Completeness**: All 6 event types fully defined
2. **Field Coverage**: All 10+ new fields documented and typed
3. **Parser Support**: JSONL parser handles all types without errors
4. **Validation**: Schema validators recognize all new structures
5. **Type Guards**: All type guards implemented and tested
6. **Test Coverage**: 100% of new types covered by tests
7. **Backward Compatibility**: Old naming conventions still work
8. **Documentation**: All new types documented with examples
9. **E2E Validation**: Real-world samples parse successfully
10. **No Regressions**: Existing types continue to work correctly

### Verification Checklist

- [ ] Run full test suite: `npm test`
- [ ] Verify type coverage report shows 6/6 types
- [ ] Check no TypeScript compilation errors
- [ ] Validate all samples in `resources/ClaudeLogs/` can be parsed
- [ ] Confirm backward compatibility with old field names
- [ ] Review code coverage report (>95% target)
- [ ] Validate type guards work correctly
- [ ] Test parser performance on large files
- [ ] Verify documentation is complete
- [ ] Check examples run without errors

---

## Rollback Plan

If issues are discovered during implementation:

1. **Type Definition Rollback**: Revert to git commit before changes
2. **Parser Rollback**: Use previous parser with optional new field handling
3. **Test Data**: Keep test fixtures for future reference
4. **Documentation**: Maintain issue log for retry

---

## Key Insights

### Critical Findings

1. **Naming Inconsistency**: `compact_metadata` vs `compactMetadata` and `pre_tokens` vs `preTokens`
   - **Impact**: Parser must handle both for backward compatibility
   - **Solution**: Support both, prefer camelCase in new code

2. **Queue Operations**: Entirely new event type for task management
   - **Impact**: Conversation flow includes task queueing metadata
   - **Solution**: Add as first-class type with dedicated handlers

3. **Agent ID**: Multi-agent support is production feature
   - **Impact**: Conversations can involve multiple Claude agents
   - **Solution**: Track agent IDs for conversation attribution

4. **Thinking Metadata**: Extended thinking feature configuration
   - **Impact**: User can control Claude's thinking depth
   - **Solution**: Parse metadata to understand reasoning mode

5. **API Errors**: Synthetic messages for system errors
   - **Impact**: Error messages appear as assistant messages
   - **Solution**: Flag detection to handle errors appropriately

### Risk Areas

⚠️ **High Risk**: Naming inconsistencies could cause parsing failures
- Mitigation: Comprehensive tests for both naming conventions

⚠️ **Medium Risk**: File history snapshot structure more complex than expected
- Mitigation: Detailed type definition with nested structures

⚠️ **Low Risk**: Queue operations may have undiscovered operation types
- Mitigation: Use string union with known types, allow others

---

## Timeline Estimate

- **Phase 1** (Type Definitions): 2-3 hours
- **Phase 2** (Parser Updates): 2-3 hours
- **Phase 3** (Validators): 2-3 hours
- **Phase 4** (Tests): 4-6 hours
- **Phase 5** (Documentation): 1-2 hours

**Total**: 11-17 hours of focused development

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Create test fixtures** from ClaudeLogs samples
3. **Begin Phase 1** type definition updates
4. **Implement incrementally** with continuous testing
5. **Validate against real data** throughout

---

## Appendix: Complete Type Inventory

### All Event Types (6)
1. ✅ `user` - User messages
2. ✅ `assistant` - Assistant responses
3. ✅ `system` - System messages (4 subtypes)
4. ✅ `summary` - Conversation summaries
5. ✅ `file-history-snapshot` - File tracking
6. ✅ `queue-operation` - Task queueing **← NEW**

### All System Subtypes (4)
1. ✅ `compact_boundary` - Compaction markers
2. ✅ `informational` - Info messages
3. ✅ `init` - Initialization
4. ✅ `local_command` - Local commands **← NEW**

### All Unique Keys (30)
✅ agentId, compactMetadata, content, cwd, gitBranch, isApiErrorMessage, isCompactSummary, isMeta, isSidechain, isSnapshotUpdate, isVisibleInTranscriptOnly, leafUuid, level, logicalParentUuid, message, messageId, operation, parentUuid, requestId, sessionId, snapshot, subtype, summary, thinkingMetadata, timestamp, toolUseResult, type, userType, uuid, version

---

## Contact & Feedback

For questions or feedback on this implementation plan, please create an issue in the repository or contact the development team.

**Last Updated**: 2025-11-15
**Plan Version**: 1.0
**Status**: Ready for Implementation
