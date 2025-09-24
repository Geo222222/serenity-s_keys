import React from "react";
import { BOOKING_BASE_URL } from "../config";

const ProgramCard = ({ course, title, description, details, outcomes, benchmarks = [] }) => (
  <div
    style={{
      background: "var(--color-surface)",
      borderRadius: "var(--radius-lg)",
      padding: "28px",
      border: "1px solid var(--color-border)",
      boxShadow: "var(--shadow-sm)",
      display: "flex",
      flexDirection: "column",
      gap: "18px",
    }}
  >
    <div className="badge">{course}</div>
    <h3 style={{ margin: "0" }}>{title}</h3>
    <p style={{ margin: 0, color: "var(--color-muted)" }}>{description}</p>
    {benchmarks.length > 0 && (
      <div className="pill-row">
        {benchmarks.map((item) => (
          <span key={item} className="pill">{item}</span>
        ))}
      </div>
    )}
    <ul className="pricing-list">
      {details.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
    <div>
      <h4 style={{ marginBottom: "8px" }}>Focus This Session</h4>
      <ul className="pricing-list">
        {outcomes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
    <a
      className="btn btn-primary"
      href={`${BOOKING_BASE_URL}/programs?course=${encodeURIComponent(course)}`}
    >
      View Availability
    </a>
  </div>
);

export default ProgramCard;
