/**
 * Relationship Validator for Claude Code conversation entries.
 * Validates UUID relationships, conversation chains, and hierarchical structure.
 */

import type { 
  ConversationEntry, 
  RelationshipValidationResult
} from '../types/claude-conversation.ts';

export class RelationshipValidator {
  
  /**
   * Validate conversation chain relationships and UUID references.
   * 
   * @param entries - Array of conversation entries to validate
   * @returns Relationship validation result with detailed issues
   */
  validateConversationChain(entries: ConversationEntry[]): RelationshipValidationResult {
    const uuidSet = new Set(entries.map(e => e.uuid));
    const orphanedEntries: string[] = [];
    const circularReferences: string[] = [];
    const missingParents: Array<{ childUuid: string; missingParentUuid: string }> = [];
    
    // Build UUID mapping for efficient lookups
    const entryMap = new Map<string, ConversationEntry>();
    for (const entry of entries) {
      entryMap.set(entry.uuid, entry);
    }
    
    // Validate each entry's relationships
    for (const entry of entries) {
      // Skip entries that don't follow standard UUID patterns
      if (entry.type === 'summary' || entry.type === 'queue-operation' || entry.type === 'file-history-snapshot') {
        continue;
      }
      
      // Check for orphaned references (parentUuid points to non-existent entry)
      if (entry.parentUuid && !uuidSet.has(entry.parentUuid)) {
        orphanedEntries.push(entry.uuid);
        missingParents.push({
          childUuid: entry.uuid,
          missingParentUuid: entry.parentUuid
        });
      }
      
      // Check for circular references
      if (this.hasCircularReference(entry, entryMap)) {
        circularReferences.push(entry.uuid);
      }
      
      // Validate logical parent UUID if present
      if ('logicalParentUuid' in entry && entry.logicalParentUuid) {
        if (!uuidSet.has(entry.logicalParentUuid)) {
          missingParents.push({
            childUuid: entry.uuid,
            missingParentUuid: entry.logicalParentUuid
          });
        }
      }
    }
    
    return {
      isValid: orphanedEntries.length === 0 && circularReferences.length === 0,
      orphanedEntries,
      circularReferences,
      missingParents
    };
  }
  
