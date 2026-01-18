/**
 * Web Services Index
 *
 * Exports all web services for the Claude Code Conversation Workbench.
 */

// Session Cloning Service
export { SessionCloner, sessionCloner } from './session-cloner';
export type { CloneOptions, CloneResult } from './session-cloner';

// Entry Editor Service
export { EntryEditor, entryEditor } from './entry-editor';
export type { EntryUpdate, InsertOptions, EditResult } from './entry-editor';

// Session Builder Service
export {
  SessionBuilder,
  ConversationFactory,
  createSession,
} from './session-builder';
export type { MessageContent, BuilderOptions, SessionTemplate } from './session-builder';

// Conversation Generator Service
export {
  ConversationDSL,
  PatternGenerator,
  ConversationGenerator,
  conversationGenerator,
} from './conversation-generator';

// Agent SDK Bridge
export { AgentSDKBridge, agentSDKBridge } from './agent-sdk-bridge';
export type {
  SessionContext,
  ResumeOptions,
  PrebakedContext,
} from './agent-sdk-bridge';
