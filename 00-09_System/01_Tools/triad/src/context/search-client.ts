// Search Client
// Interface to the VRAM search.db FTS5 database

import { Database } from "bun:sqlite";
import { config } from "../utils/config";
import { logger } from "../utils/logger";

export interface SearchResult {
  id: number;
  path: string;
  filename: string;
  extension: string;
  area: string;
  category: string;
  snippet: string;
  score: number;
}

export interface SearchOptions {
  limit?: number;
  area?: string;
  category?: string;
  extension?: string;
}

class SearchClient {
  private db: Database | null = null;
  private connected: boolean = false;

  /**
   * Connect to the search database
   */
  async connect(): Promise<boolean> {
    try {
      const dbFile = Bun.file(config.searchDbPath);
      if (!(await dbFile.exists())) {
        await logger.error("search_db_not_found", { path: config.searchDbPath });
        return false;
      }

      this.db = new Database(config.searchDbPath, { readonly: true, strict: true });
      this.db.run("PRAGMA journal_mode = WAL;");
      this.connected = true;

      await logger.info("search_db_connected", { path: config.searchDbPath });
      return true;
    } catch (error) {
      await logger.error("search_db_connect_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return false;
    }
  }

  /**
   * Ensure database is connected
   */
  private ensureConnected(): void {
    if (!this.connected || !this.db) {
      throw new Error("Search database not connected");
    }
  }

  /**
   * Full-text search
   * Note: FTS5 tables only have: path, filename, content, area, category
   * We join with files table to get additional metadata
   */
  search(query: string, options: SearchOptions = {}): SearchResult[] {
    this.ensureConnected();

    const limit = options.limit || 20;

    try {
      // Use FTS5 with join to get full metadata
      let sql = `
        SELECT
          f.id,
          f.path,
          f.filename,
          f.extension,
          f.area,
          f.category,
          snippet(files_fts, 2, '»', '«', '...', 50) as snippet,
          bm25(files_fts) as score
        FROM files_fts
        JOIN files f ON f.rowid = files_fts.rowid
        WHERE files_fts MATCH ?
      `;

      const params: (string | number)[] = [query];

      if (options.area) {
        sql += ` AND f.area = ?`;
        params.push(options.area);
      }

      if (options.category) {
        sql += ` AND f.category = ?`;
        params.push(options.category);
      }

      sql += ` ORDER BY score LIMIT ?`;
      params.push(limit);

      const results = this.db!.query(sql).all(...params) as SearchResult[];

      return results;
    } catch (error) {
      logger.error("search_query_error", {
        query,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return [];
    }
  }

  /**
   * Search within a specific area
   */
  searchInArea(query: string, area: string, limit: number = 20): SearchResult[] {
    return this.search(query, { area, limit });
  }

  /**
   * Get files by area
   */
  getFilesByArea(area: string, limit: number = 50): SearchResult[] {
    this.ensureConnected();

    try {
      const sql = `
        SELECT
          id,
          path,
          filename,
          extension,
          area,
          category,
          '' as snippet,
          0 as score
        FROM files
        WHERE area = ?
        ORDER BY modified_at DESC
        LIMIT ?
      `;

      return this.db!.query(sql).all(area, limit) as SearchResult[];
    } catch (error) {
      logger.error("search_area_error", {
        area,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return [];
    }
  }

  /**
   * Get recent files
   */
  getRecentFiles(limit: number = 50): SearchResult[] {
    this.ensureConnected();

    try {
      const sql = `
        SELECT
          id,
          path,
          filename,
          extension,
          area,
          category,
          '' as snippet,
          0 as score
        FROM files
        ORDER BY modified_at DESC
        LIMIT ?
      `;

      return this.db!.query(sql).all(limit) as SearchResult[];
    } catch (error) {
      logger.error("search_recent_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return [];
    }
  }

  /**
   * Get file content by path
   */
  getFileContent(path: string): string | null {
    this.ensureConnected();

    try {
      const sql = `SELECT content FROM files WHERE path = ?`;
      const result = this.db!.query(sql).get(path) as { content: string } | null;
      return result?.content || null;
    } catch (error) {
      logger.error("search_content_error", {
        path,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return null;
    }
  }

  /**
   * Get database statistics
   */
  getStats(): { totalFiles: number; totalAreas: number; dbSize: number } | null {
    this.ensureConnected();

    try {
      const fileCount = this.db!.query("SELECT COUNT(*) as count FROM files").get() as { count: number };
      const areaCount = this.db!.query("SELECT COUNT(DISTINCT area) as count FROM files").get() as { count: number };

      const dbFile = Bun.file(config.searchDbPath);

      return {
        totalFiles: fileCount.count,
        totalAreas: areaCount.count,
        dbSize: dbFile.size,
      };
    } catch (error) {
      logger.error("search_stats_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return null;
    }
  }

  /**
   * Get all unique areas
   */
  getAreas(): string[] {
    this.ensureConnected();

    try {
      const sql = `SELECT DISTINCT area FROM files WHERE area IS NOT NULL ORDER BY area`;
      const results = this.db!.query(sql).all() as { area: string }[];
      return results.map(r => r.area);
    } catch (error) {
      logger.error("search_areas_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return [];
    }
  }

  /**
   * Get categories within an area
   */
  getCategories(area: string): string[] {
    this.ensureConnected();

    try {
      const sql = `SELECT DISTINCT category FROM files WHERE area = ? AND category IS NOT NULL ORDER BY category`;
      const results = this.db!.query(sql).all(area) as { category: string }[];
      return results.map(r => r.category);
    } catch (error) {
      logger.error("search_categories_error", {
        area,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return [];
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Close the database connection
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.connected = false;
    }
  }
}

export const searchClient = new SearchClient();
