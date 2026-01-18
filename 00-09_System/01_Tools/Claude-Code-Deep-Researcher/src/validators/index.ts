/**
 * Main Validator Coordinator for Claude Code conversation analysis.
 * Combines all validation components and provides unified validation interface.
 */

import { SchemaValidator } from './schema-validator.ts';
import { RelationshipValidator } from './relationship-validator.ts';
import { ToolUseValidator } from './tool-use-validator.ts';
import { CompletenessChecker } from './completeness-checker.ts';

import type { 
  ConversationEntry,
  ValidationResult
} from '../types/claude-conversation.ts';

export class ConversationValidator {
  private schemaValidator = new SchemaValidator();
  private relationshipValidator = new RelationshipValidator();
  private toolUseValidator = new ToolUseValidator();
  private completenessChecker = new CompletenessChecker();
  
  /**
   * Perform comprehensive validation of conversation entries.
   * 
   * @param entries - Array of conversation entries to validate
   * @param options - Validation options
   * @returns Comprehensive validation report
   */
  async validateConversation(
    entries: ConversationEntry[],
    options: {
      includeSchema?: boolean;
      includeRelationships?: boolean;
      includeToolUsage?: boolean;
      includeCompleteness?: boolean;
      includePatterns?: boolean;
      strict?: boolean;
    } = {}
  ): Promise<ConversationValidationReport> {
    const {
      includeSchema = true,
      includeRelationships = true,
      includeToolUsage = true,
      includeCompleteness = true,
      includePatterns = true,
      strict = false
    } = options;
    
    const report: ConversationValidationReport = {
      isValid: true,
      summary: {
        totalEntries: entries.length,
        validationTypes: [],
        issuesFound: 0,
        criticalIssues: 0,
        warnings: 0
      },
      validationResults: {},
      recommendations: [],
      timestamp: new Date().toISOString()
    };
    
    try {
      // Schema validation
      if (includeSchema) {
        report.validationResults.schema = this.schemaValidator.validateEntries(entries);
        report.summary.validationTypes.push('schema');
        
        if (!report.validationResults.schema.isValid) {
          report.isValid = false;
          report.summary.issuesFound += report.validationResults.schema.errors.length;
          report.summary.criticalIssues += report.validationResults.schema.errors.length;
        }
        report.summary.warnings += report.validationResults.schema.warnings.length;
      }
      
      // Relationship validation
      if (includeRelationships) {
        report.validationResults.relationships = this.relationshipValidator.validateAllRelationships(entries);
        report.summary.validationTypes.push('relationships');
        
        if (!report.validationResults.relationships.isValid) {
          report.isValid = false;
          report.summary.issuesFound += report.validationResults.relationships.summary.totalIssues;
          report.summary.criticalIssues += report.validationResults.relationships.summary.criticalIssues;
        }
        report.summary.warnings += report.validationResults.relationships.summary.warnings;
      }
      
      // Tool usage validation
      if (includeToolUsage) {
        report.validationResults.toolUsage = this.toolUseValidator.validateToolUsage(entries);
        report.summary.validationTypes.push('toolUsage');
        
        if (!report.validationResults.toolUsage.isValid) {
          report.isValid = false;
          report.summary.issuesFound += report.validationResults.toolUsage.invalidToolUses.length + 
                                        report.validationResults.toolUsage.missingToolResults.length;
        }
      }
      
      // Completeness validation
      if (includeCompleteness) {
        report.validationResults.completeness = this.completenessChecker.checkConversationCompleteness(entries);
        report.summary.validationTypes.push('completeness');
        
        if (!report.validationResults.completeness.isComplete) {
          report.isValid = false;
          report.summary.issuesFound += report.validationResults.completeness.missingComponents.length + 
                                        report.validationResults.completeness.structuralIssues.length;
        }
      }
      
      // Pattern analysis
      if (includePatterns) {
        report.validationResults.patterns = this.completenessChecker.checkConversationPatterns(entries);
        report.summary.validationTypes.push('patterns');
      }
      
      // Generate recommendations
      this.generateRecommendations(report);
      
      // Apply strict mode if enabled
      if (strict) {
        this.applyStrictValidation(report);
      }
      
    } catch (error) {
      report.isValid = false;
      report.error = error instanceof Error ? error.message : String(error);
      report.summary.criticalIssues++;
    }
    
    return report;
  }
  
