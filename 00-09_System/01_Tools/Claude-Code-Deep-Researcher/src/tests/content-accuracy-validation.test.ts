import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { EnhancedContentOptimizer, CondensationStrategy } from '../services/enhanced-content-optimizer';
import { ClaudeCodeService } from '../services/claude-code';
import { ConfigManager } from '../config/config-manager';

// Mock dependencies
const mockClaudeCodeService = {
  runPrompt: async (prompt: string) => {
    // Simulate intelligent content condensation
    if (prompt.includes('condense') || prompt.includes('optimize')) {
      // Return a condensed version that maintains factual accuracy
      const originalContent = extractContentFromPrompt(prompt);
      const condensedContent = simulateFactualCondensation(originalContent);
      return {
        success: true,
        sessionId: 'test-session',
        response: condensedContent,
        usage: { tokens: 500 }
      };
    }
    return {
      success: true,
      sessionId: 'test-session',
      response: 'Default response',
      usage: { tokens: 100 }
    };
  }
} as ClaudeCodeService;

const mockConfigManager = {
  getPrebakeConfig: () => ({
    stage3: {
      targetCondensationRatio: 0.3,
      maxContentSize: 10000,
      maintainFactualAccuracy: true,
      contentTypeRatios: {
        code: 0.2,
        logs: 0.1,
        documents: 0.3,
        transcripts: 0.4
      }
    }
  })
} as ConfigManager;

