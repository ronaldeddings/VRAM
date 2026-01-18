import { join } from 'path';
import { homedir } from 'os';

/**
 * Encodes a project path for use in the ~/.claude/projects directory structure
 * Format: -path-with-slashes-replaced-by-hyphens
 */
export function encodeProjectPath(path: string): string {
  // Handle relative paths like "." by converting to absolute path first
  const absolutePath = path === '.' ? process.cwd() : path;
  
  // Remove leading slash if present to avoid double hyphens
  const cleanPath = absolutePath.startsWith('/') ? absolutePath.substring(1) : absolutePath;
  return '-' + cleanPath.replace(/\//g, '-');
}

/**
 * Decodes an encoded project path back to the original path
 */
export function decodeProjectPath(encoded: string): string {
  // Remove leading hyphen and replace hyphens with slashes, then add leading slash
  const decoded = encoded.substring(1).replace(/-/g, '/');
  return decoded.startsWith('/') ? decoded : '/' + decoded;
}

/**
 * Gets the Claude projects directory path
 */
export function getClaudeProjectsDirectory(): string {
  return join(homedir(), '.claude', 'projects');
}

/**
 * Gets the encoded project directory path for a given project path
 */
export function getEncodedProjectDirectory(projectPath: string): string {
  const encodedPath = encodeProjectPath(projectPath);
  return join(getClaudeProjectsDirectory(), encodedPath);
}

/**
 * Gets the session file path for a given project and session ID
 */
export function getSessionFilePath(projectPath: string, sessionId: string): string {
  const projectDir = getEncodedProjectDirectory(projectPath);
  return join(projectDir, `${sessionId}.jsonl`);
}

/**
 * Cross-platform path resolution utility
 */
export function resolvePath(path: string): string {
  if (path.startsWith('~')) {
    return join(homedir(), path.slice(1));
  }
  return path;
}