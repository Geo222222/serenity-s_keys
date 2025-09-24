import React from "react";
import { usePageMetadata } from "../hooks/usePageMetadata";
import { BOOKING_BASE_URL } from "../config";

const Roadmap = () => {
  usePageMetadata({
    title: "12-Week Progress Roadmap | Serenity's Keys",
    description: "Download the 12-week typing roadmap families use to track WPM, accuracy, and focus skills at home.",
  });

  return (
    <main id="main-content">
      <section>
        <div className="container">
          <div className="section-label">Roadmap</div>
          <h1 className="section-title">12-Week Typing Progress Roadmap</h1>
          <p className="section-subtitle">
            Follow the week-by-week milestones we share with families. Download the PDF to keep practice aligned between classes.
          </p>
          <div className="hero-actions" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a className="btn btn-primary" href="/roadmap.pdf" target="_blank" rel="noopener">
              Download the PDF
            </a>
            <a className="btn btn-secondary" href={`${BOOKING_BASE_URL}/programs`}>
              Browse programs
            </a>
            <a className="btn btn-tertiary" href="/try-typing">
              Try the Typing Playground
            </a>
          </div>
          <div
            className="card"
            style={{
              marginTop: "32px",
              padding: "24px",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>What parents track weekly</h2>
            <ul className="pricing-list">
              <li>WPM and accuracy goals for each two-week block.</li>
              <li>At-home cues for posture, breaks, and focus habits.</li>
              <li>Long-term fluency benchmarks through middle school.</li>
            </ul>
          </div>
          <iframe
            src="/roadmap.pdf"
            style={{ width: "100%", height: "800px", border: "none", marginTop: "32px" }}
            title="12-Week Roadmap"
          />
        </div>
      </section>
    </main>
  );
};

export default Roadmap;