describe('Content Accuracy Preservation Tests', () => {
  let optimizer: EnhancedContentOptimizer;
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(join(tmpdir(), 'content-accuracy-test-'));
    optimizer = new EnhancedContentOptimizer(mockClaudeCodeService, mockConfigManager);
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('Information Fabrication Prevention', () => {
    test('should never add information not present in original content', async () => {
      const originalCode = `
function calculateTax(income: number): number {
  const taxRate = 0.25;
  return income * taxRate;
}

// This function calculates tax at 25% rate
export { calculateTax };
`;

      const condensedResult = await optimizer.condenseContent(originalCode, 'code', 0.3);

      expect(condensedResult.success).toBe(true);
      expect(condensedResult.content).toBeDefined();

      // Verify no new information was added
      const originalFacts = extractFactsFromCode(originalCode);
      const condensedFacts = extractFactsFromCode(condensedResult.content!);

      // All facts in condensed version should exist in original
      condensedFacts.forEach(fact => {
        expect(originalFacts).toContain(fact);
      });

      // Verify no fabricated details
      expect(condensedResult.content).not.toContain('30%'); // Wrong tax rate
      expect(condensedResult.content).not.toContain('progressive'); // Tax type not mentioned
      expect(condensedResult.content).not.toContain('deductions'); // Not mentioned originally
    });

    test('should preserve all essential numerical data', async () => {
      const originalConfig = `
{
  "database": {
    "host": "localhost",
    "port": 5432,
    "timeout": 30000,
    "maxConnections": 100,
    "retryAttempts": 3
  },
  "api": {
    "version": "1.2.0",
    "rateLimit": 1000,
    "cacheExpiry": 3600
  }
}
`;

      const condensedResult = await optimizer.condenseContent(originalConfig, 'documents', 0.4);

      expect(condensedResult.success).toBe(true);
      
      // Extract all numbers from both versions
      const originalNumbers = extractNumbers(originalConfig);
      const condensedNumbers = extractNumbers(condensedResult.content!);

      // Verify all critical numbers are preserved
      expect(condensedNumbers).toContain('5432'); // port
      expect(condensedNumbers).toContain('30000'); // timeout
      expect(condensedNumbers).toContain('100'); // maxConnections
      expect(condensedNumbers).toContain('3'); // retryAttempts
      expect(condensedNumbers).toContain('1000'); // rateLimit
      expect(condensedNumbers).toContain('3600'); // cacheExpiry

      // Verify version number format is preserved
      expect(condensedResult.content).toContain('1.2.0');
    });

    test('should maintain exact API signatures and method names', async () => {
      const originalAPI = `
/**
 * User authentication service
 * @param credentials User login credentials
 * @returns Promise<AuthResult>
 */
export class AuthService {
  async authenticate(credentials: LoginCredentials): Promise<AuthResult> {
    const validation = await this.validateCredentials(credentials);
    if (!validation.isValid) {
      throw new AuthenticationError('Invalid credentials provided');
    }
    return this.generateAuthToken(validation.user);
  }

  private async validateCredentials(creds: LoginCredentials): Promise<ValidationResult> {
    // Validation logic here
    return { isValid: true, user: creds.username };
  }

  private generateAuthToken(user: string): AuthResult {
    return { token: 'jwt-token', user, expiresAt: Date.now() + 3600000 };
  }
}
`;

      const condensedResult = await optimizer.condenseContent(originalAPI, 'code', 0.4);

      expect(condensedResult.success).toBe(true);

      // Verify method signatures are preserved exactly
      expect(condensedResult.content).toContain('authenticate(credentials: LoginCredentials): Promise<AuthResult>');
      expect(condensedResult.content).toContain('validateCredentials(creds: LoginCredentials): Promise<ValidationResult>');
      expect(condensedResult.content).toContain('generateAuthToken(user: string): AuthResult');

      // Verify class name is preserved
      expect(condensedResult.content).toContain('class AuthService');

      // Verify critical error messages are preserved
      expect(condensedResult.content).toContain('Invalid credentials provided');
    });

    test('should preserve exact error messages and status codes', async () => {
      const originalErrorHandling = `
export const ErrorCodes = {
  INVALID_INPUT: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500
};

export const ErrorMessages = {
  INVALID_EMAIL: 'Email format is invalid',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
  ACCOUNT_LOCKED: 'Account locked due to multiple failed attempts',
  TOKEN_EXPIRED: 'Authentication token has expired'
};
`;

      const condensedResult = await optimizer.condenseContent(originalErrorHandling, 'code', 0.3);

      expect(condensedResult.success).toBe(true);

      // Verify all HTTP status codes are preserved
      expect(condensedResult.content).toContain('400');
      expect(condensedResult.content).toContain('401');
      expect(condensedResult.content).toContain('403');
      expect(condensedResult.content).toContain('404');
      expect(condensedResult.content).toContain('429');
      expect(condensedResult.content).toContain('500');

      // Verify exact error messages are preserved
      expect(condensedResult.content).toContain('Email format is invalid');
      expect(condensedResult.content).toContain('Password must be at least 8 characters');
      expect(condensedResult.content).toContain('Account locked due to multiple failed attempts');
      expect(condensedResult.content).toContain('Authentication token has expired');
    });
  });

  describe('Factual Accuracy Validation', () => {
    test('should validate facts before and after condensation', async () => {
      const originalDocumentation = `
# Database Configuration

Our application uses PostgreSQL version 13.4 as the primary database.
Connection pool size is configured to 50 connections maximum.
Database backups are performed every 6 hours using pg_dump.
Replication lag is monitored and should not exceed 5 seconds.
The database server has 32GB RAM and 8 CPU cores allocated.
`;

      const result = await optimizer.condenseContent(originalDocumentation, 'documents', 0.4);

      expect(result.success).toBe(true);
      expect(result.accuracyValidation).toBeDefined();
      expect(result.accuracyValidation!.passed).toBe(true);

      // Verify specific facts are preserved
      expect(result.content).toContain('PostgreSQL');
      expect(result.content).toContain('13.4');
      expect(result.content).toContain('50');
      expect(result.content).toContain('6 hours');
      expect(result.content).toContain('5 seconds');
      expect(result.content).toContain('32GB');
      expect(result.content).toContain('8 CPU cores');

      // Verify accuracy metrics
      expect(result.accuracyValidation!.factPreservationRate).toBeGreaterThan(0.95);
      expect(result.accuracyValidation!.fabricatedContentDetected).toBe(false);
    });

    test('should detect and prevent factual inaccuracies', async () => {
      // Mock a Claude service that introduces inaccuracies
      const inaccurateClaudeService = {
        runPrompt: async (prompt: string) => {
          // Simulate Claude making factual errors
          const inaccurateResponse = `
function calculateTax(income: number): number {
  const taxRate = 0.30; // WRONG: Original was 0.25
  return income * taxRate;
}
// This function calculates tax at 30% rate - FABRICATED
export { calculateTax };
`;
          return {
            success: true,
            sessionId: 'test-session',
            response: inaccurateResponse,
            usage: { tokens: 300 }
          };
        }
      } as ClaudeCodeService;

      const inaccurateOptimizer = new EnhancedContentOptimizer(inaccurateClaudeService, mockConfigManager);

      const originalCode = `
function calculateTax(income: number): number {
  const taxRate = 0.25;
  return income * taxRate;
}
// This function calculates tax at 25% rate
export { calculateTax };
`;

      const result = await inaccurateOptimizer.condenseContent(originalCode, 'code', 0.3);

      // Should detect inaccuracy and trigger rollback
      expect(result.success).toBe(false);
      expect(result.error).toContain('accuracy validation failed');
      expect(result.accuracyValidation!.passed).toBe(false);
      expect(result.accuracyValidation!.fabricatedContentDetected).toBe(true);
      expect(result.accuracyValidation!.inaccuraciesFound).toContain('tax rate changed from 0.25 to 0.30');
    });

    test('should perform cross-validation of condensed content', async () => {
      const originalLogEntry = `
[2024-01-15 14:23:45] INFO: User login successful
  - UserID: 12345
  - SessionID: sess_abc123def456
  - IP Address: 192.168.1.100
  - Browser: Mozilla/5.0 (Chrome/120.0.0.0)
  - Login Duration: 245ms
  - Authentication Method: OAuth2
[2024-01-15 14:23:46] DEBUG: Session created in database
  - Table: user_sessions
  - Primary Key: 98765
  - Expiry: 2024-01-15 18:23:45
`;

      const result = await optimizer.condenseContent(originalLogEntry, 'logs', 0.5);

      expect(result.success).toBe(true);
      expect(result.accuracyValidation!.crossValidationPassed).toBe(true);

      // Verify timestamp consistency
      expect(result.content).toContain('2024-01-15');
      expect(result.content).toContain('14:23:45');
      expect(result.content).toContain('14:23:46');

      // Verify data relationships are preserved
      expect(result.content).toContain('12345'); // UserID
      expect(result.content).toContain('sess_abc123def456'); // SessionID
      expect(result.content).toContain('98765'); // Primary Key
    });

    test('should validate numerical consistency', async () => {
      const originalMetrics = `
Performance Metrics for API Endpoint /users/search:
- Total Requests: 15,847
- Successful Responses: 15,234 (96.13%)
- Failed Responses: 613 (3.87%)
- Average Response Time: 127ms
- 95th Percentile: 298ms
- 99th Percentile: 845ms
- Cache Hit Rate: 78.5%
- Database Queries: 12,678
- Memory Usage: 256MB peak
`;

      const result = await optimizer.condenseContent(originalMetrics, 'logs', 0.4);

      expect(result.success).toBe(true);
      expect(result.accuracyValidation!.numericalConsistency).toBe(true);

      // Verify arithmetic relationships are preserved
      const content = result.content!;
      expect(content).toContain('15,847'); // Total
      expect(content).toContain('15,234'); // Success
      expect(content).toContain('613'); // Failed
      expect(content).toContain('96.13%'); // Success rate
      expect(content).toContain('3.87%'); // Failure rate

      // Verify percentages add up to 100%
      expect(result.accuracyValidation!.calculationErrors).toHaveLength(0);
    });
  });

  describe('Rollback Capability for Failed Condensations', () => {
    test('should rollback when accuracy validation fails', async () => {
      const originalContent = `
const API_CONFIG = {
  baseURL: 'https://api.example.com/v1',
  timeout: 5000,
  retries: 3,
  version: '1.0.0'
};
`;

      // Mock service that introduces errors
      const errorProneService = {
        runPrompt: async (prompt: string) => ({
          success: true,
          sessionId: 'test-session',
          response: `
const API_CONFIG = {
  baseURL: 'https://api.different.com/v2', // WRONG URL
  timeout: 10000, // WRONG timeout
  retries: 5, // WRONG retries
  version: '2.0.0' // WRONG version
};
`,
          usage: { tokens: 200 }
        })
      } as ClaudeCodeService;

      const errorProneOptimizer = new EnhancedContentOptimizer(errorProneService, mockConfigManager);

      const result = await errorProneOptimizer.condenseContent(originalContent, 'code', 0.3);

      expect(result.success).toBe(false);
      expect(result.rollbackPerformed).toBe(true);
      expect(result.content).toBe(originalContent); // Should return original
      expect(result.error).toContain('accuracy validation failed');
      expect(result.rollbackReason).toContain('factual inaccuracies detected');
    });

    test('should provide detailed rollback information', async () => {
      const originalData = `
Database Configuration:
- Host: db.production.com
- Port: 5432
- SSL: enabled
- Connection Pool: 20-50 connections
- Backup Schedule: daily at 2:00 AM UTC
`;

      const corruptingService = {
        runPrompt: async (prompt: string) => ({
          success: true,
          sessionId: 'test-session',
          response: `
Database Configuration:
- Host: db.staging.com  // WRONG environment
- Port: 3306  // WRONG port (MySQL instead of PostgreSQL)
- SSL: disabled  // WRONG security setting
- Connection Pool: 10-30 connections  // WRONG range
- Backup Schedule: weekly at 3:00 AM EST  // WRONG frequency and timezone
`,
          usage: { tokens: 250 }
        })
      } as ClaudeCodeService;

      const corruptingOptimizer = new EnhancedContentOptimizer(corruptingService, mockConfigManager);

      const result = await corruptingOptimizer.condenseContent(originalData, 'documents', 0.4);

      expect(result.success).toBe(false);
      expect(result.rollbackPerformed).toBe(true);
      expect(result.rollbackDetails).toBeDefined();
      expect(result.rollbackDetails!.inaccuraciesDetected).toBeGreaterThan(0);
      expect(result.rollbackDetails!.criticalErrorsFound).toContain('host changed');
      expect(result.rollbackDetails!.criticalErrorsFound).toContain('port changed');
      expect(result.rollbackDetails!.criticalErrorsFound).toContain('SSL setting changed');
    });

    test('should handle partial rollback scenarios', async () => {
      const complexContent = `
# Authentication System
## OAuth Configuration
- Client ID: oauth_client_12345
- Redirect URI: https://app.example.com/callback
- Scopes: read, write, admin
- Token Expiry: 3600 seconds

## Database Schema
\`\`\`sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

## Rate Limiting
- Rate: 100 requests per minute
- Burst: 200 requests
- Window: 60 seconds
`;

      const partiallyCorruptingService = {
        runPrompt: async (prompt: string) => ({
          success: true,
          sessionId: 'test-session',
          response: `
# Authentication System
## OAuth Configuration
- Client ID: oauth_client_12345  // CORRECT
- Redirect URI: https://app.different.com/callback  // WRONG domain
- Scopes: read, write, admin  // CORRECT
- Token Expiry: 7200 seconds  // WRONG expiry

## Database Schema
\\\`\\\`\\\`sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,  // CORRECT
  email VARCHAR(255) UNIQUE NOT NULL,  // CORRECT
  created_at TIMESTAMP DEFAULT NOW()  // CORRECT
);
\\\`\\\`\\\`

## Rate Limiting
- Rate: 100 requests per minute  // CORRECT
- Burst: 200 requests  // CORRECT
- Window: 60 seconds  // CORRECT
`,
          messages: []
        })
      } as ClaudeCodeService;

      const partiallyCorruptingOptimizer = new EnhancedContentOptimizer(partiallyCorruptingService, mockConfigManager);

      const result = await partiallyCorruptingOptimizer.condenseContent(complexContent, 'documents', 0.3);

      expect(result.success).toBe(false);
      expect(result.rollbackPerformed).toBe(true);
      expect(result.partialValidation).toBeDefined();
      expect(result.partialValidation!.sectionsValidated).toBe(3);
      expect(result.partialValidation!.sectionsWithErrors).toBe(1); // Only OAuth section has errors
      expect(result.partialValidation!.errorsBySection['OAuth Configuration']).toContain('redirect URI changed');
    });

    test('should preserve original formatting after rollback', async () => {
      const originalWithFormatting = `
/**
 * Calculate compound interest
 * @param principal - Initial amount
 * @param rate - Annual interest rate (decimal)
 * @param time - Time period in years
 * @param compounds - Compounding frequency per year
 * @returns Final amount after compound interest
 */
function compoundInterest(
  principal: number,
  rate: number,
  time: number,
  compounds: number = 12
): number {
  return principal * Math.pow(1 + rate / compounds, compounds * time);
}

export { compoundInterest };
`;

      const formattingCorruptingService = {
        runPrompt: async (prompt: string) => ({
          success: true,
          sessionId: 'test-session',
          response: `function compoundInterest(principal,rate,time,compounds=12){return principal*Math.pow(1+rate/compounds,compounds*time);}export{compoundInterest};`, // Wrong: lost all formatting and comments
          usage: { tokens: 150 }
        })
      } as ClaudeCodeService;

      const formattingCorruptingOptimizer = new EnhancedContentOptimizer(formattingCorruptingService, mockConfigManager);

      const result = await formattingCorruptingOptimizer.condenseContent(originalWithFormatting, 'code', 0.5);

      expect(result.success).toBe(false);
      expect(result.rollbackPerformed).toBe(true);
      expect(result.content).toBe(originalWithFormatting); // Original formatting preserved
      expect(result.rollbackReason).toContain('significant formatting loss detected');
    });
  });

  describe('Type Safety with Proper JSONL Types', () => {
    test('should validate JSONL entry types during condensation', async () => {
      const jsonlEntry = {
        type: 'assistant',
        uuid: 'assistant-123',
        parentMessageUuid: 'user-456',
        content: [
          {
            type: 'text',
            text: `Here's a comprehensive implementation of the user authentication system:

\`\`\`typescript
export interface UserCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export class AuthenticationService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
  private readonly TOKEN_EXPIRY = '24h';

  async authenticate(credentials: UserCredentials): Promise<AuthResult> {
    const user = await this.validateUser(credentials);
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }
    
    const token = this.generateJWT(user);
    return {
      success: true,
      user: user,
      token: token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };
  }
}
\`\`\`

This implementation provides secure authentication with JWT tokens.`
          }
        ],
        created_at: new Date().toISOString()
      };

      const result = await optimizer.condenseConversationEntry(jsonlEntry);

      expect(result.success).toBe(true);
      expect(result.entry).toBeDefined();
      expect(result.entry!.type).toBe('assistant');
      expect(result.entry!.uuid).toBe('assistant-123');
      expect(result.entry!.parentMessageUuid).toBe('user-456');
      expect(result.typeValidation!.passed).toBe(true);
      expect(result.typeValidation!.originalType).toBe('assistant');
      expect(result.typeValidation!.preservedType).toBe('assistant');
    });

    test('should handle tool result content condensation safely', async () => {
      const toolResultEntry = {
        type: 'tool_result',
        uuid: 'tool-result-789',
        parentMessageUuid: 'tool-use-456',
        content: [
          {
            type: 'text',
            text: `File read successfully. Content:

package.json:
{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2",
    "lodash": "^4.17.21",
    "mongoose": "^7.5.0",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "typescript": "^5.2.2",
    "jest": "^29.7.0",
    "@types/node": "^20.6.0"
  },
  "scripts": {
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "test": "jest"
  }
}

File size: 2,847 bytes
Last modified: 2024-01-15 10:30:45 UTC`
          }
        ],
        created_at: new Date().toISOString()
      };

      const result = await optimizer.condenseConversationEntry(toolResultEntry);

      expect(result.success).toBe(true);
      expect(result.entry!.type).toBe('tool_result');
      expect(result.entry!.uuid).toBe('tool-result-789');
      expect(result.entry!.parentMessageUuid).toBe('tool-use-456');

      // Verify package.json structure is preserved
      const condensedText = result.entry!.content[0].text;
      expect(condensedText).toContain('"name": "my-app"');
      expect(condensedText).toContain('"version": "1.0.0"');
      expect(condensedText).toContain('"express": "^4.18.2"');
      expect(condensedText).toContain('"typescript": "^5.2.2"');

      // Verify metadata is preserved  
      expect(condensedText).toContain('2,847 bytes');
      expect(condensedText).toContain('2024-01-15 10:30:45 UTC');
    });

    test('should maintain proper parent-child relationships in condensed entries', async () => {
      const userMessage = {
        type: 'user',
        uuid: 'user-111',
        content: [{ type: 'text', text: 'Please analyze the performance of our authentication system' }],
        created_at: new Date().toISOString()
      };

      const assistantMessage = {
        type: 'assistant',
        uuid: 'assistant-222',
        parentMessageUuid: 'user-111',
        content: [
          { type: 'text', text: 'I\'ll analyze the authentication system performance. Let me read the relevant files.' },
          { type: 'tool_use', uuid: 'tool-use-333', name: 'read_file', input: { path: 'src/auth/service.ts' } }
        ],
        created_at: new Date().toISOString()
      };

      const toolResult = {
        type: 'tool_result',
        uuid: 'tool-result-444',
        parentMessageUuid: 'tool-use-333',
        content: [{ type: 'text', text: 'Authentication service code here...' }],
        created_at: new Date().toISOString()
      };

      // Condense each entry
      const userResult = await optimizer.condenseConversationEntry(userMessage);
      const assistantResult = await optimizer.condenseConversationEntry(assistantMessage);
      const toolResult_result = await optimizer.condenseConversationEntry(toolResult);

      // Verify relationships are preserved
      expect(userResult.entry!.uuid).toBe('user-111');
      expect(assistantResult.entry!.uuid).toBe('assistant-222');
      expect(assistantResult.entry!.parentMessageUuid).toBe('user-111');
      expect(toolResult_result.entry!.uuid).toBe('tool-result-444');
      expect(toolResult_result.entry!.parentMessageUuid).toBe('tool-use-333');

      // Verify tool use relationship is preserved in assistant message
      const toolUseContent = assistantResult.entry!.content.find(c => c.type === 'tool_use');
      expect(toolUseContent).toBeDefined();
      expect(toolUseContent!.uuid).toBe('tool-use-333');
    });
  });
});

