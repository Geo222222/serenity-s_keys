import React from "react";
import { usePageMetadata } from "../hooks/usePageMetadata";
import { BOOKING_BASE_URL } from "../config";
import EarlyStartHighlights from "../components/EarlyStartHighlights";

const REASONS = [
  {
    title: "Typing is a core literacy",
    copy:
      "Schools shift to keyboards by grade 3. Kids who practice early read and write with more confidence because typing keeps up with their ideas.",
  },
  {
    title: "Fine motor development",
    copy:
      "Research from the Journal of Early Childhood Education shows coordinated finger movement strengthens neural pathways that support reading and math.",
  },
  {
    title: "Reduces tech frustration",
    copy:
      "Children who know where keys live stay calm on Chromebooks - no more tears during online homework or assessments.",
  },
];

const MYTHS = [
  {
    myth: "We should wait until handwriting is perfect.",
    fact:
      "Balance both. Light typing practice complements handwriting by training bilateral coordination and a relaxed grip.",
  },
  {
    myth: "Tablets are enough.",
    fact:
      "Tablets build swipe skills. Keyboards build speed, accuracy, and future-ready communication.",
  },
  {
    myth: "Typing lessons will bore my preschooler.",
    fact:
      "Our Mini Movers sessions use stories, songs, and movement. Attention spans stay happy and parents see progress.",
  },
];

const SUCCESS_POINTS = [
  {
    icon: "[focus]",
    stat: "2.5x",
    label: "more likely to enjoy writing assignments",
    detail: "Typing keeps pace with their ideas so writing feels fun, not frustrating.",
  },
  {
    icon: "[books]",
    stat: "28%",
    label: "increase in reading comprehension",
    detail: "Keyboard comfort frees brain space for stories, boosting focus & planning skills.",
  },
  {
    icon: "[clock]",
    stat: "10 mins",
    label: "saved on nightly homework",
    detail: "Faster typing shortens Chromebook time so evenings feel calmer for everyone.",
  },
];

const WhyTyping = () => {
  usePageMetadata({
    title: "Why Typing Early Matters | Serenity's Keys",
    description:
      "Discover the research behind age 3+ typing lessons, how motor skills form, and why early practice keeps kids confident on computers.",
  });

  return (
    <main id="main-content">
      <section>
        <div className="container">
          <div className="section-label">Why typing early?</div>
          <h1 className="section-title">Early exposure builds lifelong digital confidence</h1>
          <p className="section-subtitle" style={{ maxWidth: "780px" }}>
            Adults remember the hunt-and-peck struggle. Serenity's Keys removes that frustration by meeting children when their brains are ready for patterns - starting at age 3 - and keeping momentum into the tween years.
          </p>
          <div className="card-grid cards-3">
            {REASONS.map((reason) => (
              <article
                key={reason.title}
                style={{
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-lg)",
                  padding: "28px",
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-sm)",
                  display: "grid",
                  gap: "14px",
                }}
              >
                <h3 style={{ margin: 0 }}>{reason.title}</h3>
                <p style={{ margin: 0, color: "var(--color-muted)" }}>{reason.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <EarlyStartHighlights />
      <section id="research">
        <div className="container">
          <div className="section-label">What the research shows</div>
          <h2 className="section-title">Typing early supports language, focus & planning skills, and confidence</h2>
          <div className="card-grid cards-3">
            {SUCCESS_POINTS.map((point) => (
              <article key={point.label} className="stat-card">
                <span className="stat-icon" aria-hidden="true">{point.icon}</span>
                <div className="stat-copy">
                  <div className="stat-value">{point.stat}</div>
                  <div className="stat-label">{point.label}</div>
                </div>
                <p className="stat-detail">{point.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="alt">
        <div className="container">
          <div className="section-label">Myths vs. reality</div>
          <h2 className="section-title">What parents often hear - and what actually helps</h2>
          <div className="card-grid">
            {MYTHS.map((item) => (
              <article key={item.myth} className="accordion-item" style={{ padding: "20px" }}>
                <h3 style={{ marginTop: 0 }}>Myth: {item.myth}</h3>
                <p style={{ color: "var(--color-muted)", marginBottom: 0 }}>Reality: {item.fact}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-label">Next steps</div>
          <h2 className="section-title">We've done the research - now let's build their confidence</h2>
          <p className="section-subtitle" style={{ maxWidth: "720px" }}>
            Explore classes for ages 3 and up, meet the coach team, and reserve a spot. We'll handle Stripe billing and Google Calendar invites while you cheer from the sidelines.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={`${BOOKING_BASE_URL}/programs`}>
              Browse programs
            </a>
            <a className="btn btn-secondary" href="/roadmap.pdf" target="_blank" rel="noopener">
              See the 12-Week Roadmap
            </a>
            <a className="btn btn-secondary" href="/contact">
              Talk to a coach
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default WhyTyping;


