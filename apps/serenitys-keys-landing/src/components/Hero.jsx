import React from "react";
import { BOOKING_BASE_URL } from "../config";

const Hero = () => (
  <section className="hero">
    <div className="hero-gradient" aria-hidden="true" />
    <div className="container hero-content">
      <div>
        <span className="hero-badge">Serenity started typing at 3 · Your child can too</span>
        <h1 className="section-title">Plant confident typing habits before little hands pick up bad ones.</h1>
        <p className="section-subtitle">
          Our live Google Meet coaches guide beginners as young as age 3 through playful Typing.com adventures, then grow skills all the way to teen-level fluency - with a clear progress email after every class.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href={`${BOOKING_BASE_URL}/programs`}>
            See age 3+ programs
          </a>
          <a className="btn btn-secondary" href="/how-it-works">
            How we keep kids engaged
          </a>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-visual-card">
          <h3>Today's Micro-Rotation</h3>
          <ul>
            <li>
              <strong>Warm-up:</strong> Finger-play story for preschoolers / 5-minute home-row sprint for older kids
            </li>
            <li>
              <strong>Focus:</strong> Guided Typing.com mission matched to age and attention span
            </li>
            <li>
              <strong>Coach cue:</strong> Positive language that keeps tiny typists curious
            </li>
            <li>
              <strong>Parent recap:</strong> WPM, accuracy, and next-at-home prompt in your inbox
            </li>
          </ul>
        </div>
        <div className="hero-floating-card">
          <span className="hero-floating-card__eyebrow">Next open cohort</span>
          <strong>Mini Movers · Mon / Wed / Fri</strong>
          <p>3:30pm CT · 30 minutes · Limit 3 kiddos</p>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;

