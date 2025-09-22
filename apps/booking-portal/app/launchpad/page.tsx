"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

interface SessionDetail {
  id: number;
  course: string;
  start_ts: string;
  end_ts: string;
  mode: string;
  capacity: number;
  location: string;
  meet_link: string | null;
  status: string;
  seats_available: number;
}

export default function Launchpad({
  searchParams,
}: {
  searchParams: { session_id?: string; student_id?: string };
}) {
  const sessionId = Number(searchParams.session_id ?? "0");
  const studentId = Number(searchParams.student_id ?? "0");

  const [session, setSession] = useState<SessionDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    async function loadSession() {
      if (!sessionId) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_BASE}/api/sessions/${sessionId}`);
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.detail ?? "Unable to load the session details.");
        }
        const data: SessionDetail = await response.json();
        if (active) {
          setSession(data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Unexpected error loading session.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSession();
    return () => {
      active = false;
    };
  }, [sessionId]);

  const meetLink = useMemo(() => {
    if (session?.meet_link) return session.meet_link;
    return "https://meet.google.com/dev-placeholder";
  }, [session]);

  const typingLoginUrl = "https://www.typing.com/student/login";
  const typingLessonsUrl = "https://www.typing.com/student/lessons";

  if (!sessionId) {
    return (
      <section style={sectionStyle}>
        <h2>Launchpad</h2>
        <p>Missing session details. Please use the link from your confirmation email.</p>
      </section>
    );
  }

  return (
    <section style={sectionStyle}>
      <h2 className="h-display">Serenity's Keys — Launchpad</h2>
      <p>Welcome! Use the buttons below when class starts.</p>
      <DetailsBlock loading={loading} error={error} session={session} studentId={studentId} />
      <div style={buttonGridStyle}>
        <a className="button success block lg" href={meetLink} target="_blank" rel="noopener noreferrer">Join Google Meet</a>
        <a className="button secondary block lg" href={typingLoginUrl} target="_blank" rel="noopener noreferrer">Open Typing.com</a>
        <a className="button block lg" style={{ background: "#0f766e", color: "#fff" }} href={typingLessonsUrl} target="_blank" rel="noopener noreferrer">Today's Assignment</a>
      </div>
      <small>Tip: Stay logged into Typing.com so it opens instantly.</small>
    </section>
  );
}

const sectionStyle: CSSProperties = {
  maxWidth: 720,
  margin: "30px auto",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  padding: "0 16px",
};

const buttonGridStyle: CSSProperties = {
  display: "grid",
  gap: 12,
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  margin: "18px 0",
};

function LaunchpadButton({
  href,
  label,
  background,
}: {
  href: string;
  label: string;
  background: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        background,
        color: "#fff",
        padding: "14px 18px",
        borderRadius: 10,
        textAlign: "center",
        textDecoration: "none",
        fontWeight: 600,
        boxShadow: "0 6px 12px rgba(15, 23, 42, 0.15)",
      }}
    >
      {label}
    </a>
  );
}

function DetailsBlock({
  loading,
  error,
  session,
  studentId,
}: {
  loading: boolean;
  error: string | null;
  session: SessionDetail | null;
  studentId: number;
}) {
  if (loading) {
    return <p>Loading session details…</p>;
  }
  if (error) {
    return (
      <div style={errorBoxStyle}>
        <strong>Problem loading session.</strong>
        <p style={{ margin: "4px 0 0" }}>{error}</p>
      </div>
    );
  }
  if (!session) {
    return (
      <div style={errorBoxStyle}>
        <strong>Session not found.</strong>
        <p style={{ margin: "4px 0 0" }}>Reach out to support if this keeps happening.</p>
      </div>
    );
  }

  const start = new Date(session.start_ts);
  const when = start.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Chicago",
  });

  return (
    <div style={infoBoxStyle}>
      <p style={{ margin: 0 }}>
        <strong>Course:</strong> {session.course}
      </p>
      <p style={{ margin: "4px 0 0" }}>
        <strong>When:</strong> {when} CT
      </p>
      {studentId ? (
        <p style={{ margin: "4px 0 0" }}>
          <strong>Student ID:</strong> {studentId}
        </p>
      ) : null}
    </div>
  );
}

const infoBoxStyle: CSSProperties = {
  background: "#e2e8f0",
  borderRadius: 12,
  padding: "16px",
  marginTop: "16px",
};

const errorBoxStyle: CSSProperties = {
  background: "#fee2e2",
  borderRadius: 12,
  padding: "16px",
  marginTop: "16px",
  color: "#991b1b",
};
