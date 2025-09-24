import React from "react";
import { BOOKING_BASE_URL } from "../config";

const CTASection = () => (
  <section className="cta-section">
    <div className="container cta-container">
      <div>
        <div className="section-label">Ready when you are</div>
        <h2 className="section-title">Give your child a typing coach who keeps things calm and joyful.</h2>
        <p className="section-subtitle">
          Pick a class time, we will send the Google Meet link and Launchpad, and you can relax knowing practice is handled.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href={`${BOOKING_BASE_URL}/programs`}>
            Choose a class time
          </a>
          <a className="btn btn-secondary" href="mailto:hello@serenitykeys.com">
            Ask a question
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default CTASection;
