import React from "react";
import { BOOKING_BASE_URL } from "../config";

const Hero = () => (
  <section className="hero">
    <div className="container hero-content">
      <div>
        <span className="hero-badge">Live on Google Meet · Built on Typing.com</span>
        <h1 className="section-title">Live typing classes kids love. Progress parents can see.</h1>
        <p className="section-subtitle">
          Structured Google Meet sessions using Typing.com, with crystal-clear progress emails after each class.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href={${BOOKING_BASE_URL}/programs}>
            Book a Class
          </a>
          <a className="btn btn-secondary" href='/how-it-works'>
            How it Works
          </a>
        </div>
      </div>
      <div className="hero-visual">
        <div style={{
          background: "linear-gradient(160deg, rgba(37,99,235,0.12), rgba(14,165,233,0.16))",
          borderRadius: "24px",
          padding: "28px",
          boxShadow: "var(--shadow-md)",
        }}>
          <h3 style={{ marginTop: 0 }}>Today's Session Plan</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "14px" }}>
            <li>
              <strong>Warm-up:</strong> 3-minute home-row sprint
            </li>
            <li>
              <strong>Focus:</strong> Accuracy drills on Typing.com
            </li>
            <li>
              <strong>Goal:</strong> +3 WPM over last class
            </li>
            <li>
              <strong>Progress email:</strong> Sent right after class
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