  /**
   * Quick validation for basic conversation structure.
   * 
   * @param entries - Array of conversation entries
   * @returns Quick validation result
   */
  quickValidate(entries: ConversationEntry[]): {
    isValid: boolean;
    criticalIssues: string[];
    entryCount: number;
    hasErrors: boolean;
  } {
    const criticalIssues: string[] = [];
    
    if (entries.length === 0) {
      criticalIssues.push('No entries found');
    }
    
    // Check for basic structure
    const hasUser = entries.some(e => e.type === 'user');
    const hasAssistant = entries.some(e => e.type === 'assistant');
    
    if (!hasUser) {
      criticalIssues.push('No user messages found');
    }
    
    if (!hasAssistant) {
      criticalIssues.push('No assistant messages found');
    }
    
    // Check for duplicate UUIDs
    const uuids = new Set<string>();
    for (const entry of entries) {
      if (entry.type === 'summary') continue;
      
      if (uuids.has(entry.uuid)) {
        criticalIssues.push(`Duplicate UUID: ${entry.uuid}`);
        break;
      }
      uuids.add(entry.uuid);
    }
    
    // Check for session consistency
    const sessionIds = new Set(entries.map(e => 
      e.type === 'summary' ? e.sessionId : e.sessionId
    ));
    
    if (sessionIds.size > 1) {
      criticalIssues.push(`Multiple session IDs: ${Array.from(sessionIds).join(', ')}`);
    }
    
    return {
      isValid: criticalIssues.length === 0,
      criticalIssues,
      entryCount: entries.length,
      hasErrors: criticalIssues.length > 0
    };
  }
  
  /**
   * Generate validation recommendations based on results.
   */
  private generateRecommendations(report: ConversationValidationReport): void {
    const recommendations: string[] = [];
    
    // Schema recommendations
    if (report.validationResults.schema && !report.validationResults.schema.isValid) {
      recommendations.push('Fix schema validation errors to ensure data integrity');
      if (report.validationResults.schema.errors.some(e => e.includes('Missing'))) {
        recommendations.push('Add missing required fields to conversation entries');
      }
    }
    
    // Relationship recommendations
    if (report.validationResults.relationships && !report.validationResults.relationships.isValid) {
      recommendations.push('Resolve relationship issues to maintain conversation structure');
      if (report.validationResults.relationships.chainValidation.orphanedEntries.length > 0) {
        recommendations.push('Fix orphaned entries by correcting parent UUID references');
      }
      if (report.validationResults.relationships.chainValidation.circularReferences.length > 0) {
        recommendations.push('Remove circular references in conversation hierarchy');
      }
    }
    
    // Tool usage recommendations
    if (report.validationResults.toolUsage && !report.validationResults.toolUsage.isValid) {
      recommendations.push('Review tool usage patterns and fix tool-result mismatches');
      if (report.validationResults.toolUsage.missingToolResults.length > 0) {
        recommendations.push('Ensure all tool uses have corresponding results');
      }
    }
    
    // Completeness recommendations
    if (report.validationResults.completeness && !report.validationResults.completeness.isComplete) {
      recommendations.push(...report.validationResults.completeness.recommendations);
    }
    
    // Pattern recommendations
    if (report.validationResults.patterns) {
      recommendations.push(...report.validationResults.patterns.insights);
    }
    
    report.recommendations = recommendations;
  }
  
  /**
   * Apply strict validation rules.
   */
  private applyStrictValidation(report: ConversationValidationReport): void {
    // In strict mode, warnings become errors
    if (report.summary.warnings > 0) {
      report.isValid = false;
      report.summary.criticalIssues += report.summary.warnings;
      report.recommendations.unshift('Strict mode: Address all warnings to pass validation');
    }
    
    // Strict pattern requirements
    if (report.validationResults.patterns) {
      const patterns = report.validationResults.patterns.patterns;
      
      if (!patterns.hasProperTaskStructure) {
        report.isValid = false;
        report.summary.criticalIssues++;
        report.recommendations.unshift('Strict mode: Proper task structure is required');
      }
      
      if (!patterns.hasValidation) {
        report.isValid = false;
        report.summary.criticalIssues++;
        report.recommendations.unshift('Strict mode: Validation steps are required');
      }
    }
  }
  
