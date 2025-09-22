"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, CSSProperties } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
const DEV_PASSWORD_HINT = process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? "";

interface CreateSessionPayload {
  course: string;
  start_ts: string;
  end_ts: string;
  capacity: number;
  mode: string;
  location: string;
}

export default function AdminPage() {
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [tokenInput, setTokenInput] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("SK_ADMIN_JWT");
    if (stored) {
      setJwtToken(stored);
      setHasAccess(true);
    }
  }, []);

  const [course, setCourse] = useState<string>("group:6-8");
  const [startTs, setStartTs] = useState<string>("");
  const [endTs, setEndTs] = useState<string>("");
  const [capacity, setCapacity] = useState<number>(4);
  const [mode, setMode] = useState<string>("remote");
  const [location, setLocation] = useState<string>("Google Meet");
  const [csvBusy, setCsvBusy] = useState<boolean>(false);
  const [sessionBusy, setSessionBusy] = useState<boolean>(false);

  const passwordHint = useMemo(() => (DEV_PASSWORD_HINT ? `Dev hint: ${DEV_PASSWORD_HINT}` : undefined), []);

  const handleUnlock = async () => {
    const password = tokenInput.trim();
    if (!password) {
      alert("Enter the admin password.");
      return;
    }
    try {
      const response = await fetch(`${API}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        throw new Error("Invalid password");
      }
      const data: { token: string; expires_in: number } = await response.json();
      if (typeof window !== "undefined") {
        window.localStorage.setItem("SK_ADMIN_JWT", data.token);
      }
      setJwtToken(data.token);
      setHasAccess(true);
      setTokenInput("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to authenticate");
    }
  };

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("SK_ADMIN_JWT");
    }
    setJwtToken(null);
    setHasAccess(false);
  };

  const uploadCsv = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCsvBusy(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${API}/api/typing/import`, {
        method: "POST",
        headers: jwtToken ? { "X-Admin-Token": jwtToken } : undefined,
        body: formData,
      });
      const text = await response.text();
      alert(text);
      event.target.value = "";
    } catch (error) {
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setCsvBusy(false);
    }
  };

  const createSession = async () => {
    if (!jwtToken) {
      alert("Log in as admin first.");
      return;
    }
    if (!course.trim() || !startTs.trim() || !endTs.trim()) {
      alert("Course, start, and end times are required.");
      return;
    }
    setSessionBusy(true);
    const body: CreateSessionPayload = {
      course: course.trim(),
      start_ts: startTs,
      end_ts: endTs,
      capacity,
      mode: mode.trim() || "remote",
      location: location.trim() || "Google Meet",
    };
    try {
      const response = await fetch(`${API}/api/admin/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": jwtToken,
        },
        body: JSON.stringify(body),
      });
      const text = await response.text();
      alert(text);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to create session");
    } finally {
      setSessionBusy(false);
    }
  };

  if (!hasAccess) {
    return (
      <section style={wrapperStyle}>
        <div className="card">
          <h2 className="card-title">Admin Access</h2>
          <p className="card-subtitle">Enter the admin password to request a secure JWT.</p>
          <input
            type="password"
            value={tokenInput}
            onChange={(event) => setTokenInput(event.target.value)}
            className="input"
            placeholder="Admin password"
          />
          <button type="button" onClick={handleUnlock} className="button primary">
            Unlock
          </button>
          {passwordHint ? <p className="form-help" style={{ marginTop: "0.75rem" }}>{passwordHint}</p> : null}
        </div>
      </section>
    );
  }

  return (
    <section style={wrapperStyle}>
      <header className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <h2 className="h-display" style={{ marginBottom: 4 }}>Admin Tools</h2>
          <p className="form-help" style={{ margin: 0 }}>Authenticated with JWT. Token is stored locally for convenience.</p>
        </div>
        <button type="button" onClick={handleSignOut} className="button secondary">
          Sign out
        </button>
      </header>

      <section className="card">
        <h3 className="card-title">Upload Typing.com CSV</h3>
        <input type="file" accept=".csv" onChange={uploadCsv} disabled={csvBusy} />
        {csvBusy ? <p className="form-help">Uploading...</p> : null}
      </section>

      <section className="card">
        <h3 className="card-title">Create Session</h3>
        <div style={gridStyle}>
          <label>
            Course
            <input value={course} onChange={(event) => setCourse(event.target.value)} className="input" />
          </label>
          <label>
            Start (ISO)
            <input value={startTs} onChange={(event) => setStartTs(event.target.value)} className="input" placeholder="2025-09-25T21:00:00-05:00" />
          </label>
          <label>
            End (ISO)
            <input value={endTs} onChange={(event) => setEndTs(event.target.value)} className="input" placeholder="2025-09-25T21:45:00-05:00" />
          </label>
          <label>
            Capacity
            <input type="number" value={capacity} onChange={(event) => setCapacity(Number(event.target.value))} className="input" min={1} />
          </label>
          <label>
            Mode
            <input value={mode} onChange={(event) => setMode(event.target.value)} className="input" />
          </label>
          <label>
            Location
            <input value={location} onChange={(event) => setLocation(event.target.value)} className="input" />
          </label>
        </div>
        <button type="button" onClick={createSession} className="button primary" disabled={sessionBusy}>
          {sessionBusy ? "Creating..." : "Create session"}
        </button>
      </section>
    </section>
  );
}

const wrapperStyle: CSSProperties = {
  maxWidth: 720,
  margin: "30px auto",
  padding: "0 16px",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gap: 12,
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
};
