// VRAM Reader
// Read-only access to the VRAM filesystem for Triad

import { config } from "../utils/config";
import { logger } from "../utils/logger";

export interface FileInfo {
  path: string;
  filename: string;
  extension: string;
  size: number;
  modifiedAt: Date;
  area?: string;
  category?: string;
}

export interface DirectoryInfo {
  path: string;
  name: string;
  files: number;
  subdirectories: number;
  totalSize: number;
}

class VRAMReader {
  private readonly basePath: string;

  constructor() {
    this.basePath = config.vramPath;
  }

  /**
   * Read a file's content (text only)
   */
  async readFile(relativePath: string): Promise<string | null> {
    try {
      const fullPath = this.resolvePath(relativePath);
      const file = Bun.file(fullPath);

      if (!(await file.exists())) {
        await logger.debug("vram_file_not_found", { path: fullPath });
        return null;
      }

      return await file.text();
    } catch (error) {
      await logger.error("vram_read_error", {
        path: relativePath,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return null;
    }
  }

  /**
   * Get file information
   */
  async getFileInfo(relativePath: string): Promise<FileInfo | null> {
    try {
      const fullPath = this.resolvePath(relativePath);
      const file = Bun.file(fullPath);

      if (!(await file.exists())) {
        return null;
      }

      const pathParts = relativePath.split("/");
      const filename = pathParts[pathParts.length - 1];
      const extension = filename.includes(".") ? filename.split(".").pop() || "" : "";

      // Extract area and category from Johnny.Decimal path
      const { area, category } = this.parseJohnnyDecimalPath(relativePath);

      return {
        path: fullPath,
        filename,
        extension,
        size: file.size,
        modifiedAt: new Date(file.lastModified),
        area,
        category,
      };
    } catch (error) {
      await logger.error("vram_fileinfo_error", {
        path: relativePath,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return null;
    }
  }

  /**
   * List files in a directory
   */
  async listFiles(relativePath: string, pattern: string = "*"): Promise<string[]> {
    try {
      const fullPath = this.resolvePath(relativePath);
      const glob = new Bun.Glob(pattern);
      const files: string[] = [];

      for await (const file of glob.scan({ cwd: fullPath, absolute: false })) {
        files.push(file);
      }

      return files.sort();
    } catch (error) {
      await logger.error("vram_list_error", {
        path: relativePath,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return [];
    }
  }

  /**
   * List directories in a path
   */
  async listDirectories(relativePath: string): Promise<string[]> {
    try {
      const fullPath = this.resolvePath(relativePath);
      const entries = await Array.fromAsync(new Bun.Glob("*/").scan({ cwd: fullPath }));
      return entries.map(e => e.replace("/", "")).sort();
    } catch (error) {
      await logger.error("vram_listdir_error", {
        path: relativePath,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return [];
    }
  }

  /**
   * Get directory information
   */
  async getDirectoryInfo(relativePath: string): Promise<DirectoryInfo | null> {
    try {
      const fullPath = this.resolvePath(relativePath);
      const name = relativePath.split("/").filter(Boolean).pop() || relativePath;

      const files = await this.listFiles(relativePath, "**/*");
      const subdirs = await this.listDirectories(relativePath);

      // Calculate total size (sample only for performance)
      let totalSize = 0;
      const sampleFiles = files.slice(0, 100);
      for (const file of sampleFiles) {
        const info = await this.getFileInfo(`${relativePath}/${file}`);
        if (info) totalSize += info.size;
      }

      return {
        path: fullPath,
        name,
        files: files.length,
        subdirectories: subdirs.length,
        totalSize,
      };
    } catch (error) {
      await logger.error("vram_dirinfo_error", {
        path: relativePath,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return null;
    }
  }

  /**
   * Search files by name pattern
   */
  async findFiles(pattern: string, startPath: string = ""): Promise<string[]> {
    try {
      const fullPath = this.resolvePath(startPath);
      const glob = new Bun.Glob(pattern);
      const files: string[] = [];

      for await (const file of glob.scan({ cwd: fullPath, absolute: false })) {
        files.push(startPath ? `${startPath}/${file}` : file);
      }

      return files.sort();
    } catch (error) {
      await logger.error("vram_find_error", {
        pattern,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return [];
    }
  }

  /**
   * Get the Johnny.Decimal areas at the root level
   */
  async getAreas(): Promise<string[]> {
    const dirs = await this.listDirectories("");
    return dirs.filter(d => /^\d{2}-\d{2}_/.test(d));
  }

  /**
   * Get categories within an area
   */
  async getCategories(area: string): Promise<string[]> {
    const dirs = await this.listDirectories(area);
    return dirs.filter(d => /^\d{2}_/.test(d));
  }

  /**
   * Parse Johnny.Decimal path to extract area and category
   */
  private parseJohnnyDecimalPath(path: string): { area?: string; category?: string } {
    const parts = path.split("/").filter(Boolean);

    let area: string | undefined;
    let category: string | undefined;

    for (const part of parts) {
      if (/^\d{2}-\d{2}_/.test(part)) {
        area = part.replace(/^\d{2}-\d{2}_/, "").replace(/_/g, " ");
      } else if (/^\d{2}_/.test(part)) {
        category = part.replace(/^\d{2}_/, "").replace(/_/g, " ");
      }
    }

    return { area, category };
  }

  /**
   * Resolve a relative path to full path
   */
  private resolvePath(relativePath: string): string {
    if (relativePath.startsWith("/")) {
      return relativePath;
    }
    return `${this.basePath}/${relativePath}`.replace(/\/+/g, "/");
  }

  /**
   * Get recent files across VRAM
   */
  async getRecentFiles(count: number = 20): Promise<FileInfo[]> {
    // This would ideally use the search database for efficiency
    // For now, sample from known areas
    const files: FileInfo[] = [];

    for (const focusArea of config.focusAreas) {
      if (focusArea.path) {
        const areaFiles = await this.listFiles(focusArea.path, "**/*.{md,txt,json}");
        for (const file of areaFiles.slice(0, 5)) {
          const info = await this.getFileInfo(`${focusArea.path}/${file}`);
          if (info) files.push(info);
        }
      }
    }

    // Sort by modified date descending
    files.sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime());
    return files.slice(0, count);
  }
}

export const vramReader = new VRAMReader();