  /**
   * Format validation report for human consumption.
   * 
   * @param report - Validation report to format
   * @returns Formatted report string
   */
  formatReport(report: ConversationValidationReport): string {
    const lines: string[] = [];
    
    lines.push('🔍 Conversation Validation Report');
    lines.push('═'.repeat(50));
    lines.push('');
    
    // Summary
    lines.push(`📊 Summary:`);
    lines.push(`   Status: ${report.isValid ? '✅ Valid' : '❌ Invalid'}`);
    lines.push(`   Entries: ${report.summary.totalEntries}`);
    lines.push(`   Validation Types: ${report.summary.validationTypes.join(', ')}`);
    lines.push(`   Issues Found: ${report.summary.issuesFound}`);
    lines.push(`   Critical Issues: ${report.summary.criticalIssues}`);
    lines.push(`   Warnings: ${report.summary.warnings}`);
    lines.push('');
    
    // Schema validation
    if (report.validationResults.schema) {
      lines.push(`📋 Schema Validation: ${report.validationResults.schema.isValid ? '✅' : '❌'}`);
      if (report.validationResults.schema.errors.length > 0) {
        lines.push('   Errors:');
        report.validationResults.schema.errors.slice(0, 5).forEach(error => {
          lines.push(`     • ${error}`);
        });
        if (report.validationResults.schema.errors.length > 5) {
          lines.push(`     ... and ${report.validationResults.schema.errors.length - 5} more`);
        }
      }
      if (report.validationResults.schema.warnings.length > 0) {
        lines.push('   Warnings:');
        report.validationResults.schema.warnings.slice(0, 3).forEach(warning => {
          lines.push(`     ⚠️  ${warning}`);
        });
      }
      lines.push('');
    }
    
    // Relationship validation
    if (report.validationResults.relationships) {
      lines.push(`🔗 Relationship Validation: ${report.validationResults.relationships.isValid ? '✅' : '❌'}`);
      const rel = report.validationResults.relationships;
      
      if (rel.chainValidation.orphanedEntries.length > 0) {
        lines.push(`   Orphaned Entries: ${rel.chainValidation.orphanedEntries.length}`);
      }
      if (rel.chainValidation.circularReferences.length > 0) {
        lines.push(`   Circular References: ${rel.chainValidation.circularReferences.length}`);
      }
      if (rel.treeStructure.issues.length > 0) {
        lines.push('   Structure Issues:');
        rel.treeStructure.issues.forEach(issue => {
          lines.push(`     • ${issue}`);
        });
      }
      lines.push('');
    }
    
    // Tool usage validation
    if (report.validationResults.toolUsage) {
      lines.push(`🛠️  Tool Usage Validation: ${report.validationResults.toolUsage.isValid ? '✅' : '❌'}`);
      const tools = report.validationResults.toolUsage;
      
      if (tools.invalidToolUses.length > 0) {
        lines.push(`   Invalid Tool Uses: ${tools.invalidToolUses.length}`);
        tools.invalidToolUses.slice(0, 3).forEach(issue => {
          lines.push(`     • ${issue.toolName}: ${issue.issue}`);
        });
      }
      if (tools.missingToolResults.length > 0) {
        lines.push(`   Missing Tool Results: ${tools.missingToolResults.length}`);
      }
      lines.push('');
    }
    
    // Completeness validation
    if (report.validationResults.completeness) {
      lines.push(`✅ Completeness Check: ${report.validationResults.completeness.isComplete ? '✅' : '❌'}`);
      const comp = report.validationResults.completeness;
      
      if (comp.missingComponents.length > 0) {
        lines.push('   Missing Components:');
        comp.missingComponents.forEach(component => {
          lines.push(`     • ${component}`);
        });
      }
      if (comp.structuralIssues.length > 0) {
        lines.push('   Structural Issues:');
        comp.structuralIssues.forEach(issue => {
          lines.push(`     • ${issue}`);
        });
      }
      lines.push('');
    }
    
    // Recommendations
    if (report.recommendations.length > 0) {
      lines.push('💡 Recommendations:');
      report.recommendations.slice(0, 10).forEach((rec, index) => {
        lines.push(`   ${index + 1}. ${rec}`);
      });
      if (report.recommendations.length > 10) {
        lines.push(`   ... and ${report.recommendations.length - 10} more recommendations`);
      }
      lines.push('');
    }
    
    // Error information
    if (report.error) {
      lines.push('❌ Validation Error:');
      lines.push(`   ${report.error}`);
      lines.push('');
    }
    
    lines.push(`Generated: ${new Date(report.timestamp).toLocaleString()}`);
    
    return lines.join('\n');
  }
}

// Types for validation reporting
export interface ConversationValidationReport {
  isValid: boolean;
  summary: {
    totalEntries: number;
    validationTypes: string[];
    issuesFound: number;
    criticalIssues: number;
    warnings: number;
  };
  validationResults: {
    schema?: ValidationResult;
    relationships?: ReturnType<RelationshipValidator['validateAllRelationships']>;
    toolUsage?: ReturnType<ToolUseValidator['validateToolUsage']>;
    completeness?: ReturnType<CompletenessChecker['checkConversationCompleteness']>;
    patterns?: ReturnType<CompletenessChecker['checkConversationPatterns']>;
  };
  recommendations: string[];
  timestamp: string;
  error?: string;
}

// Export all validators
export {
  SchemaValidator,
  RelationshipValidator,
  ToolUseValidator,
  CompletenessChecker
};