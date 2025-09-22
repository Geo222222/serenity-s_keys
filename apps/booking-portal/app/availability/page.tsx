import Link from "next/link";

import { AvailabilityClient } from "../../components/availability-client";
import { API_BASE_URL } from "../../lib/config";

export const dynamic = "force-dynamic";

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

async function fetchSessions(course: string): Promise<Session[]> {
  const response = await fetch(`${API_BASE_URL}/api/availability`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ course }),
    cache: "no-store",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail ?? "Unable to load availability.");
  }
  return response.json();
}

type PageProps = {
  searchParams: {
    course?: string;
    price?: string;
  };
};

export default async function AvailabilityPage({ searchParams }: PageProps) {
  const course = searchParams.course;
  const suggestedPrice = Number(searchParams.price ?? "");
  const fallbackPrice = Number.isFinite(suggestedPrice) && suggestedPrice > 0 ? suggestedPrice : 8900;

  if (!course) {
    return (
      <section>
        <h2>Pick a program first</h2>
        <p>Please head back to the program list to choose the right course for your learner.</p>
        <Link href="/programs" style={{ color: "#2563eb", fontWeight: 600 }}>
          View programs
        </Link>
      </section>
    );
  }

  try {
    const sessions = await fetchSessions(course);
    return (
      <div className="stack">
        <AvailabilityClient
          course={course}
          sessions={sessions}
          suggestedPriceCents={fallbackPrice}
          apiBaseUrl={API_BASE_URL}
        />
        <p className="mt-6">
          <Link href="/programs" className="button secondary">
            ← Back to programs
          </Link>
        </p>
      </div>
    );
  } catch (error) {
    return (
      <section>
        <h2>Availability temporarily unavailable</h2>
        <p style={{ color: "#b91c1c" }}>
          {error instanceof Error ? error.message : "Please try again in a moment."}
        </p>
        <p>
          <Link href="/programs" style={{ color: "#2563eb", fontWeight: 600 }}>
            ? Back to programs
          </Link>
        </p>
      </section>
    );
  }
}
