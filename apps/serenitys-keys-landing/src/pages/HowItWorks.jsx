import React from "react";
import { usePageMetadata } from "../hooks/usePageMetadata";
import { BOOKING_BASE_URL } from "../config";

const TIMELINE = [
  {
    title: "Book your session",
    description: "Pick the right program in our booking portal, finish Stripe checkout (rolling out now), and reserve your spot instantly.",
  },
  {
    title: "Open the Launchpad",
    description: "One link opens Google Meet, Typing.com, and coach notes. Calendar invites land in your inbox so even preschoolers can click and go.",
  },
  {
    title: "Coach-led typing adventures",
    description: "Teachers guide movement-rich warm-ups, story-based drills for little learners, and accuracy sprints for big kids.",
  },
  {
    title: "Progress email to parents",
    description: (
      <>
        We capture WPM, accuracy, goals met, and at-home prompts tailored to your child's age and energy.{' '}
        <a href="/roadmap.pdf" target="_blank" rel="noopener">
          Track growth with our 12-Week Progress Roadmap.
        </a>
      </>
    ),
  },
];

const RESPONSIBILITIES = [
  "Create a free Typing.com account for your child and share the username.",
  "Ensure a laptop/Chromebook with a full keyboard, camera, microphone, and stable internet.",
  "For ages 3-5, plan to sit nearby for the first few classes - our coaches will cue you when it is okay to step back.",
  "Encourage practice between classes using the drills we recommend in the progress email.",
];

const HowItWorks = () => {
  usePageMetadata({
    title: "How It Works | Serenity's Keys",
    description: "Book, launch, learn, and receive a progress summary - even for brand-new typists starting at age 3.",
  });

  return (
    <main id="main-content">
      <section>
        <div className="container">
          <div className="section-label">Process</div>
          <h1 className="section-title">What happens after you press "Book a Class"</h1>
          <p className="section-subtitle">
            We obsess over logistics so your child can focus on typing and you can focus on celebrating progress.
          </p>
          <div className="timeline">
            {TIMELINE.map((item) => (
              <div key={item.title} className="timeline-entry">
                <h3 style={{ marginTop: 0 }}>{item.title}</h3>
                <p style={{ color: "var(--color-muted)" }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="alt">
        <div className="container contact-grid">
          <div>
            <div className="section-label">Launchpad snapshots</div>
            <h2 className="section-title">Built to keep every remote class tidy</h2>
            <p className="section-subtitle">
              When class starts, your child opens Launchpad. It displays the Meet link, their Typing.com assignment, and coach notes. If they get disconnected, the same link brings them back instantly.
            </p>
            <div className="launchpad-gallery">
              <img src="/images/launchpad-1.png" alt="Launchpad showing Meet link, Typing.com, and coach notes" />
              <img src="/images/launchpad-2.png" alt="Launchpad assignment list placeholder" />
              <img src="/images/launchpad-3.png" alt="Example progress email preview" />
            </div>
            <a className="btn btn-secondary" href={`${BOOKING_BASE_URL}/launchpad`}>
              Preview the Launchpad
            </a>
          </div>
          <div
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              padding: "24px",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <strong>Parent checklist before class</strong>
            <ul className="pricing-list" style={{ marginTop: "16px" }}>
              {RESPONSIBILITIES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-label">Safety & privacy</div>
          <h2 className="section-title">Calm, private, and parent-approved</h2>
          <div className="card-grid">
            <div className="step">
              <h3>Meet is never recorded</h3>
              <p>We run cameras on for accountability, but we do not record. Coaches are background-checked educators.</p>
            </div>
            <div className="step">
              <h3>Minimal data</h3>
              <p>We store your child's first name, Typing.com username, and progress metrics - nothing else.</p>
            </div>
            <div className="step">
              <h3>Parent always looped in</h3>
              <p>Every session triggers a progress email; you always know what happened and what's next.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HowItWorks;
