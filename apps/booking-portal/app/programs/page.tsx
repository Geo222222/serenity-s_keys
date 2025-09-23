import type { CSSProperties } from "react";

const PROGRAMS = [
  {
    id: "group:3-5",
    name: "Mini Movers Ages 3-5",
    blurb: "Sensory-rich 30 minute sessions to spark curiosity and healthy habits.",
    defaultPriceCents: 3500,
  },
  {
    id: "group:6-8",
    name: "Group Ages 6-8",
    blurb: "Foundations and fun race challenges for younger typists.",
    defaultPriceCents: 8900,
  },
  {
    id: "group:9-11",
    name: "Group Ages 9-11",
    blurb: "Skill building and accuracy drills with peers.",
    defaultPriceCents: 8900,
  },
  {
    id: "group:12-14",
    name: "Group Ages 12-14",
    blurb: "Speed, ergonomics, and productivity shortcuts.",
    defaultPriceCents: 8900,
  },
  {
    id: "private:all",
    name: "Private Coaching",
    blurb: "One-on-one remote coaching tailored to the student.",
    defaultPriceCents: 12900,
  },
] as const;

const boxStyle: CSSProperties = {
  border: "1px solid #cbd5f5",
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "16px",
  backgroundColor: "white",
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.08)",
};

export default function ProgramsPage() {
  return (
    <section className="stack">
      <div>
        <h2 className="h-display">Choose a program</h2>
        <p style={{ maxWidth: 640 }}>
          Pick the cohort that fits your learner. You'll confirm a time, enter the student ID, and reserve the spot with checkout.
        </p>
      </div>
      <div className="stack">
        {PROGRAMS.map((program) => (
          <article key={program.id} className="card elevate">
            <h3 className="card-title">{program.name}</h3>
            <p className="card-subtitle">{program.blurb}</p>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700 }}>
                Suggested price: ${(program.defaultPriceCents / 100).toFixed(2)}
              </span>
              <a
                href={`/availability?course=${encodeURIComponent(program.id)}&price=${program.defaultPriceCents}`}
                className="button primary"
              >
                See availability
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