  /**
   * Check if an entry has circular parent references.
   * 
   * @param entry - Entry to check for circular references
   * @param entryMap - Map of UUID to entry for efficient lookups
   * @returns True if circular reference detected
   */
  private hasCircularReference(entry: ConversationEntry, entryMap: Map<string, ConversationEntry>): boolean {
    const visited = new Set<string>();
    let current = entry;
    
    while (current.parentUuid) {
      // If we've seen this UUID before, we have a cycle
      if (visited.has(current.uuid)) {
        return true;
      }
      
      visited.add(current.uuid);
      
      // Get parent entry
      const parent = entryMap.get(current.parentUuid);
      if (!parent) {
        // Parent doesn't exist, not a circular reference (but is an orphan)
        break;
      }
      
      current = parent;
      
      // Prevent infinite loops in case of malformed data
      if (visited.size > 1000) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Validate conversation tree structure and depth.
   * 
   * @param entries - Array of conversation entries
   * @returns Analysis of tree structure
   */
  validateTreeStructure(entries: ConversationEntry[]): {
    isValid: boolean;
    maxDepth: number;
    rootEntries: string[];
    leafEntries: string[];
    branchingPoints: string[];
    issues: string[];
  } {
    const entryMap = new Map<string, ConversationEntry>();
    const children = new Map<string, string[]>();
    const issues: string[] = [];
    
    // Build maps
    for (const entry of entries) {
      if (entry.type === 'summary' || entry.type === 'queue-operation' || entry.type === 'file-history-snapshot') continue;
      
      entryMap.set(entry.uuid, entry);
      
      if (entry.parentUuid) {
        if (!children.has(entry.parentUuid)) {
          children.set(entry.parentUuid, []);
        }
        children.get(entry.parentUuid)!.push(entry.uuid);
      }
    }
    
    // Find root entries (no parent)
    const rootEntries = Array.from(entryMap.values())
      .filter(entry => !entry.parentUuid)
      .map(entry => entry.uuid);
    
    // Find leaf entries (no children)
    const leafEntries = Array.from(entryMap.keys())
      .filter(uuid => !children.has(uuid) || children.get(uuid)!.length === 0);
    
    // Find branching points (multiple children)
    const branchingPoints = Array.from(children.entries())
      .filter(([_, childrenUuids]) => childrenUuids.length > 1)
      .map(([uuid, _]) => uuid);
    
    // Calculate max depth
    let maxDepth = 0;
    for (const rootUuid of rootEntries) {
      const depth = this.calculateDepth(rootUuid, children);
      maxDepth = Math.max(maxDepth, depth);
    }
    
    // Validate structure issues
    if (rootEntries.length === 0) {
      issues.push('No root entries found - all entries have parents');
    }
    
    if (rootEntries.length > 3) {
      issues.push(`Too many root entries: ${rootEntries.length} (expected 1-3)`);
    }
    
    if (maxDepth > 50) {
      issues.push(`Conversation tree too deep: ${maxDepth} levels`);
    }
    
    // Check for disconnected components
    const connectedComponents = this.findConnectedComponents(entryMap, children);
    if (connectedComponents.length > 1) {
      issues.push(`Disconnected conversation components: ${connectedComponents.length}`);
    }
    
    return {
      isValid: issues.length === 0,
      maxDepth,
      rootEntries,
      leafEntries,
      branchingPoints,
      issues
    };
  }
  
  /**
   * Calculate depth of conversation tree from a root entry.
   */
  private calculateDepth(uuid: string, children: Map<string, string[]>): number {
    const childrenUuids = children.get(uuid) || [];
    if (childrenUuids.length === 0) {
      return 1;
    }
    
    let maxChildDepth = 0;
    for (const childUuid of childrenUuids) {
      const childDepth = this.calculateDepth(childUuid, children);
      maxChildDepth = Math.max(maxChildDepth, childDepth);
    }
    
    return maxChildDepth + 1;
  }
  
  /**
   * Find connected components in the conversation graph.
   */
  private findConnectedComponents(
    entryMap: Map<string, ConversationEntry>, 
    children: Map<string, string[]>
  ): string[][] {
    const visited = new Set<string>();
    const components: string[][] = [];
    
    for (const uuid of entryMap.keys()) {
      if (!visited.has(uuid)) {
        const component: string[] = [];
        this.dfsComponent(uuid, entryMap, children, visited, component);
        components.push(component);
      }
    }
    
    return components;
  }
  
  /**
   * Depth-first search to find connected component.
   */
  private dfsComponent(
    uuid: string,
    entryMap: Map<string, ConversationEntry>,
    children: Map<string, string[]>,
    visited: Set<string>,
    component: string[]
  ): void {
    visited.add(uuid);
    component.push(uuid);
    
    const entry = entryMap.get(uuid);
    if (!entry) return;
    
    // Visit parent
    if (entry.parentUuid && !visited.has(entry.parentUuid) && entryMap.has(entry.parentUuid)) {
      this.dfsComponent(entry.parentUuid, entryMap, children, visited, component);
    }
    
    // Visit children
    const childrenUuids = children.get(uuid) || [];
    for (const childUuid of childrenUuids) {
      if (!visited.has(childUuid)) {
        this.dfsComponent(childUuid, entryMap, children, visited, component);
      }
    }
  }
  
  /**
   * Validate session consistency across entries.
   * 
   * @param entries - Array of conversation entries
   * @returns Session validation result
   */
  validateSessionConsistency(entries: ConversationEntry[]): {
    isValid: boolean;
    sessionIds: string[];
    inconsistentEntries: Array<{ uuid: string; expectedSession: string; actualSession: string }>;
    issues: string[];
  } {
    const sessionIds = new Set<string>();
    const inconsistentEntries: Array<{ uuid: string; expectedSession: string; actualSession: string }> = [];
    const issues: string[] = [];
    
    // Collect all session IDs
    for (const entry of entries) {
      if (entry.type === 'summary' || entry.type === 'queue-operation') {
        sessionIds.add(entry.sessionId);
      } else if (entry.type === 'file-history-snapshot') {
        // File history snapshots don't have sessionId
        continue;
      } else {
        sessionIds.add(entry.sessionId);
      }
    }
    
    // Should have exactly one session ID for a conversation file
    if (sessionIds.size === 0) {
      issues.push('No session IDs found');
    } else if (sessionIds.size > 1) {
      issues.push(`Multiple session IDs found: ${Array.from(sessionIds).join(', ')}`);
      
      // Find the most common session ID
      const sessionCounts = new Map<string, number>();
      for (const entry of entries) {
        const sessionId = entry.type === 'summary' ? entry.sessionId : entry.sessionId;
        sessionCounts.set(sessionId, (sessionCounts.get(sessionId) || 0) + 1);
      }
      
      const expectedSession = Array.from(sessionCounts.entries())
        .sort(([,a], [,b]) => b - a)[0][0];
      
      // Mark inconsistent entries
      for (const entry of entries) {
        if (entry.type === 'file-history-snapshot') continue; // No sessionId

        const actualSession = (entry.type === 'summary' || entry.type === 'queue-operation') ? entry.sessionId : entry.sessionId;
        if (actualSession !== expectedSession) {
          inconsistentEntries.push({
            uuid: entry.type === 'summary' ? entry.leafUuid : (entry.type === 'queue-operation' ? `queue-${entry.timestamp}` : entry.uuid),
            expectedSession,
            actualSession
          });
        }
      }
    }
    
    return {
      isValid: issues.length === 0,
      sessionIds: Array.from(sessionIds),
      inconsistentEntries,
      issues
    };
  }
  
  /**
   * Validate temporal ordering of conversation entries.
   * 
   * @param entries - Array of conversation entries
   * @returns Temporal validation result
   */
  validateTemporalOrder(entries: ConversationEntry[]): {
    isValid: boolean;
    outOfOrderEntries: Array<{ uuid: string; timestamp: string; expectedAfter: string }>;
    duplicateTimestamps: Array<{ timestamp: string; uuids: string[] }>;
    issues: string[];
  } {
    const outOfOrderEntries: Array<{ uuid: string; timestamp: string; expectedAfter: string }> = [];
    const duplicateTimestamps: Array<{ timestamp: string; uuids: string[] }> = [];
    const issues: string[] = [];
    
    // Group entries by timestamp
    const timestampGroups = new Map<string, string[]>();
    const entryMap = new Map<string, ConversationEntry>();
    
    for (const entry of entries) {
      if (entry.type === 'summary' || entry.type === 'queue-operation' || entry.type === 'file-history-snapshot') continue;
      
      entryMap.set(entry.uuid, entry);
      
      if (!timestampGroups.has(entry.timestamp)) {
        timestampGroups.set(entry.timestamp, []);
      }
      timestampGroups.get(entry.timestamp)!.push(entry.uuid);
    }
    
    // Find duplicate timestamps
    for (const [timestamp, uuids] of timestampGroups.entries()) {
      if (uuids.length > 1) {
        duplicateTimestamps.push({ timestamp, uuids });
      }
    }
    
    // Check parent-child temporal ordering
    for (const entry of entries) {
      if (entry.type === 'summary' || !entry.parentUuid) continue;
      
      const parent = entryMap.get(entry.parentUuid);
      if (!parent) continue;
      
      const entryTime = new Date(entry.timestamp);
      const parentTime = new Date(parent.timestamp);
      
      // Child should come after parent
      if (entryTime < parentTime) {
        outOfOrderEntries.push({
          uuid: entry.uuid,
          timestamp: entry.timestamp,
          expectedAfter: parent.timestamp
        });
      }
    }
    
    // Summary issues
    if (duplicateTimestamps.length > 0) {
      issues.push(`${duplicateTimestamps.length} duplicate timestamps found`);
    }
    
    if (outOfOrderEntries.length > 0) {
      issues.push(`${outOfOrderEntries.length} entries with incorrect temporal order`);
    }
    
    return {
      isValid: issues.length === 0,
      outOfOrderEntries,
      duplicateTimestamps,
      issues
    };
  }
  
  /**
   * Comprehensive relationship validation combining all checks.
   * 
   * @param entries - Array of conversation entries to validate
   * @returns Complete relationship validation report
   */
  validateAllRelationships(entries: ConversationEntry[]): {
    isValid: boolean;
    chainValidation: RelationshipValidationResult;
    treeStructure: ReturnType<typeof this.validateTreeStructure>;
    sessionConsistency: ReturnType<typeof this.validateSessionConsistency>;
    temporalOrder: ReturnType<typeof this.validateTemporalOrder>;
    summary: {
      totalIssues: number;
      criticalIssues: number;
      warnings: number;
    };
  } {
    const chainValidation = this.validateConversationChain(entries);
    const treeStructure = this.validateTreeStructure(entries);
    const sessionConsistency = this.validateSessionConsistency(entries);
    const temporalOrder = this.validateTemporalOrder(entries);
    
    // Count issues
    let totalIssues = 0;
    let criticalIssues = 0;
    let warnings = 0;
    
    // Chain validation issues
    totalIssues += chainValidation.orphanedEntries.length + chainValidation.circularReferences.length;
    criticalIssues += chainValidation.circularReferences.length;
    warnings += chainValidation.orphanedEntries.length;
    
    // Tree structure issues
    totalIssues += treeStructure.issues.length;
    criticalIssues += treeStructure.issues.filter(issue => 
      issue.includes('No root entries') || issue.includes('too deep')
    ).length;
    
    // Session consistency issues
    totalIssues += sessionConsistency.issues.length;
    criticalIssues += sessionConsistency.inconsistentEntries.length;
    
    // Temporal order issues
    totalIssues += temporalOrder.issues.length;
    warnings += temporalOrder.duplicateTimestamps.length + temporalOrder.outOfOrderEntries.length;
    
    const isValid = chainValidation.isValid && 
                   treeStructure.isValid && 
                   sessionConsistency.isValid && 
                   temporalOrder.isValid;
    
    return {
      isValid,
      chainValidation,
      treeStructure,
      sessionConsistency,
      temporalOrder,
      summary: {
        totalIssues,
        criticalIssues,
        warnings
      }
    };
  }
}