// Helper functions for test validation
function extractContentFromPrompt(prompt: string): string {
  // Extract the content being asked to condense from the prompt
  const contentMatch = prompt.match(/Content to condense:\s*```[\s\S]*?```/);
  if (contentMatch) {
    return contentMatch[0].replace(/Content to condense:\s*```\w*\n?/, '').replace(/```$/, '');
  }
  return prompt;
}

function simulateFactualCondensation(content: string): string {
  // Simulate intelligent condensation that maintains facts
  // Remove comments and extra whitespace but preserve all factual content
  return content
    .replace(/\/\/.*$/gm, '') // Remove line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/^\s*\n/gm, '') // Remove empty lines
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

function extractFactsFromCode(code: string): string[] {
  const facts: string[] = [];
  
  // Extract variable assignments
  const assignments = code.match(/const\s+\w+\s*=\s*[^;]+/g) || [];
  facts.push(...assignments);
  
  // Extract function declarations
  const functions = code.match(/function\s+\w+\s*\([^)]*\)[^{]*{/g) || [];
  facts.push(...functions);
  
  // Extract string literals
  const strings = code.match(/'[^']*'|"[^"]*"/g) || [];
  facts.push(...strings);
  
  // Extract numbers
  const numbers = code.match(/\b\d+\.?\d*\b/g) || [];
  facts.push(...numbers);
  
  return facts.map(fact => fact.trim());
}

function extractNumbers(text: string): string[] {
  return text.match(/\b\d+\.?\d*\b/g) || [];
}