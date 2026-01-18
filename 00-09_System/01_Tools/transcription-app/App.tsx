import React, { useState, useEffect, useCallback } from "react";

interface Speaker {
  name: string;
  samples: string[];
  embeddings_count: number;
}

interface TranscriptSegment {
  start: number;
  end: number;
  speaker: string;
  text: string;
  confidence?: number;
}

interface TranscriptionResult {
  segments: TranscriptSegment[];
  speakers: string[];
  duration: number;
}

interface JobStatus {
  id: string;
  status: "pending" | "processing" | "completed" | "error";
  progress?: string;
  result?: TranscriptionResult;
  error?: string;
}

function App() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [jobs, setJobs] = useState<JobStatus[]>([]);
  const [selectedTab, setSelectedTab] = useState<"transcribe" | "registry">("transcribe");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch speakers on mount
  useEffect(() => {
    fetchSpeakers();
  }, []);

  const fetchSpeakers = async () => {
    try {
      const response = await fetch("/api/speakers");
      const data = (await response.json()) as { speakers?: Speaker[] };
      setSpeakers(data.speakers || []);
    } catch (err) {
      console.error("Failed to fetch speakers:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      setFiles(Array.from(target.files));
    }
  };

  const handleTranscribe = async () => {
    if (files.length === 0) return;

    setIsLoading(true);
    setError(null);

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to transcribe ${file.name}`);
        }

        const result = (await response.json()) as TranscriptionResult;
        setJobs((prev) => [
          ...prev,
          {
            id: file.name,
            status: "completed" as const,
            result: result,
          },
        ]);
      } catch (err: any) {
        setJobs((prev) => [
          ...prev,
          {
            id: file.name,
            status: "error" as const,
            error: err.message,
          },
        ]);
      }
    }

    setIsLoading(false);
    setFiles([]);
  };

  const handleRebuildRegistry = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/registry/rebuild", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to rebuild registry");
      }

      const result = (await response.json()) as { speakerCount: number };
      alert(`Registry rebuilt with ${result.speakerCount} speakers`);
      fetchSpeakers();
    } catch (err: any) {
      setError(err.message);
    }

    setIsLoading(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="app">
      <header>
        <h1>🎙️ Speaker Transcription Pipeline</h1>
        <p>Transcribe audio/video with automatic speaker identification</p>
      </header>

      <nav className="tabs">
        <button
          className={selectedTab === "transcribe" ? "active" : ""}
          onClick={() => setSelectedTab("transcribe")}
        >
          Transcribe
        </button>
        <button
          className={selectedTab === "registry" ? "active" : ""}
          onClick={() => setSelectedTab("registry")}
        >
          Speaker Registry
        </button>
      </nav>

      <main>
        {error && <div className="error">{error}</div>}

        {selectedTab === "transcribe" && (
          <div className="transcribe-section">
            <div className="upload-area">
              <h2>Upload Files</h2>
              <input
                type="file"
                multiple
                accept=".mp4,.mp3,.wav,.m4a,.mov"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              {files.length > 0 && (
                <div className="file-list">
                  <h3>Selected Files:</h3>
                  <ul>
                    {files.map((f, i) => (
                      <li key={i}>{f.name}</li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                onClick={handleTranscribe}
                disabled={isLoading || files.length === 0}
                className="primary"
              >
                {isLoading ? "Processing..." : "Transcribe"}
              </button>
            </div>

            <div className="results">
              <h2>Transcription Results</h2>
              {jobs.length === 0 ? (
                <p className="empty">No transcriptions yet. Upload a file to get started.</p>
              ) : (
                jobs.map((job, i) => (
                  <div key={i} className={`job ${job.status}`}>
                    <h3>{job.id}</h3>
                    {job.status === "processing" && <p>Processing: {job.progress}</p>}
                    {job.status === "error" && <p className="error">{job.error}</p>}
                    {job.status === "completed" && job.result && (
                      <div className="transcript">
                        <div className="meta">
                          <span>Duration: {formatTime(job.result.duration)}</span>
                          <span>Speakers: {job.result.speakers.join(", ")}</span>
                        </div>
                        <div className="segments">
                          {job.result.segments.map((seg, j) => (
                            <div key={j} className="segment">
                              <span className="time">
                                [{formatTime(seg.start)} - {formatTime(seg.end)}]
                              </span>
                              <span className="speaker">{seg.speaker}:</span>
                              <span className="text">{seg.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {selectedTab === "registry" && (
          <div className="registry-section">
            <div className="registry-header">
              <h2>Speaker Registry</h2>
              <button onClick={handleRebuildRegistry} disabled={isLoading}>
                {isLoading ? "Rebuilding..." : "Rebuild from Transcripts"}
              </button>
            </div>

            <div className="speaker-list">
              {speakers.length === 0 ? (
                <p className="empty">No speakers registered yet.</p>
              ) : (
                speakers.map((speaker, i) => (
                  <div key={i} className="speaker-card">
                    <h3>{speaker.name}</h3>
                    <p>{speaker.embeddings_count} voice samples</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #1a1a2e;
          color: #eee;
          min-height: 100vh;
        }

        .app {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        header {
          text-align: center;
          margin-bottom: 30px;
        }

        header h1 {
          font-size: 2rem;
          margin-bottom: 10px;
        }

        header p {
          color: #888;
        }

        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .tabs button {
          padding: 10px 20px;
          border: none;
          background: #2d2d44;
          color: #aaa;
          cursor: pointer;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .tabs button:hover {
          background: #3d3d54;
        }

        .tabs button.active {
          background: #4a4a6a;
          color: #fff;
        }

        main {
          background: #16213e;
          border-radius: 12px;
          padding: 20px;
        }

        .error {
          background: #ff4444;
          color: white;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .upload-area {
          background: #1a1a2e;
          border: 2px dashed #4a4a6a;
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          margin-bottom: 30px;
        }

        .upload-area h2 {
          margin-bottom: 20px;
        }

        .upload-area input[type="file"] {
          margin-bottom: 20px;
        }

        .file-list {
          text-align: left;
          margin: 20px 0;
          padding: 15px;
          background: #2d2d44;
          border-radius: 8px;
        }

        .file-list h3 {
          font-size: 0.9rem;
          margin-bottom: 10px;
        }

        .file-list ul {
          list-style: none;
          padding-left: 0;
        }

        .file-list li {
          padding: 5px 0;
          color: #888;
        }

        button.primary {
          background: #0f3460;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        button.primary:hover:not(:disabled) {
          background: #1a4980;
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .results h2 {
          margin-bottom: 20px;
        }

        .empty {
          color: #666;
          text-align: center;
          padding: 40px;
        }

        .job {
          background: #1a1a2e;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .job h3 {
          margin-bottom: 15px;
          color: #4a9eff;
        }

        .job.error {
          border-left: 4px solid #ff4444;
        }

        .job.completed {
          border-left: 4px solid #44ff88;
        }

        .transcript .meta {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
          color: #888;
        }

        .segments {
          max-height: 400px;
          overflow-y: auto;
        }

        .segment {
          padding: 10px 0;
          border-bottom: 1px solid #2d2d44;
        }

        .segment .time {
          color: #666;
          font-family: monospace;
          margin-right: 10px;
        }

        .segment .speaker {
          color: #4a9eff;
          font-weight: bold;
          margin-right: 10px;
        }

        .segment .text {
          color: #ddd;
        }

        .registry-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .registry-header button {
          background: #0f3460;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
        }

        .speaker-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        .speaker-card {
          background: #1a1a2e;
          border-radius: 12px;
          padding: 20px;
        }

        .speaker-card h3 {
          color: #4a9eff;
          margin-bottom: 10px;
        }

        .speaker-card p {
          color: #888;
        }
      `}</style>
    </div>
  );
}

export default App;
