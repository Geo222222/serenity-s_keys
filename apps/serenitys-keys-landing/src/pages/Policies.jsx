import React from "react";
import { usePageMetadata } from "../hooks/usePageMetadata";

const Policies = () => {
  usePageMetadata({
    title: "Policies & Privacy | Serenity's Keys",
    description: "Refunds, cancellations, and privacy guidelines for Serenity's Keys typing classes.",
  });

  return (
    <main id="main-content">
      <section>
        <div className="container">
          <div className="section-label">Policies</div>
          <h1 className="section-title">Plain-English policies for families</h1>
          <div className="alert alert-info">
            <strong>Quick answers:</strong> 24-hr cancel = full credit | No recordings | Minimal data kept.
          </div>
          <div className="card-grid">
            <article className="step">
              <h3>Refunds & rescheduling</h3>
              <ul className="pricing-list" style={{ marginTop: "16px" }}>
                <li>Cancel or reschedule with 24 hours' notice for full credit.</li>
                <li>Same-day cancellations receive a 50% credit.</li>
                <li>No-shows count as used sessions; email us if an emergency happens.</li>
              </ul>
            </article>
            <article className="step">
              <h3>Session experience</h3>
              <ul className="pricing-list" style={{ marginTop: "16px" }}>
                <li>Google Meet is the classroom. Teachers are background checked.</li>
                <li>No recordings by default. Parents can join the call at any time.</li>
                <li>Launchpad links are unique to your family - please do not share publicly.</li>
              </ul>
            </article>
            <article className="step">
              <h3>Privacy & data</h3>
              <ul className="pricing-list" style={{ marginTop: "16px" }}>
                <li>We store only first name, Typing.com username, and session metrics.</li>
                <li>Typing.com passwords remain with you; we never ask for them.</li>
                <li>Progress emails go to the parent email on file unless you add more recipients.</li>
              </ul>
            </article>
            <article className="step">
              <h3>Communications</h3>
              <ul className="pricing-list" style={{ marginTop: "16px" }}>
                <li>We email progress summaries after each class.</li>
                <li>We may text or email reminders if a session is at risk of being missed.</li>
                <li>AI Mentor waitlist updates will only go to families who opt in.</li>
              </ul>
            </article>
          </div>
          <p style={{ marginTop: "32px", color: "var(--color-muted)" }}>
            Questions? Email <a href="mailto:hello@serenitykeys.com">hello@serenitykeys.com</a> and we'll respond within one business day.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Policies;
