/**
 * Web Services Tests
 *
 * Tests for the web services layer.
 */

import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { SessionBuilder, createSession, ConversationFactory } from '../src/web/services/session-builder';
import { ConversationDSL, PatternGenerator, conversationGenerator } from '../src/web/services/conversation-generator';

describe('SessionBuilder', () => {
  test('creates session with user and assistant messages', () => {
    const builder = createSession({
      projectPath: '/test/project',
    });

    builder
      .addUserMessage('Hello!')
      .addAssistantMessage('Hi there!');

    const entries = builder.getEntries();
    expect(entries.length).toBe(2);
    expect(entries[0].type).toBe('user');
    expect(entries[1].type).toBe('assistant');
  });

  test('creates session with system prompt', () => {
    const builder = createSession({
      projectPath: '/test/project',
      systemPrompt: 'You are a helpful assistant.',
    });

    const entries = builder.getEntries();
    expect(entries.length).toBe(1);
    expect(entries[0].type).toBe('system');
  });

  test('creates tool interactions', () => {
    const builder = createSession({ projectPath: '/test' });

    builder
      .addUserMessage('Read the file')
      .addToolInteraction('Read', { file_path: '/test.txt' }, 'File contents here');

    const entries = builder.getEntries();
    expect(entries.length).toBe(3);

    // Check tool use entry
    const toolUse = entries[1];
    expect(toolUse.type).toBe('assistant');
    expect('toolUseId' in toolUse).toBe(true);

    // Check tool result entry
    const toolResult = entries[2];
    expect('toolResultBlockId' in toolResult).toBe(true);
  });

  test('maintains UUID chain', () => {
    const builder = createSession({ projectPath: '/test' });

    builder
      .addUserMessage('First')
      .addAssistantMessage('Second')
      .addUserMessage('Third');

    const entries = builder.getEntries();

    // First entry has no parent
    expect(entries[0].parentUuid).toBeUndefined();

    // Subsequent entries have parent UUID
    expect(entries[1].parentUuid).toBe(entries[0].uuid);
    expect(entries[2].parentUuid).toBe(entries[1].uuid);
  });

  test('adds turn helper', () => {
    const builder = createSession({ projectPath: '/test' });

    builder.addTurn('Question?', 'Answer!');

    const entries = builder.getEntries();
    expect(entries.length).toBe(2);
  });

  test('generates unique session ID', () => {
    const builder1 = createSession({ projectPath: '/test' });
    const builder2 = createSession({ projectPath: '/test' });

    expect(builder1.getSessionId()).not.toBe(builder2.getSessionId());
  });
});

describe('ConversationFactory', () => {
  test('creates Q&A session', () => {
    const builder = ConversationFactory.createQASession(
      '/test',
      'What is TypeScript?',
      'TypeScript is a typed superset of JavaScript.'
    );

    const entries = builder.getEntries();
    expect(entries.length).toBe(2);
  });

  test('creates code review session', () => {
    const builder = ConversationFactory.createCodeReviewSession(
      '/test',
      'const x = 1;',
      '/src/index.ts'
    );

    const entries = builder.getEntries();
    expect(entries.length).toBe(2); // system + user
    expect(entries[0].type).toBe('system');
  });
});

describe('ConversationDSL', () => {
  test('parses user and assistant messages', () => {
    const dsl = `
@user "Hello, how are you?"
@assistant "I'm doing well, thank you!"
    `.trim();

    const parser = new ConversationDSL();
    const builder = parser.parse(dsl, '/test');
    const entries = builder.getEntries();

    expect(entries.length).toBe(2);
    expect(entries[0].type).toBe('user');
    expect(entries[1].type).toBe('assistant');
  });

  test('parses system prompt', () => {
    const dsl = `
@system "You are a helpful assistant"
@user "Hi"
    `.trim();

    const parser = new ConversationDSL();
    const builder = parser.parse(dsl, '/test');
    const entries = builder.getEntries();

    expect(entries.length).toBe(2);
    expect(entries[0].type).toBe('system');
  });

  test('skips comments', () => {
    const dsl = `
# This is a comment
@user "Hello"
// Another comment
@assistant "Hi"
    `.trim();

    const parser = new ConversationDSL();
    const builder = parser.parse(dsl, '/test');
    const entries = builder.getEntries();

    expect(entries.length).toBe(2);
  });
});

describe('PatternGenerator', () => {
  test('generates multi-turn conversation', () => {
    const builder = PatternGenerator.generateMultiTurn('/test', [
      { user: 'Hello', assistant: 'Hi!' },
      { user: 'How are you?', assistant: 'Great!' },
    ]);

    const entries = builder.getEntries();
    expect(entries.length).toBe(4);
  });

  test('generates tool session', () => {
    const builder = PatternGenerator.generateToolSession('/test', [
      { name: 'Read', input: { file_path: '/a.txt' }, result: 'A' },
      { name: 'Write', input: { file_path: '/b.txt', content: 'B' }, result: 'Done' },
    ]);

    const entries = builder.getEntries();
    // system + user + (tool_use + tool_result) * 2 + assistant
    expect(entries.length).toBeGreaterThanOrEqual(6);
  });
});

describe('ConversationGenerator', () => {
  test('generates from DSL', () => {
    const dsl = '@user "Test"\n@assistant "Response"';
    const builder = conversationGenerator.fromDSL(dsl, '/test');

    expect(builder.getEntries().length).toBe(2);
  });

  test('generates multi-turn', () => {
    const builder = conversationGenerator.multiTurn('/test', [
      { user: 'A', assistant: 'B' },
    ]);

    expect(builder.getEntries().length).toBe(2);
  });

  test('generates from JSON template', () => {
    const builder = conversationGenerator.fromJSON({
      systemPrompt: 'Test system',
      entries: [
        { type: 'user', content: 'Hello' },
        { type: 'assistant', content: 'Hi' },
      ],
    }, '/test');

    const entries = builder.getEntries();
    expect(entries.length).toBe(3); // system + user + assistant
  });
});
