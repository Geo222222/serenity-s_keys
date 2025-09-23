import React from "react";
import { BOOKING_BASE_URL } from "../config";

const Hero = () => (
  <section className="hero">
    <div className="container hero-content">
      <div>
        <span className="hero-badge">Serenity started typing at 3 · Your child can too</span>
        <h1 className="section-title">Plant confident typing habits before little hands pick up bad ones.</h1>
        <p className="section-subtitle">
          Our live Google Meet coaches guide beginners as young as age 3 through playful Typing.com adventures, then grow skills all the way to teen-level fluency—with a clear progress email after every class.
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
        <div
          style={{
            background: "linear-gradient(160deg, rgba(37,99,235,0.12), rgba(14,165,233,0.16))",
            borderRadius: "24px",
            padding: "28px",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Today's Micro-Rotation</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "14px" }}>
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
      </div>
    </div>
  </section>
);

export default Hero;
