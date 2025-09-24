import React from "react";
import { BOOKING_BASE_URL } from "../config";

const Hero = () => (
  <section className="hero">
    <div className="hero-gradient" aria-hidden="true" />
    <div className="container hero-content">
      <div className="hero-copy">
        <span className="hero-badge">Serenity started typing at 3 - your child can too</span>
        <h1 className="section-title">A calm, happy typing class - right from your kitchen table.</h1>
        <p className="section-subtitle">
          Small groups on Google Meet. Friendly coach. Typing.com missions matched to your child's age. A short progress note after every class.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href={`${BOOKING_BASE_URL}/programs`}>
            See age 3+ programs
          </a>
          <a className="btn btn-secondary" href="/how-it-works">
            How it works (2 min)
          </a>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-visual-card">
          <h3>Today's micro-rotation</h3>
          <ul>
            <li><strong>Warm-up:</strong> Finger-play story for preschoolers or a 5 minute home-row sprint for older kids.</li>
            <li><strong>Focus:</strong> Typing.com mission matched to attention span and current skill.</li>
            <li><strong>Coach cue:</strong> Calm reminders, lots of praise, gentle adjustments.</li>
            <li><strong>Parent recap:</strong> Short email with wins and next practice idea.</li>
          </ul>
        </div>
        <div className="hero-floating-card">
          <span className="hero-floating-card__eyebrow">Next open cohort</span>
          <strong>Mini Movers (Mon / Wed / Fri)</strong>
          <p>3:30pm Central - 30 minute class - limit 3 kiddos.</p>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
