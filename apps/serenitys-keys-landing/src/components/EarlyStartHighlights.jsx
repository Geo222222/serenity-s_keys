import React from "react";

const HIGHLIGHTS = [
  {
    title: "Brain wiring loves repetition",
    copy: "Fine-motor patterns set early. Ages 3-5 build muscle memory with playful rhythms before poor habits form.",
    stat: "90%",
    statLabel: "of neural growth occurs before age 6",
  },
  {
    title: "Keyboard confidence beats frustration",
    copy: "We blend colors, songs, and movement cues so little ones stay curious while parents see measurable gains.",
    stat: "15 min",
    statLabel: "micro-sprints keep attention happy",
  },
  {
    title: "Momentum that sticks for school",
    copy: "By the time handwriting shifts to keyboards, your child already types with purpose and care.",
    stat: "3x",
    statLabel: "faster growth than unguided practice",
  },
];

const EarlyStartHighlights = () => (
  <section className="alt">
    <div className="container">
      <div className="section-label">Why start this young?</div>
      <h2 className="section-title">Serenity's path proves early typing is a superpower</h2>
      <p className="section-subtitle" style={{ maxWidth: "760px" }}>
        Serenity began at age 3, and we shaped this academy around what kept her engaged - movement breaks, imaginative prompts, and gentle accountability. Now we bring that same journey to your family.
      </p>
      <div className="card-grid cards-3">
        {HIGHLIGHTS.map((highlight) => (
          <article
            key={highlight.title}
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              padding: "28px",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-sm)",
              display: "grid",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <span style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--color-primary)" }}>{highlight.stat}</span>
              <span style={{ color: "var(--color-muted)", fontWeight: 600 }}>{highlight.statLabel}</span>
            </div>
            <h3 style={{ margin: 0 }}>{highlight.title}</h3>
            <p style={{ margin: 0, color: "var(--color-muted)" }}>{highlight.copy}</p>
          </article>
        ))}
      </div>
      <div className="hero-actions" style={{ marginTop: "32px" }}>
        <a className="btn btn-secondary" href="/why-typing">
          Dive deeper into benefits
        </a>
      </div>
    </div>
  </section>
);

export default EarlyStartHighlights;
