"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

type Session = {
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
};

interface Props {
  course: string;
  sessions: Session[];
  suggestedPriceCents: number;
  apiBaseUrl: string;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  timeZone: "America/Chicago",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/Chicago",
});

export function AvailabilityClient({ course, sessions, suggestedPriceCents, apiBaseUrl }: Props) {
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [studentName, setStudentName] = useState("");
  const [existingStudentId, setExistingStudentId] = useState("");
  const [typingUsername, setTypingUsername] = useState("");
  const [priceCents, setPriceCents] = useState<string>(String(suggestedPriceCents));
  const [lastStudentId, setLastStudentId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busySession, setBusySession] = useState<number | null>(null);

  const hasSessions = sessions.length > 0;

  const heading = useMemo(() => {
    if (course === "private:all") return "Private coaching availability";
    return `Availability for ${course}`;
  }, [course]);

  const handleCheckout = async (session: Session) => {
    setError(null);

    const normalizedParentName = parentName.trim();
    const normalizedParentEmail = parentEmail.trim();
    const normalizedStudentName = studentName.trim();
    const normalizedPrice = Number(priceCents);
    const normalizedStudentId = existingStudentId.trim();

    if (!normalizedParentName || !normalizedParentEmail || !normalizedStudentName) {
      setError("Please complete parent and student details before booking.");
      return;
    }
    if (!normalizedParentEmail.includes("@")) {
      setError("Enter a valid parent email address.");
      return;
    }
    if (!priceCents.trim() || Number.isNaN(normalizedPrice) || normalizedPrice <= 0) {
      setError("Enter a valid price in cents.");
      return;
    }
    if (normalizedStudentId && Number.isNaN(Number(normalizedStudentId))) {
      setError("Existing student ID must be a number.");
      return;
    }

    try {
      setBusySession(session.id);

      const profilePayload = {
        parent_name: normalizedParentName,
        parent_email: normalizedParentEmail,
        parent_phone: parentPhone.trim() || undefined,
        student_id: normalizedStudentId ? Number(normalizedStudentId) : undefined,
        student_name: normalizedStudentName,
        typing_username: typingUsername.trim() || undefined,
      };

      const profileResponse = await fetch(`${apiBaseUrl}/api/profile/upsert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profilePayload),
      });
      if (!profileResponse.ok) {
        const data = await profileResponse.json().catch(() => ({}));
        throw new Error(data.detail ?? "Unable to save the profile before checkout.");
      }
      const profileData: { parent_id: number; student_id: number } = await profileResponse.json();
      const studentId = profileData.student_id;
      setLastStudentId(studentId);
      setExistingStudentId(String(studentId));

      const checkoutPayload = {
        session_id: session.id,
        student_id: studentId,
        amount_cents: Math.round(normalizedPrice),
        success_url: `${window.location.origin}/success`,
        cancel_url: `${window.location.origin}/cancel`,
        typing_username: typingUsername.trim() || undefined,
      };

      const checkoutResponse = await fetch(`${apiBaseUrl}/api/booking/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutPayload),
      });

      if (!checkoutResponse.ok) {
        const data = await checkoutResponse.json().catch(() => ({}));
        throw new Error(data.detail ?? "Checkout could not be started.");
      }

      const data = await checkoutResponse.json();
      window.location.href = data.checkout_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error starting checkout.");
    } finally {
      setBusySession(null);
    }
  };

  return (
    <section className="stack">
      <h2 className="h-display">{heading}</h2>
      <ProfileCard
        parentName={parentName}
        setParentName={setParentName}
        parentEmail={parentEmail}
        setParentEmail={setParentEmail}
        parentPhone={parentPhone}
        setParentPhone={setParentPhone}
        studentName={studentName}
        setStudentName={setStudentName}
        existingStudentId={existingStudentId}
        setExistingStudentId={setExistingStudentId}
        typingUsername={typingUsername}
        setTypingUsername={setTypingUsername}
        priceCents={priceCents}
        setPriceCents={setPriceCents}
        lastStudentId={lastStudentId}
      />
      {error ? (
        <p className="form-error">{error}</p>
      ) : null}
      {!hasSessions ? (
        <p>No upcoming sessions for this program in the next 30 days.</p>
      ) : (
        <ul className="clean">
          {sessions.map((session) => {
            const disabled = session.seats_available <= 0 || session.status !== "scheduled";
            return (
              <li key={session.id} className="card" style={{ marginBottom: 12 }}>
                <div className="stack" style={{ gap: "0.35rem" }}>
                  <strong>{formatRange(session.start_ts, session.end_ts)}</strong>
                  <span>Seats left: {session.seats_available}</span>
                  <button
                    type="button"
                    onClick={() => handleCheckout(session)}
                    disabled={disabled || busySession === session.id}
                    className={`button primary ${disabled ? "" : ""}`}
                    style={{ alignSelf: "start", opacity: busySession === session.id ? 0.7 : 1, cursor: disabled ? "not-allowed" : "pointer", background: disabled ? "#94a3b8" : undefined }}
                  >
                    {disabled ? "Full" : busySession === session.id ? "Starting checkout..." : "Start checkout"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function formatRange(startIso: string, endIso: string) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  return `${dateFormatter.format(start)} at ${timeFormatter.format(start)} - ${timeFormatter.format(end)} CT`;
}

function ProfileCard(props: {
  parentName: string;
  setParentName: (value: string) => void;
  parentEmail: string;
  setParentEmail: (value: string) => void;
  parentPhone: string;
  setParentPhone: (value: string) => void;
  studentName: string;
  setStudentName: (value: string) => void;
  existingStudentId: string;
  setExistingStudentId: (value: string) => void;
  typingUsername: string;
  setTypingUsername: (value: string) => void;
  priceCents: string;
  setPriceCents: (value: string) => void;
  lastStudentId: number | null;
}) {
  const {
    parentName,
    setParentName,
    parentEmail,
    setParentEmail,
    parentPhone,
    setParentPhone,
    studentName,
    setStudentName,
    existingStudentId,
    setExistingStudentId,
    typingUsername,
    setTypingUsername,
    priceCents,
    setPriceCents,
    lastStudentId,
  } = props;

  return (
    <div className="card elevate" style={{ marginBottom: "1.5rem" }}>
      <h3 className="card-title">Parent & Student details</h3>
      <p className="card-subtitle">Save your profile once and reuse it for future sessions.</p>
      <div style={{ display: "grid", gap: 12 }}>
        <label>
          <span>Parent name</span>
          <input
            type="text"
            value={parentName}
            onChange={(event) => setParentName(event.target.value)}
            className="input"
            placeholder="Jordan Smith"
          />
        </label>
        <label>
          <span>Parent email</span>
          <input
            type="email"
            value={parentEmail}
            onChange={(event) => setParentEmail(event.target.value)}
            className="input"
            placeholder="parent@example.com"
          />
        </label>
        <label>
          <span>Parent phone (optional)</span>
          <input
            type="tel"
            value={parentPhone}
            onChange={(event) => setParentPhone(event.target.value)}
            className="input"
            placeholder="555-555-5555"
          />
        </label>
        <label>
          <span>Student name</span>
          <input
            type="text"
            value={studentName}
            onChange={(event) => setStudentName(event.target.value)}
            className="input"
            placeholder="Skylar"
          />
        </label>
        <label>
          <span>Typing.com username (optional)</span>
          <input
            type="text"
            value={typingUsername}
            onChange={(event) => setTypingUsername(event.target.value)}
            className="input"
            placeholder="typingKid123"
          />
        </label>
        <label>
          <span>Existing student ID (optional)</span>
          <input
            type="text"
            value={existingStudentId}
            onChange={(event) => setExistingStudentId(event.target.value)}
            className="input"
            placeholder="Use if you already have an assigned ID"
          />
        </label>
        <label>
          <span>Price (cents)</span>
          <input
            type="number"
            value={priceCents}
            onChange={(event) => setPriceCents(event.target.value)}
            className="input"
          />
        </label>
      </div>
      {lastStudentId ? (
        <p className="form-help" style={{ marginTop: "0.75rem", color: "var(--brand-700)" }}>
          Saved profile linked to student #{lastStudentId}.
        </p>
      ) : null}
    </div>
  );
}

const inputStyle: CSSProperties = {
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #cbd5f5",
  width: "100%",
};
